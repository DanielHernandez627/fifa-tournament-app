import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authState$ = authState(this.auth);

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authState$.pipe(
      take(1),
      map((user) => (user !== null ? true : this.router.createUrlTree(['/auth/login'])))
    );
  }
}
