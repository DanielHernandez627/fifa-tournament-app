import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  Match,
  CreateMatchDto,
  UpdateMatchDto,
  ApiId,
  MatchesGroupedResponse,
  MatchesQueryParams,
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class MatchesApiService {
  constructor(private api: ApiService) {}

  getAllGrouped(params?: Omit<MatchesQueryParams, 'groupByMatchday'>): Observable<MatchesGroupedResponse> {
    const queryParams: Record<string, string> = {
      ...(params?.phaseId !== undefined ? { phaseId: String(params.phaseId) } : {}),
    };

    return this.api.get<MatchesGroupedResponse>('/matches', queryParams);
  }

  getAllFlat(params?: Omit<MatchesQueryParams, 'groupByMatchday'>): Observable<Match[]> {
    const queryParams: Record<string, string> = {
      groupByMatchday: 'false',
      ...(params?.phaseId !== undefined ? { phaseId: String(params.phaseId) } : {}),
    };

    return this.api.get<Match[]>('/matches', queryParams);
  }

  getById(id: ApiId): Observable<Match> {
    return this.api.get<Match>(`/matches/${id}`);
  }

  create(dto: CreateMatchDto): Observable<Match> {
    return this.api.post<Match>('/matches', dto);
  }

  update(id: ApiId, dto: UpdateMatchDto): Observable<Match> {
    return this.api.put<Match>(`/matches/${id}`, dto);
  }

  delete(id: ApiId): Observable<void> {
    return this.api.delete<void>(`/matches/${id}`);
  }
}
