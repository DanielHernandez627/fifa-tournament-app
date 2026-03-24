import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { NotificationService } from '../services/notification.service';

interface BackendErrorPayload {
  code?: string;
  message?: string;
  field?: string;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notify: NotificationService,
    private firebaseAuth: Auth
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const backendError = this.extractBackendError(err);

        switch (err.status) {
          case 401:
            this.notify.error('Sesión expirada. Iniciá sesión nuevamente.');
            signOut(this.firebaseAuth).then(() => this.router.navigate(['/auth/login']));
            break;
          case 400:
          case 409:
            this.notify.error(
              backendError?.message ?? 'Datos inválidos. Revisá el formulario.'
            );
            break;
          case 404:
            this.notify.error('El recurso solicitado no fue encontrado.');
            break;
          case 500:
            this.notify.error('Error interno del servidor. Intentá nuevamente.');
            break;
          default:
            this.notify.error(
              backendError?.message ?? 'Ocurrió un error inesperado.'
            );
        }
        return throwError(() => err);
      })
    );
  }

  private extractBackendError(
    err: HttpErrorResponse
  ): BackendErrorPayload | null {
    if (!err.error || typeof err.error !== 'object') {
      return null;
    }

    const payload = err.error as Record<string, unknown>;
    const nestedError = payload['error'];

    if (nestedError && typeof nestedError === 'object') {
      const parsedError = nestedError as Record<string, unknown>;

      return {
        code:
          typeof parsedError['code'] === 'string'
            ? parsedError['code']
            : undefined,
        message:
          typeof parsedError['message'] === 'string'
            ? parsedError['message']
            : undefined,
        field:
          typeof parsedError['field'] === 'string'
            ? parsedError['field']
            : undefined,
      };
    }

    return typeof payload['message'] === 'string'
      ? { message: payload['message'] }
      : null;
  }
}
