import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandingsApiService } from '../../services/standings-api.service';
import { StandingsRow } from '../../../../shared/models';

@Component({
    selector: 'app-standings-view',
    templateUrl: './standings-view.component.html',
    styleUrls: ['./standings-view.component.scss'],
    standalone: false
})
export class StandingsViewComponent implements OnInit {
  tournamentId!: string;
  rows: StandingsRow[] = [];
  loading = false;

  displayedColumns = [
    'rank','teamName','played','won','drawn','lost',
    'goalsFor','goalsAgainst','goalDifference','points'
  ];

  constructor(
    private route: ActivatedRoute,
    private api: StandingsApiService
  ) {}

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getByTournament(this.tournamentId).subscribe({
      next: (data) => { this.rows = data; this.loading = false; },
      error: () => (this.loading = false),
    });
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
