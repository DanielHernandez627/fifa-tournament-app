import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { PhasesApiService } from '../../../phases/services/phases-api.service';
import { MatchesApiService } from '../../../matches/services/matches-api.service';
import { Tournament, Phase, Match, ApiId, MatchdayGroup } from '../../../../shared/models';
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
  activePhaseMatchdays: MatchdayGroup[] = [];

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

  onScoreChange(matchId: ApiId, side: 'homeTeamScore' | 'awayTeamScore', event: Event): void {
    const key = this.toKey(matchId);
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (!this.resultDrafts[key]) {
      this.resultDrafts[key] = { homeTeamScore: null, awayTeamScore: null, overwrite: false };
    }

    if (!value) {
      this.resultDrafts[key][side] = null;
      return;
    }

    const parsed = Number(value);
    this.resultDrafts[key][side] = Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  toggleOverwrite(matchId: ApiId): void {
    const key = this.toKey(matchId);
    const draft = this.resultDrafts[key] ?? { homeTeamScore: null, awayTeamScore: null, overwrite: false };
    this.resultDrafts[key] = { ...draft, overwrite: !draft.overwrite };
  }

  canSaveResult(match: Match): boolean {
    const key = this.toKey(match.id);
    const draft = this.resultDrafts[key];
    if (!draft || this.savingResults[key]) {
      return false;
    }

    return Number.isInteger(draft.homeTeamScore) && Number.isInteger(draft.awayTeamScore);
  }

  onSaveResult(match: Match): void {
    if (!this.canSaveResult(match)) {
      return;
    }

    const key = this.toKey(match.id);
    const draft = this.resultDrafts[key];
    if (!draft) {
      return;
    }

    this.savingResults[key] = true;

    this.api.registerMatchResult(match.id, {
      homeTeamScore: draft.homeTeamScore as number,
      awayTeamScore: draft.awayTeamScore as number,
      ...(draft.overwrite ? { overwrite: true } : {}),
    })
      .pipe(
        switchMap(() => this.fetchTournamentData()),
        finalize(() => (this.savingResults[key] = false))
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

  canManualGenerateFixture(): boolean {
    return Boolean(
      this.activePhase &&
      this.isSupportedManualFixturePhase(this.activePhase) &&
      this.activePhase.status === 'in_progress' &&
      this.activePhaseMatches.length === 0 &&
      !this.loading &&
      !this.advancing &&
      !this.generatingFixture
    );
  }

  onManualGenerateFixture(): void {
    if (!this.canManualGenerateFixture()) {
      return;
    }

    this.generateLeagueStyleFixture('Fixture generado manualmente').subscribe();
  }

  trackByPhase(_: number, phase: Phase): string {
    return phase.id;
  }

  trackByMatch(_: number, match: Match): string {
    return String(match.id);
  }

  matchKey(id: ApiId): string {
    return this.toKey(id);
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
      switchMap(() => this.matchesApi.getAllFlat()),
      tap((allMatches) => {
        const phaseIds = new Set(this.phases.map((phase) => String(phase.id)));
        this.matches = allMatches.filter((match) => phaseIds.has(String(match.phaseId)));
      }),
      tap(() => this.resolveActivePhaseState()),
      map(() => void 0)
    );
  }

  private resolveActivePhaseState(): void {
    this.activePhase = this.phases.find((phase) => phase.status === 'in_progress');
    this.activePhaseMatches = this.activePhase
      ? this.matches.filter((match) => String(match.phaseId) === String(this.activePhase?.id))
      : [];
    this.activePhaseMatchdays = this.groupMatchesByMatchday(this.activePhaseMatches);

    const nextDrafts: Record<string, MatchResultDraft> = {};
    for (const match of this.activePhaseMatches) {
      const key = this.toKey(match.id);
      const existing = this.resultDrafts[key];
      nextDrafts[key] = {
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

    return this.generateLeagueStyleFixture('Fixture de cuadrangular generado automaticamente');
  }

  private generateLeagueStyleFixture(successMessage: string) {
    if (!this.activePhase) {
      return of(void 0);
    }

    const normalizedPhaseName = this.normalizePhaseName(this.activePhase.name);
    const isQuadrangularPhase = normalizedPhaseName.includes('cuadrangular');

    this.generatingFixture = true;
    return this.api.generateLeagueFixtures(this.id, {
      phaseId: this.activePhase.id,
      ...(isQuadrangularPhase ? { doubleRound: true } : {}),
    }).pipe(
      switchMap(() => this.fetchTournamentData()),
      tap(() => this.notify.success(successMessage)),
      map(() => void 0),
      finalize(() => (this.generatingFixture = false))
    );
  }

  private isSupportedManualFixturePhase(phase: Phase): boolean {
    const normalized = this.normalizePhaseName(phase.name);
    return normalized.includes('liga') || normalized.includes('cuadrangular');
  }

  private normalizePhaseName(name: string): string {
    return (name || '').trim().toLowerCase();
  }

  private toKey(id: ApiId): string {
    return String(id);
  }

  private groupMatchesByMatchday(matches: Match[]): MatchdayGroup[] {
    const grouped = new Map<number, Match[]>();

    for (const match of matches) {
      const day = match.matchday ?? 0;
      const dayMatches = grouped.get(day) ?? [];
      dayMatches.push(match);
      grouped.set(day, dayMatches);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([matchday, dayMatches]) => ({
        matchday,
        totalMatches: dayMatches.length,
        matches: dayMatches,
      }));
  }
}
