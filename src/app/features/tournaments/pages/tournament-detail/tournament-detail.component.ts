import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { PhasesApiService } from '../../../phases/services/phases-api.service';
import { MatchesApiService } from '../../../matches/services/matches-api.service';
import { Tournament, Phase, Match } from '../../../../shared/models';
import { TournamentStateService } from '../../services/tournament-state.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { finalize, map, of, switchMap, tap } from 'rxjs';
import { AdvancePhaseResponse } from '../../services/tournaments-api.service';

interface MatchResultDraft {
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  overwrite: boolean;
}

@Component({
    selector: 'app-tournament-detail',
    templateUrl: './tournament-detail.component.html',
    styleUrls: ['./tournament-detail.component.scss'],
    standalone: false
})
export class TournamentDetailComponent implements OnInit {
  id!: string;
  tournament?: Tournament;
  phases: Phase[] = [];
  matches: Match[] = [];
  activePhase?: Phase;
  activePhaseMatches: Match[] = [];

  loading = false;
  advancing = false;
  generatingFixture = false;
  savingResults: Record<string, boolean> = {};
  resultDrafts: Partial<Record<string, MatchResultDraft>> = {};

  constructor(
    private route: ActivatedRoute,
    private api: TournamentsApiService,
    private phasesApi: PhasesApiService,
    private matchesApi: MatchesApiService,
    private state: TournamentStateService,
    private notify: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.fetchTournamentData()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: () => undefined,
      });
  }

  onAdvance(): void {
    if (!this.canAdvancePhase()) {
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.activePhase?.status === 'in_progress' ? 'Avanzar fase' : 'Iniciar fase',
        message: this.activePhase?.status === 'in_progress'
          ? 'Esto cerrara la fase activa y avanzara a la siguiente fase cuando corresponda. Continuar?'
          : 'Se iniciara la siguiente fase programada. Continuar?',
        confirmLabel: this.activePhase?.status === 'in_progress' ? 'Avanzar' : 'Iniciar'
      }
    });

    ref.afterClosed().subscribe(ok => {
      if (!ok) {
        return;
      }

      this.advancing = true;
      this.api.advanceTournament(this.id)
        .pipe(
          switchMap((response) => this.fetchTournamentData().pipe(map(() => response))),
          switchMap((response) => this.ensureQuadrangularFixtureIfNeeded(response).pipe(map(() => response))),
          finalize(() => (this.advancing = false))
        )
        .subscribe({
          next: (response) => {
            this.notify.success(response.message ?? 'Fase actualizada correctamente');
          },
        });
    });
  }

  onScoreChange(matchId: string, side: 'homeTeamScore' | 'awayTeamScore', event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (!this.resultDrafts[matchId]) {
      this.resultDrafts[matchId] = { homeTeamScore: null, awayTeamScore: null, overwrite: false };
    }

    if (!value) {
      this.resultDrafts[matchId][side] = null;
      return;
    }

    const parsed = Number(value);
    this.resultDrafts[matchId][side] = Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  toggleOverwrite(matchId: string): void {
    const draft = this.resultDrafts[matchId] ?? { homeTeamScore: null, awayTeamScore: null, overwrite: false };
    this.resultDrafts[matchId] = { ...draft, overwrite: !draft.overwrite };
  }

  canSaveResult(match: Match): boolean {
    const draft = this.resultDrafts[match.id];
    if (!draft || this.savingResults[match.id]) {
      return false;
    }

    return Number.isInteger(draft.homeTeamScore) && Number.isInteger(draft.awayTeamScore);
  }

  onSaveResult(match: Match): void {
    if (!this.canSaveResult(match)) {
      return;
    }

    const draft = this.resultDrafts[match.id];
    if (!draft) {
      return;
    }

    this.savingResults[match.id] = true;

    this.api.registerMatchResult(match.id, {
      homeTeamScore: draft.homeTeamScore as number,
      awayTeamScore: draft.awayTeamScore as number,
      ...(draft.overwrite ? { overwrite: true } : {}),
    })
      .pipe(
        switchMap(() => this.fetchTournamentData()),
        finalize(() => (this.savingResults[match.id] = false))
      )
      .subscribe({
        next: () => this.notify.success('Resultado registrado correctamente'),
      });
  }

  canAdvancePhase(): boolean {
    if (this.loading || this.advancing || this.generatingFixture) {
      return false;
    }

    if (!this.phases.length) {
      return false;
    }

    const allClosed = this.phases.every((phase) => phase.status === 'closed');
    if (allClosed) {
      return false;
    }

    if (this.activePhase?.status === 'in_progress' && this.hasPendingMatches()) {
      return false;
    }

    return true;
  }

  hasPendingMatches(): boolean {
    return this.activePhaseMatches.some((match) => !match.isPlayed);
  }

  getAdvanceLabel(): string {
    if (this.activePhase?.status === 'in_progress') {
      return 'Avanzar fase';
    }

    if (this.phases.some((phase) => phase.status !== 'closed')) {
      return 'Iniciar fase';
    }

    return 'Fases completas';
  }

  trackByPhase(_: number, phase: Phase): string {
    return phase.id;
  }

  trackByMatch(_: number, match: Match): string {
    return match.id;
  }

  private fetchTournamentData() {
    return of(null).pipe(
      switchMap(() => this.api.getById(this.id)),
      tap((tournament) => {
        this.tournament = tournament;
        this.state.setSelected(tournament);
      }),
      switchMap(() => this.phasesApi.getAll()),
      tap((allPhases) => {
        this.phases = allPhases
          .filter((phase) => `${phase.tournamentId}` === this.id)
          .sort((a, b) => (a.orderNumber ?? 999) - (b.orderNumber ?? 999));
      }),
      switchMap(() => this.matchesApi.getAll()),
      tap((allMatches) => {
        const phaseIds = new Set(this.phases.map((phase) => phase.id));
        this.matches = allMatches.filter((match) => phaseIds.has(match.phaseId));
      }),
      tap(() => this.resolveActivePhaseState()),
      map(() => void 0)
    );
  }

  private resolveActivePhaseState(): void {
    this.activePhase = this.phases.find((phase) => phase.status === 'in_progress');
    this.activePhaseMatches = this.activePhase
      ? this.matches.filter((match) => match.phaseId === this.activePhase?.id)
      : [];

    const nextDrafts: Record<string, MatchResultDraft> = {};
    for (const match of this.activePhaseMatches) {
      const existing = this.resultDrafts[match.id];
      nextDrafts[match.id] = {
        homeTeamScore: existing?.homeTeamScore ?? null,
        awayTeamScore: existing?.awayTeamScore ?? null,
        overwrite: existing?.overwrite ?? false,
      };
    }

    this.resultDrafts = nextDrafts;
  }

  private ensureQuadrangularFixtureIfNeeded(response: AdvancePhaseResponse) {
    if (this.tournament?.type !== 'CUADRANGULAR') {
      return of(void 0);
    }

    if (!this.activePhase || this.activePhase.status !== 'in_progress') {
      return of(void 0);
    }

    if (this.activePhaseMatches.length > 0 || (response.fixture?.length ?? 0) > 0) {
      return of(void 0);
    }

    this.generatingFixture = true;
    return this.api.generateLeagueFixtures(this.id, {
      phaseId: this.activePhase.id,
      doubleRound: true,
    }).pipe(
      switchMap(() => this.fetchTournamentData()),
      tap(() => this.notify.success('Fixture de cuadrangular generado automaticamente')),
      map(() => void 0),
      finalize(() => (this.generatingFixture = false))
    );
  }
}
