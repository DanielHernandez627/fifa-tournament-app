import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    standalone: false
})
export class ShellComponent implements OnInit, OnDestroy {
  navItems = [
    { label: 'Torneos',     icon: 'emoji_events',   route: '/app/tournaments' },
    { label: 'Clasificación',   icon: 'leaderboard',     route: '/app/standings' },
    { label: 'Partidos',    icon: 'sports_soccer',   route: '/app/matches' },
    { label: 'Equipos',     icon: 'groups',          route: '/app/teams' },
    { label: 'Fases',       icon: 'swap_horiz',      route: '/app/phases' },
  ];

  userName = '';
  userRole = 'Usuario';
  userAvatar = 'US';

  private userSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.backendUser$.subscribe((user) => {
      this.userName = user?.userName ?? '';
      this.userAvatar = this.buildAvatar(this.userName);
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
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
