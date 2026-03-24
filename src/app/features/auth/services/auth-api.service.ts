import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  AuthUserResponse,
  UsernameAvailabilityResponse,
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private api: ApiService) {}

  login(): Observable<AuthUserResponse> {
    return this.api.post<AuthUserResponse>('/auth/login', {});
  }

  register(username: string): Observable<AuthUserResponse> {
    return this.api.post<AuthUserResponse>('/auth/register', { username });
  }

  checkUsernameAvailability(username: string): Observable<UsernameAvailabilityResponse> {
    return this.api.get<UsernameAvailabilityResponse>('/user/availability/username', { username });
  }
}
