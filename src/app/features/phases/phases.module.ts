import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PhaseListComponent }   from './pages/phase-list/phase-list.component';
import { PhaseDetailComponent } from './pages/phase-detail/phase-detail.component';

const routes: Routes = [
  { path: '',    component: PhaseListComponent },
  { path: ':id', component: PhaseDetailComponent },
];

@NgModule({
  declarations: [PhaseListComponent, PhaseDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PhasesModule {}
