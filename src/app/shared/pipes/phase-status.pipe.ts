import { Pipe, PipeTransform } from '@angular/core';
import { PhaseStatus } from '../models';

const STATUS_LABELS: Record<PhaseStatus, string> = {
  scheduled:   'Programada',
  in_progress: 'En curso',
  closed:      'Cerrada',
};

@Pipe({
    name: 'phaseStatus',
    standalone: false
})
export class PhaseStatusPipe implements PipeTransform {
  transform(value: PhaseStatus | undefined): string {
    if (!value) return '-';
    return STATUS_LABELS[value] ?? value;
  }
}
