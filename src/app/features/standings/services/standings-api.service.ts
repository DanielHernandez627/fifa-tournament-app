import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { TournamentStandings } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class StandingsApiService {
  constructor(private api: ApiService) {}

  getByTournament(tournamentId: string): Observable<TournamentStandings> {
    return this.api.get<TournamentStandings>(`/tournaments/${tournamentId}/standings`);
  }
}
