import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    standalone: false
})
export class ShellComponent {
  navItems = [
    { label: 'Torneos',     icon: 'emoji_events',   route: '/app/tournaments' },
    { label: 'Standings',   icon: 'leaderboard',     route: '/app/standings' },
    { label: 'Partidos',    icon: 'sports_soccer',   route: '/app/matches' },
    { label: 'Equipos',     icon: 'groups',          route: '/app/teams' },
    { label: 'Fases',       icon: 'swap_horiz',      route: '/app/phases' },
  ];

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
