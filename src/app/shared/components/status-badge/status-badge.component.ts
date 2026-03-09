import { Component, Input } from '@angular/core';
import { PhaseStatus } from '../../models';

type BadgeType = PhaseStatus | 'played' | 'pending' | 'LIGA' | 'CUADRANGULAR' | 'MIXTO';

interface BadgeConfig {
  label: string;
  cssClass: string;
}

const BADGE_MAP: Record<string, BadgeConfig> = {
  scheduled:    { label: 'Programada',    cssClass: 'badge-scheduled' },
  in_progress:  { label: 'En curso',      cssClass: 'badge-inprogress' },
  closed:       { label: 'Cerrada',       cssClass: 'badge-closed' },
  played:       { label: 'Jugado',        cssClass: 'badge-played' },
  pending:      { label: 'Pendiente',     cssClass: 'badge-pending' },
  LIGA:         { label: 'LIGA',          cssClass: 'badge-liga' },
  CUADRANGULAR: { label: 'CUADRANGULAR',  cssClass: 'badge-cuad' },
  MIXTO:        { label: 'MIXTO',         cssClass: 'badge-mixto' },
};

@Component({
  selector: 'app-status-badge',
  standalone: false,
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
  @Input() set status(val: BadgeType) {
    this.config = BADGE_MAP[val] ?? { label: val, cssClass: '' };
  }

  config: BadgeConfig = { label: '', cssClass: '' };
}
