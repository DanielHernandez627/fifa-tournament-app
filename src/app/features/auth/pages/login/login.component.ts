import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (!response.user.emailVerified && !response.user.isVerified) {
            void Swal.fire({
              icon: 'info',
              title: 'Cuenta pendiente de activacion',
              text: 'Te enviamos un correo de verificacion. Revisa tu bandeja para activar tu cuenta.',
              confirmButtonText: 'Entendido',
            });
            this.authService.logout();
            return;
          }
          this.notify.success('Bienvenido al sistema');
          this.router.navigate(['/app/tournaments']);
        },
        error: (error: unknown) => {
          const firebaseCode = this.getFirebaseAuthCode(error);

          if (firebaseCode) {
            switch (firebaseCode) {
              case 'auth/invalid-credential':
              case 'auth/wrong-password':
              case 'auth/user-not-found':
                this.notify.error('Email o contraseña incorrectos.');
                break;
              case 'auth/user-disabled':
                this.notify.error('Tu cuenta está deshabilitada. Contactá al administrador.');
                break;
              case 'auth/too-many-requests':
                this.notify.error('Demasiados intentos fallidos. Intentá más tarde.');
                break;
              default:
                this.notify.error('Error al iniciar sesión. Intentá nuevamente.');
            }
            return;
          }

          const httpError = error as HttpErrorResponse;
          const apiError = httpError.error?.error as
            | { code?: string; message?: string }
            | undefined;

          if (apiError?.code === 'EMAIL_NOT_VERIFIED') {
            void Swal.fire({
              icon: 'info',
              title: 'Cuenta pendiente de activacion',
              text: 'Aun no verificaste tu correo. Revisa el email de activacion para poder ingresar.',
              confirmButtonText: 'Entendido',
            });
            this.authService.logout();
            return;
          }

          this.notify.error('No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente.');
        },
      });
  }

  private getFirebaseAuthCode(error: unknown): string | null {
    if (!error || typeof error !== 'object') {
      return null;
    }

    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && code.startsWith('auth/')) {
      return code;
    }

    const nestedCode = (error as { error?: { code?: unknown } }).error?.code;
    if (typeof nestedCode === 'string' && nestedCode.startsWith('auth/')) {
      return nestedCode;
    }

    return null;
  }

  get email()    { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
