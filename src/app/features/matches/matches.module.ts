import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatchListComponent }   from './pages/match-list/match-list.component';
import { MatchResultComponent } from './pages/match-result/match-result.component';

const routes: Routes = [
  { path: '',                   component: MatchListComponent },
  { path: ':matchId/result',    component: MatchResultComponent },
];

@NgModule({
  declarations: [MatchListComponent, MatchResultComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MatchesModule {}
