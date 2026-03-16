import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  readonly highlights = [
    {
      icon: 'emoji_events',
      title: 'Gestion de torneos completa',
      description: 'Crea torneos, define formatos y controla cada fase desde un solo panel.',
    },
    {
      icon: 'sports_soccer',
      title: 'Carga de resultados agil',
      description: 'Registra marcadores en segundos y mantiene la tabla siempre actualizada.',
    },
    {
      icon: 'leaderboard',
      title: 'Posiciones en tiempo real',
      description: 'Visualiza clasificaciones, rendimiento y avance de equipos al instante.',
    },
  ];
}
