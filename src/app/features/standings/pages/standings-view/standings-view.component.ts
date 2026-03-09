import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandingsApiService } from '../../services/standings-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TournamentsApiService } from '../../../tournaments/services/tournaments-api.service';
import { PhaseStatus, StandingsRow, Tournament } from '../../../../shared/models';

@Component({
    selector: 'app-standings-view',
    templateUrl: './standings-view.component.html',
    styleUrls: ['./standings-view.component.scss'],
    standalone: false
})
export class StandingsViewComponent implements OnInit {
  tournamentId = '';
  selectedTournamentId = '';
  hasRouteTournamentId = false;

  tournaments: Tournament[] = [];
  tournamentsLoading = false;

  rows: StandingsRow[] = [];
  phaseName = '';
  phaseStatus?: PhaseStatus;
  loading = false;

  displayedColumns = [
    'rank','teamName','played','won','drawn','lost',
    'goalsFor','goalsAgainst','goalDifference','points'
  ];

  constructor(
    private route: ActivatedRoute,
    private api: StandingsApiService,
    private tournamentsApi: TournamentsApiService,
    private notify: NotificationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.paramMap.get('id')
      ?? this.route.parent?.snapshot.paramMap.get('id')
      ?? '';

    this.hasRouteTournamentId = Boolean(this.tournamentId);

    if (this.hasRouteTournamentId) {
      this.load();
      return;
    }

    this.loadTournaments();
  }

  load(): void {
    if (!this.tournamentId) {
      return;
    }

    this.loading = true;
    this.rows = [];
    this.phaseName = '';
    this.phaseStatus = undefined;

    this.api.getByTournament(this.tournamentId).subscribe({
      next: (data) => {
        this.rows = data.standings ?? [];
        this.phaseName = data.phaseName;
        this.phaseStatus = data.phaseStatus;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('No se pudo cargar la tabla de posiciones');
      },
    });
  }

  onLoadSelectedTournament(): void {
    if (!this.selectedTournamentId) {
      this.notify.error('Selecciona un torneo para consultar la tabla');
      return;
    }

    this.tournamentId = this.selectedTournamentId;
    this.load();
  }

  private loadTournaments(): void {
    this.tournamentsLoading = true;
    this.tournamentsApi.getAll().subscribe({
      next: (data) => {
        const tokenPayload = this.auth.getTokenPayload();
        const currentUserId = this.normalizeId(tokenPayload?.id ?? tokenPayload?.sub);

        this.tournaments = currentUserId
          ? data.filter((tournament) => this.normalizeId(tournament.userId) === currentUserId)
          : data;

        this.tournamentsLoading = false;
      },
      error: () => {
        this.tournamentsLoading = false;
        this.notify.error('No se pudieron cargar los torneos');
      }
    });
  }

  private normalizeId(value: unknown): string | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    return null;
  }

  getRankClass(index: number): string {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-n';
  }

  isQualified(index: number): boolean {
    return index < 4;
  }
}
