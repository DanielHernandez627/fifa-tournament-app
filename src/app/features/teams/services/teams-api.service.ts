import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Team, CreateTeamDto, UpdateTeamDto } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class TeamsApiService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Team[]> {
    return this.api.get<Team[]>('/teams');
  }

  getById(id: string): Observable<Team> {
    return this.api.get<Team>(`/teams/${id}`);
  }

  create(dto: CreateTeamDto): Observable<Team> {
    return this.api.post<Team>('/teams', dto);
  }

  update(id: string, dto: UpdateTeamDto): Observable<Team> {
    return this.api.put<Team>(`/teams/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/teams/${id}`);
  }
}
