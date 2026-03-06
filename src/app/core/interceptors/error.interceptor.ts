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
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notify: NotificationService,
    private storage: StorageService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        switch (err.status) {
          case 401:
            this.notify.error('Sesión expirada. Iniciá sesión nuevamente.');
            this.storage.clearToken();
            this.router.navigate(['/auth/login']);
            break;
          case 400:
            this.notify.error(
              err.error?.message ?? 'Datos inválidos. Revisá el formulario.'
            );
            break;
          case 404:
            this.notify.error('El recurso solicitado no fue encontrado.');
            break;
          case 500:
            this.notify.error('Error interno del servidor. Intentá nuevamente.');
            break;
          default:
            this.notify.error('Ocurrió un error inesperado.');
        }
        return throwError(() => err);
      })
    );
  }
}
