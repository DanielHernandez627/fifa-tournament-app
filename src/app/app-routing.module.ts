import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ShellComponent } from './layout/shell/shell.component';

const routes: Routes = [
  // Public routes
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },

  // Protected routes inside Shell
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tournaments',
        loadChildren: () =>
          import('./features/tournaments/tournaments.module').then(m => m.TournamentsModule),
      },
      {
        path: 'tournaments/:id/standings',
        loadChildren: () =>
          import('./features/standings/standings.module').then(m => m.StandingsModule),
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./features/teams/teams.module').then(m => m.TeamsModule),
      },
      {
        path: 'phases',
        loadChildren: () =>
          import('./features/phases/phases.module').then(m => m.PhasesModule),
      },
      {
        path: 'matches',
        loadChildren: () =>
          import('./features/matches/matches.module').then(m => m.MatchesModule),
      },
      {
        path: 'standings',
        loadChildren: () =>
          import('./features/standings/standings.module').then(m => m.StandingsModule),
      },
      { path: '', redirectTo: 'tournaments', pathMatch: 'full' },
    ],
  },

  // Default redirect
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
