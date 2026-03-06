import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  template: `
    <span class="status-badge" [ngClass]="config.cssClass">
      <span class="dot"></span>
      {{ config.label }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 100px;
      font-size: 11px; font-weight: 600; letter-spacing: .02em;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

    .badge-scheduled  { background: rgba(140,151,180,.12); color: #8C97B4; }
    .badge-scheduled .dot { background: #8C97B4; }

    .badge-inprogress { background: rgba(251,188,5,.13); color: #FBBC05; }
    .badge-inprogress .dot { background: #FBBC05; animation: blink 1.4s infinite; }

    .badge-closed, .badge-played {
      background: rgba(61,214,140,.13); color: #3DD68C;
    }
    .badge-closed .dot, .badge-played .dot { background: #3DD68C; }

    .badge-pending { background: rgba(140,151,180,.12); color: #8C97B4; }
    .badge-pending .dot { background: #8C97B4; }

    .badge-liga  { background: rgba(91,141,239,.14); color: #5B8DEF; }
    .badge-liga .dot { background: #5B8DEF; }

    .badge-cuad  { background: rgba(212,168,67,.13); color: #D4A843; }
    .badge-cuad .dot { background: #D4A843; }

    .badge-mixto { background: rgba(168,85,247,.12); color: #C084FC; }
    .badge-mixto .dot { background: #C084FC; }

    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  `],
})
export class StatusBadgeComponent {
  @Input() set status(val: BadgeType) {
    this.config = BADGE_MAP[val] ?? { label: val, cssClass: '' };
  }

  config: BadgeConfig = { label: '', cssClass: '' };
}
