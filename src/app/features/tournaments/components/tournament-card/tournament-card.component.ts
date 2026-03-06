import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Tournament } from '../../../../shared/models';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-tournament-card',
    templateUrl: './tournament-card.component.html',
    styleUrls: ['./tournament-card.component.scss'],
    standalone: false
})
export class TournamentCardComponent {
  @Input() tournament!: Tournament;

  constructor(
    private router: Router,
    private api: TournamentsApiService,
    private notify: NotificationService,
    private dialog: MatDialog
  ) {}

  goToDetail(): void {
    this.router.navigate(['/app/tournaments', this.tournament.id]);
  }

  goToStandings(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/app/tournaments', this.tournament.id, 'standings']);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar torneo',
        message: `¿Seguro que querés eliminar "${this.tournament.name}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        type: 'danger',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.delete(this.tournament.id).subscribe(() => {
          this.notify.success('Torneo eliminado');
        });
      }
    });
  }

  get stripeClass(): string {
    return this.tournament.type.toLowerCase();
  }
}
