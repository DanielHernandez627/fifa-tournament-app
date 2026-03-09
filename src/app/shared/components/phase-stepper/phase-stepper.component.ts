import { Component, Input } from '@angular/core';
import { Phase } from '../../models';

@Component({
  selector: 'app-phase-stepper',
  standalone: false,
  templateUrl: './phase-stepper.component.html',
  styleUrls: ['./phase-stepper.component.scss'],
})
export class PhaseStepperComponent {
  @Input() phases: Phase[] = [];

  getStepClass(phase: Phase): string {
    if (phase.status === 'closed') return 'done';
    if (phase.status === 'in_progress') return 'active';
    return '';
  }
}
