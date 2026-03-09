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
    { label: 'Clasificación',   icon: 'leaderboard',     route: '/app/standings' },
    { label: 'Partidos',    icon: 'sports_soccer',   route: '/app/matches' },
    { label: 'Equipos',     icon: 'groups',          route: '/app/teams' },
    { label: 'Fases',       icon: 'swap_horiz',      route: '/app/phases' },
  ];

  userName = 'Usuario';
  userRole = 'Usuario';
  userAvatar = 'US';

  constructor(private authService: AuthService) {
    this.userName = this.authService.getCurrentUserName() ?? 'Usuario';
    this.userRole = this.authService.getCurrentUserRole();
    this.userAvatar = this.buildAvatar(this.userName);
  }

  logout(): void {
    this.authService.logout();
  }

  private buildAvatar(name: string): string {
    const parts = name
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (!parts.length) {
      return 'US';
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
}
