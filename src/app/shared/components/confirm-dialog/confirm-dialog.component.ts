import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button [mat-dialog-close]="false">
          {{ data.cancelLabel || 'Cancelar' }}
        </button>
        <button
          mat-flat-button
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          [mat-dialog-close]="true"
        >
          {{ data.confirmLabel || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 8px; min-width: 320px; }
    mat-dialog-content p { color: #8C97B4; font-size: 14px; margin: 0; }
    mat-dialog-actions { gap: 8px; padding-top: 8px; }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
