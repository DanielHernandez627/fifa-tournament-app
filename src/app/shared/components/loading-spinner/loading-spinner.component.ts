import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner-wrap" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter" color="primary"></mat-spinner>
      <div class="label" *ngIf="label">{{ label }}</div>
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 32px; gap: 12px;
    }
    .spinner-wrap.overlay {
      position: absolute; inset: 0;
      background: rgba(14,17,24,.7); z-index: 100; border-radius: inherit;
    }
    .label { font-size: 13px; color: #8C97B4; }
  `],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() overlay = false;
  @Input() label = '';
}
