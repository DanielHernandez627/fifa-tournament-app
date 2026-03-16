import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RegisterRequest } from '../../../../shared/models';
import { SharedModule } from '../../../../shared/shared.module';

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{}|:,.?/])[A-Za-z\d!@#$%^&*()_\-+=[\]{}|:,.?/]{8,64}$/;

const emailMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const email = control.get('email')?.value;
  const confirmEmail = control.get('confirmEmail')?.value;

  if (!email || !confirmEmail) {
    return null;
  }

  return email === confirmEmail ? null : { emailMismatch: true };
};

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

const usernameAvailabilityValidator = (authService: AuthService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = `${control.value ?? ''}`.trim();

    if (!value || value.length < 3 || value.length > 30) {
      return of(null);
    }

    return timer(350).pipe(
      switchMap(() => authService.checkUsernameAvailability(value)),
      map((response) => (response.available ? null : { usernameTaken: true })),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return of({ invalidUsernameAvailability: true });
        }

        return of(null);
      })
    );
  };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class RegisterComponent implements OnInit {
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
    this.form = this.fb.group(
      {
        username: this.fb.control('', {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
          asyncValidators: [usernameAvailabilityValidator(this.authService)],
        }),
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(PASSWORD_PATTERN)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [emailMatchValidator, passwordMatchValidator] }
    );
  }

  onSubmit(): void {
    if (this.form.pending || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: RegisterRequest = {
      username: `${this.username?.value ?? ''}`.trim(),
      email: `${this.email?.value ?? ''}`.trim(),
      password: this.password?.value,
    };

    this.loading = true;
    this.authService
      .register(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.notify.success('Cuenta creada correctamente. Ahora puedes iniciar sesion.');
          this.router.navigate(['/auth/login']);
        },
        error: (error: HttpErrorResponse) => {
          const apiError = error.error?.error as
            | { code?: string; message?: string; field?: string }
            | undefined;

          if (apiError?.code !== 'DUPLICATE_VALUE' || !apiError.field) {
            return;
          }

          const fieldControl = this.form.get(apiError.field);
          if (!fieldControl) {
            return;
          }

          const duplicatedError =
            apiError.field === 'username' ? { usernameTaken: true } : { duplicateValue: true };

          fieldControl.setErrors({ ...(fieldControl.errors ?? {}), ...duplicatedError });
          fieldControl.markAsTouched();
        },
      });
  }

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get confirmEmail() {
    return this.form.get('confirmEmail');
  }

  get password() {
    return this.form.get('password');
  }

  get hasEmailMismatch(): boolean {
    return !!this.form?.hasError('emailMismatch') && !!this.confirmEmail?.touched;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get hasPasswordMismatch(): boolean {
    return !!this.form?.hasError('passwordMismatch') && !!this.confirmPassword?.touched;
  }

  get showUsernameAvailable(): boolean {
    return !!this.username?.value && !!this.username?.dirty && !!this.username?.valid && !this.username?.pending;
  }
}
