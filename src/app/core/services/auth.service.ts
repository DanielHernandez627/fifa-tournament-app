import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { JwtPayload, LoginRequest, LoginResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(
    this.storage.isAuthenticated()
  );

  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((res) => {
        this.storage.setToken(res.token);
        this._isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    this.storage.clearToken();
    this._isAuthenticated.next(false);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.storage.isAuthenticated();
  }

  getTokenPayload(): JwtPayload | null {
    const token = this.storage.getToken();

    if (!token) {
      return null;
    }

    return this.decodeJwtPayload(token);
  }

  getCurrentUserName(): string | null {
    const payload = this.getTokenPayload();
    if (!payload) {
      return null;
    }

    const value = payload.userName ?? payload.email ?? payload.sub ?? payload.id;
    return typeof value === 'string' && value.trim() ? value : null;
  }

  getCurrentUserRole(): string {
    const payload = this.getTokenPayload();
    return typeof payload?.role === 'string' && payload.role.trim()
      ? payload.role
      : 'Usuario';
  }

  private decodeJwtPayload(token: string): JwtPayload | null {
    try {
      const payloadBase64Url = token.split('.')[1];
      if (!payloadBase64Url) {
        return null;
      }

      const payloadBase64 = payloadBase64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padding = payloadBase64.length % 4;
      const normalizedPayload =
        padding === 0 ? payloadBase64 : payloadBase64 + '='.repeat(4 - padding);

      return JSON.parse(atob(normalizedPayload)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
