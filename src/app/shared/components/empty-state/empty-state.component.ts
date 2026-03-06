import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="empty-state">
      <span class="material-icons-round icon">{{ icon }}</span>
      <div class="title">{{ title }}</div>
      <div class="subtitle" *ngIf="subtitle">{{ subtitle }}</div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 56px 24px; text-align: center;
    }
    .icon { font-size: 48px; color: #4A5470; margin-bottom: 16px; opacity: .5; }
    .title    { font-size: 15px; font-weight: 600; color: #8C97B4; margin-bottom: 6px; }
    .subtitle { font-size: 13px; color: #4A5470; margin-bottom: 20px; }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Sin datos';
  @Input() subtitle = '';
}
