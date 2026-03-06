import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly config: MatSnackBarConfig = {
    duration: 3500,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(`✅ ${message}`, 'Cerrar', {
      ...this.config,
      panelClass: ['snack-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(`❌ ${message}`, 'Cerrar', {
      ...this.config,
      duration: 5000,
      panelClass: ['snack-error'],
    });
  }

  info(message: string): void {
    this.snackBar.open(`ℹ️ ${message}`, 'Cerrar', {
      ...this.config,
      panelClass: ['snack-info'],
    });
  }
}
