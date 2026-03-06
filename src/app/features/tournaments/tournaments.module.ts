import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { TournamentListComponent }   from './pages/tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './pages/tournament-detail/tournament-detail.component';
import { TournamentCreateComponent } from './pages/tournament-create/tournament-create.component';
import { TournamentEditComponent }   from './pages/tournament-edit/tournament-edit.component';
import { TournamentCardComponent }   from './components/tournament-card/tournament-card.component';

const routes: Routes = [
  { path: '',       component: TournamentListComponent },
  { path: 'new',    component: TournamentCreateComponent },
  { path: ':id',    component: TournamentDetailComponent },
  { path: ':id/edit', component: TournamentEditComponent },
];

@NgModule({
  declarations: [
    TournamentListComponent,
    TournamentDetailComponent,
    TournamentCreateComponent,
    TournamentEditComponent,
    TournamentCardComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class TournamentsModule {}
