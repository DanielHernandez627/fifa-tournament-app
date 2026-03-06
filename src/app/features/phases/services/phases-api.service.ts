import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Phase, CreatePhaseDto, UpdatePhaseDto } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class PhasesApiService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Phase[]> {
    return this.api.get<Phase[]>('/phase');
  }

  getById(id: string): Observable<Phase> {
    return this.api.get<Phase>(`/phase/${id}`);
  }

  create(dto: CreatePhaseDto): Observable<Phase> {
    return this.api.post<Phase>('/phase', dto);
  }

  update(id: string, dto: UpdatePhaseDto): Observable<Phase> {
    return this.api.put<Phase>(`/phase/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/phase/${id}`);
  }
}
