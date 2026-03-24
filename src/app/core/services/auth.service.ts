import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  AuthUserResponse,
  BackendUser,
  UsernameAvailabilityResponse,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly firebaseUser$ = authState(this.firebaseAuth);

  private readonly _backendUser = new BehaviorSubject<BackendUser | null>(null);
  readonly backendUser$ = this._backendUser.asObservable();

  readonly isAuthenticated$ = this.firebaseUser$.pipe(map((u) => u !== null));

  constructor(
    private firebaseAuth: Auth,
    private api: ApiService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<AuthUserResponse> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap(() => this.api.post<AuthUserResponse>('/auth/login', {})),
      tap((res) => this._backendUser.next(this.normalizeBackendUser(res.user)))
    );
  }

  register(email: string, password: string, username: string): Observable<AuthUserResponse> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap((credential) =>
        from(sendEmailVerification(credential.user)).pipe(
          switchMap(() => this.api.post<AuthUserResponse>('/auth/register', { username }))
        )
      ),
      map((res) => ({ ...res, user: this.normalizeBackendUser(res.user) })),
      switchMap((res) =>
        from(signOut(this.firebaseAuth)).pipe(
          map(() => {
            this._backendUser.next(null);
            return res;
          })
        )
      )
    );
  }

  checkUsernameAvailability(username: string): Observable<UsernameAvailabilityResponse> {
    return this.api.get<UsernameAvailabilityResponse>('/user/availability/username', { username });
  }

  logout(): void {
    from(signOut(this.firebaseAuth)).subscribe(() => {
      this._backendUser.next(null);
      this.router.navigate(['/auth/login']);
    });
  }

  isAuthenticated(): boolean {
    return this.firebaseAuth.currentUser !== null;
  }

  getCurrentUserName(): string {
    const user = this._backendUser.getValue();
    return user?.userName ?? '';
  }

  getCurrentUserRole(): string {
    return 'Usuario';
  }

  getCurrentUserId(): string | null {
    return this._backendUser.getValue()?.id ?? null;
  }

  isCurrentUserVerified(): boolean {
    const user = this._backendUser.getValue();
    return !!(user?.emailVerified ?? user?.isVerified);
  }

  private normalizeBackendUser(user: BackendUser): BackendUser {
    const verified = !!(user.emailVerified ?? user.isVerified);
    return {
      ...user,
      emailVerified: verified,
      isVerified: verified,
    };
  }
}
