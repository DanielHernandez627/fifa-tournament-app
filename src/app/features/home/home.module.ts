import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [NoAuthGuard] },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class HomeModule {}
