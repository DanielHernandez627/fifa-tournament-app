import { Pipe, PipeTransform } from '@angular/core';
import { TournamentType } from '../models';

const TYPE_LABELS: Record<TournamentType, string> = {
  LIGA:         'Liga',
  CUADRANGULAR: 'Cuadrangular',
  MIXTO:        'Mixto',
};

@Pipe({
    name: 'tournamentType',
    standalone: false
})
export class TournamentTypePipe implements PipeTransform {
  transform(value: TournamentType | undefined): string {
    if (!value) return '-';
    return TYPE_LABELS[value] ?? value;
  }
}
