import { Component, OnInit } from '@angular/core';
import { MatchesApiService } from '../../services/matches-api.service';
import { MatchdayGroup } from '../../../../shared/models';

@Component({
    selector: 'app-match-list', templateUrl: './match-list.component.html',
    standalone: false
})
export class MatchListComponent implements OnInit {
  matchdays: MatchdayGroup[] = [];
  totalMatches = 0;
  loading = false;
  constructor(private api: MatchesApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllGrouped().subscribe({
      next: (response) => {
        this.matchdays = response.matchdays ?? [];
        this.totalMatches = response.totalMatches ?? 0;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
