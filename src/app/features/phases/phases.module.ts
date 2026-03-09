import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PhaseListComponent }   from './pages/phase-list/phase-list.component';

const routes: Routes = [
  { path: '', component: PhaseListComponent },
];

@NgModule({
  declarations: [PhaseListComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class PhasesModule {}
