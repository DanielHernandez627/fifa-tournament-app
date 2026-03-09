import { Component, OnInit } from '@angular/core';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { TournamentStateService } from '../../services/tournament-state.service';
import { Tournament, TournamentStats, TournamentStatsListItem } from '../../../../shared/models';

@Component({
    selector: 'app-tournament-list',
    templateUrl: './tournament-list.component.html',
    styleUrls: ['./tournament-list.component.scss'],
    standalone: false
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  statsByTournamentId: Record<string, TournamentStats> = {};
  loading = false;

  constructor(
    private api: TournamentsApiService,
    private state: TournamentStateService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAllWithStats().subscribe({
      next: (data) => {
        this.tournaments = data.map((item) => this.mapToTournament(item));
        this.statsByTournamentId = data.reduce<Record<string, TournamentStats>>((acc, item) => {
          const key = String(item.tournamentId);
          acc[key] = {
            tournamentId: item.tournamentId,
            totalTeams: item.totalTeams,
            totalPhases: item.totalPhases,
            totalMatches: item.totalMatches,
          };
          return acc;
        }, {});

        this.state.setTournaments(this.tournaments);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getStats(tournamentId: string): TournamentStats | undefined {
    return this.statsByTournamentId[tournamentId];
  }

  private mapToTournament(item: TournamentStatsListItem): Tournament {
    return {
      id: String(item.tournamentId),
      name: item.name,
      type: item.type,
      userId: '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  trackById(_: number, t: Tournament): string {
    return t.id;
  }
}
