import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Match, CreateMatchDto, UpdateMatchDto } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class MatchesApiService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Match[]> {
    return this.api.get<Match[]>('/matches');
  }

  getById(id: string): Observable<Match> {
    return this.api.get<Match>(`/matches/${id}`);
  }

  create(dto: CreateMatchDto): Observable<Match> {
    return this.api.post<Match>('/matches', dto);
  }

  update(id: string, dto: UpdateMatchDto): Observable<Match> {
    return this.api.put<Match>(`/matches/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/matches/${id}`);
  }
}
