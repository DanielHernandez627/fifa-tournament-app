import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { StandingsRow } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class StandingsApiService {
  constructor(private api: ApiService) {}

  getByTournament(tournamentId: string): Observable<StandingsRow[]> {
    return this.api.get<StandingsRow[]>(`/tournaments/${tournamentId}/standings`);
  }
}
