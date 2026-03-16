import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private api: ApiService) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', credentials);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('/auth/register', payload);
  }
}
