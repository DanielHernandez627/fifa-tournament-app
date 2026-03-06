import { Component, OnInit } from '@angular/core';
import { TeamsApiService } from '../../services/teams-api.service';
import { Team } from '../../../../shared/models';

@Component({
    selector: 'app-team-list', templateUrl: './team-list.component.html',
    standalone: false
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  displayedColumns = ['name', 'tournamentId', 'actions'];

  constructor(private api: TeamsApiService) {}
  ngOnInit(): void { this.loading = true; this.api.getAll().subscribe({ next: d => { this.teams = d; this.loading = false; }, error: () => this.loading = false }); }
  trackById(_: number, t: Team): string { return t.id; }
}
