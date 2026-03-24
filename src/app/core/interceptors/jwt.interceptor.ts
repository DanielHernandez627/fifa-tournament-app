import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private firebaseAuth: Auth) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const user = this.firebaseAuth.currentUser;

    if (!user) {
      return next.handle(req);
    }

    return from(user.getIdToken()).pipe(
      switchMap((token) => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next.handle(cloned);
      })
    );
  }
}
