import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  Tournament, CreateTournamentDto, UpdateTournamentDto,
  Match, MatchResultDto, Phase, StandingsRow,
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class TournamentsApiService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Tournament[]> {
    return this.api.get<Tournament[]>('/tournaments');
  }

  getById(id: string): Observable<Tournament> {
    return this.api.get<Tournament>(`/tournaments/${id}`);
  }

  create(dto: CreateTournamentDto): Observable<Tournament> {
    return this.api.post<Tournament>('/tournaments', dto);
  }

  update(id: string, dto: UpdateTournamentDto): Observable<Tournament> {
    return this.api.put<Tournament>(`/tournaments/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/tournaments/${id}`);
  }

  getStandings(id: string): Observable<StandingsRow[]> {
    return this.api.get<StandingsRow[]>(`/tournaments/${id}/standings`);
  }

  generateLeagueFixtures(id: string): Observable<Match[]> {
    return this.api.post<Match[]>(`/tournaments/${id}/fixtures/league`);
  }

  generateQuadrangularFixtures(id: string): Observable<Match[]> {
    return this.api.post<Match[]>(`/tournaments/${id}/fixtures/quadrangular`);
  }

  generateFinalFixtures(id: string): Observable<Match[]> {
    return this.api.post<Match[]>(`/tournaments/${id}/fixtures/final`);
  }

  registerMatchResult(matchId: string, dto: MatchResultDto): Observable<Match> {
    return this.api.post<Match>(`/tournaments/matches/${matchId}/result`, dto);
  }

  closePhase(phaseId: string): Observable<Phase> {
    return this.api.post<Phase>(`/tournaments/phases/${phaseId}/close`);
  }

  advanceTournament(tournamentId: string): Observable<Tournament> {
    return this.api.post<Tournament>(`/tournaments/${tournamentId}/phases/advance`);
  }
}
