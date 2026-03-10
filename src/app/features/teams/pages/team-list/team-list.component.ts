import { Component, OnInit } from '@angular/core';
import { TeamsApiService } from '../../services/teams-api.service';
import { Team } from '../../../../shared/models';
import { TournamentsApiService } from '../../../tournaments/services/tournaments-api.service';
import { forkJoin } from 'rxjs';

interface TeamTournamentGroup {
  tournamentId: string;
  tournamentName: string;
  teams: Team[];
}

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  standalone: false
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  groupedTeams: TeamTournamentGroup[] = [];
  collapsedTournamentIds = new Set<string>();
  loading = false;
  displayedColumns = ['name', 'actions'];

  constructor(
    private api: TeamsApiService,
    private tournamentsApi: TournamentsApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      teams: this.api.getAll(),
      tournaments: this.tournamentsApi.getAll(),
    }).subscribe({
      next: ({ teams, tournaments }) => {
        this.teams = teams;
        const tournamentNameById = new Map(
          tournaments.map((tournament) => [String(tournament.id), tournament.name])
        );

        this.groupedTeams = this.buildGroupedTeams(teams, tournamentNameById);
        this.collapsedTournamentIds.clear();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private buildGroupedTeams(teams: Team[], tournamentNameById: Map<string, string>): TeamTournamentGroup[] {
    const groupsMap = new Map<string, Team[]>();

    for (const team of teams) {
      const tournamentId = String(team.tournamentId);
      const existing = groupsMap.get(tournamentId) ?? [];
      existing.push(team);
      groupsMap.set(tournamentId, existing);
    }

    return Array.from(groupsMap.entries())
      .map(([tournamentId, tournamentTeams]) => ({
        tournamentId,
        tournamentName: tournamentNameById.get(tournamentId) ?? `Torneo ${tournamentId}`,
        teams: [...tournamentTeams].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.tournamentName.localeCompare(b.tournamentName));
  }

  toggleTournament(tournamentId: string): void {
    if (this.collapsedTournamentIds.has(tournamentId)) {
      this.collapsedTournamentIds.delete(tournamentId);
      return;
    }

    this.collapsedTournamentIds.add(tournamentId);
  }

  isTournamentCollapsed(tournamentId: string): boolean {
    return this.collapsedTournamentIds.has(tournamentId);
  }

  trackById(_: number, t: Team): string { return t.id; }
}
