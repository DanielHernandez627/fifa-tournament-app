import { Component, OnInit } from '@angular/core';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { TournamentStateService } from '../../services/tournament-state.service';
import { Tournament } from '../../../../shared/models';

@Component({
    selector: 'app-tournament-list',
    templateUrl: './tournament-list.component.html',
    styleUrls: ['./tournament-list.component.scss'],
    standalone: false
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
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
    this.api.getAll().subscribe({
      next: (data) => {
        this.tournaments = data;
        this.state.setTournaments(data);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  trackById(_: number, t: Tournament): string {
    return t.id;
  }
}
