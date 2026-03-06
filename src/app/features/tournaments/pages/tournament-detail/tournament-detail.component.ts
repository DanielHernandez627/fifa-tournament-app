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
  loading = false;
  activeTab = 0;

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
    this.api.getById(this.id).subscribe({
      next: (t) => { this.tournament = t; this.state.setSelected(t); this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  onClosePhase(phaseId: string): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Cerrar fase', message: '¿Cerrar esta fase? No se podrán registrar más resultados.', confirmLabel: 'Cerrar', type: 'danger' }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.api.closePhase(phaseId).subscribe(() => { this.notify.success('Fase cerrada'); this.load(); });
    });
  }

  onAdvance(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Avanzar torneo', message: '¿Avanzar a la siguiente fase del torneo?', confirmLabel: 'Avanzar' }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.api.advanceTournament(this.id).subscribe(() => { this.notify.success('Torneo avanzado'); this.load(); });
    });
  }

  generateFixtures(): void {
    if (!this.tournament) return;
    let obs;
    if (this.tournament.type === 'LIGA') obs = this.api.generateLeagueFixtures(this.id);
    else if (this.tournament.type === 'CUADRANGULAR') obs = this.api.generateQuadrangularFixtures(this.id);
    else obs = this.api.generateFinalFixtures(this.id);
    obs.subscribe(() => this.notify.success('Fixtures generados'));
  }
}
