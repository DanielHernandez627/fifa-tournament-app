import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { TeamFormComponent } from './pages/team-form/team-form.component';

const routes: Routes = [
  { path: '',    component: TeamListComponent },
  { path: 'new', component: TeamFormComponent },
  { path: ':id/edit', component: TeamFormComponent },
];

@NgModule({
  declarations: [TeamListComponent, TeamFormComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class TeamsModule {}
