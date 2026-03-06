import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse } from '../../shared/models';

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
}
