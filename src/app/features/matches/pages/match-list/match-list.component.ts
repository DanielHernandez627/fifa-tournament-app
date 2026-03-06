import { Component, OnInit } from '@angular/core';
import { MatchesApiService } from '../../services/matches-api.service';
import { Match } from '../../../../shared/models';

@Component({
    selector: 'app-match-list', templateUrl: './match-list.component.html',
    standalone: false
})
export class MatchListComponent implements OnInit {
  matches: Match[] = [];
  loading = false;
  displayedColumns = ['matchday','homeTeam','score','awayTeam','status','actions'];
  constructor(private api: MatchesApiService) {}
  ngOnInit(): void { this.loading = true; this.api.getAll().subscribe({ next: d => { this.matches = d; this.loading = false; }, error: () => this.loading = false }); }
}
