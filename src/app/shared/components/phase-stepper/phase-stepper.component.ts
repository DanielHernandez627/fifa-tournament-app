import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Phase } from '../../models';

@Component({
  selector: 'app-phase-stepper',
  standalone: false,
  template: `
    <div class="stepper-container">
      <ng-container *ngFor="let phase of phases; let i = index; let last = last">
        <div class="step" [ngClass]="getStepClass(phase)">
          <div class="step-icon-col">
            <div class="step-icon">
              <span class="material-icons-round" *ngIf="phase.status === 'closed'">check</span>
              <span *ngIf="phase.status !== 'closed'">{{ i + 1 }}</span>
            </div>
            <div class="step-label">
              <div class="step-name">{{ phase.name }}</div>
              <app-status-badge [status]="phase.status || 'scheduled'" />
            </div>
          </div>
          <div class="step-connector" *ngIf="!last" [class.done]="phase.status === 'closed'"></div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .stepper-container { display: flex; align-items: flex-start; padding: 4px 0 12px; }
    .step { display: flex; align-items: flex-start; flex: 1; }
    .step-icon-col { display: flex; flex-direction: column; align-items: center; }
    .step-icon {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; flex-shrink: 0;
      border: 2px solid #2C3550; background: #1E2535; color: #4A5470;
      transition: all 200ms ease; z-index: 1;
    }
    .step-icon .material-icons-round { font-size: 18px; }
    .step-label { margin-top: 8px; text-align: center; padding: 0 4px; }
    .step-name  { font-size: 11px; font-weight: 600; color: #4A5470; margin-bottom: 4px; }
    .step-connector { flex: 1; height: 2px; background: #2C3550; margin: 17px -1px 0; }

    .step.done .step-icon  { background: rgba(61,214,140,.13); border-color: #3DD68C; color: #3DD68C; }
    .step.done .step-name  { color: #3DD68C; }
    .step.done .step-connector { background: #3DD68C; }

    .step.active .step-icon {
      background: rgba(91,141,239,.14); border-color: #5B8DEF; color: #5B8DEF;
      box-shadow: 0 0 0 4px rgba(91,141,239,.16);
    }
    .step.active .step-name { color: #5B8DEF; }
  `],
})
export class PhaseStepperComponent {
  @Input() phases: Phase[] = [];

  getStepClass(phase: Phase): string {
    if (phase.status === 'closed') return 'done';
    if (phase.status === 'in_progress') return 'active';
    return '';
  }
}
