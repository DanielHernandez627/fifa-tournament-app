import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StandingsViewComponent } from './pages/standings-view/standings-view.component';

const routes: Routes = [
  { path: ':id', component: StandingsViewComponent },
];

@NgModule({
  declarations: [StandingsViewComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class StandingsModule {}
