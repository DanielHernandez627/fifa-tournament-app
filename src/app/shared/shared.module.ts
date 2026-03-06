import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule }          from '@angular/material/card';
import { MatButtonModule }        from '@angular/material/button';
import { MatIconModule }          from '@angular/material/icon';
import { MatTableModule }         from '@angular/material/table';
import { MatFormFieldModule }     from '@angular/material/form-field';
import { MatInputModule }         from '@angular/material/input';
import { MatSelectModule }        from '@angular/material/select';
import { MatChipsModule }         from '@angular/material/chips';
import { MatTabsModule }          from '@angular/material/tabs';
import { MatDialogModule }        from '@angular/material/dialog';
import { MatSnackBarModule }      from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }       from '@angular/material/tooltip';
import { MatDividerModule }       from '@angular/material/divider';
import { MatMenuModule }          from '@angular/material/menu';
import { MatBadgeModule }         from '@angular/material/badge';

// Components
import { StatusBadgeComponent }   from './components/status-badge/status-badge.component';
import { PhaseStepperComponent }  from './components/phase-stepper/phase-stepper.component';
import { EmptyStateComponent }    from './components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

// Pipes
import { PhaseStatusPipe }        from './pipes/phase-status.pipe';
import { TournamentTypePipe }     from './pipes/tournament-type.pipe';

const MAT_MODULES = [
  MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
  MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
  MatTabsModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule,
  MatTooltipModule, MatDividerModule, MatMenuModule, MatBadgeModule,
];

const COMPONENTS = [
  StatusBadgeComponent, PhaseStepperComponent,
  EmptyStateComponent, LoadingSpinnerComponent, ConfirmDialogComponent,
];

const PIPES = [PhaseStatusPipe, TournamentTypePipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ...MAT_MODULES],
  exports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    ...MAT_MODULES, ...COMPONENTS, ...PIPES,
  ],
})
export class SharedModule {}
