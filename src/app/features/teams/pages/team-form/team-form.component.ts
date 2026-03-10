import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsApiService } from '../../services/teams-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TournamentsApiService } from '../../../tournaments/services/tournaments-api.service';
import { Tournament } from '../../../../shared/models';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-team-form', templateUrl: './team-form.component.html',
    standalone: false
})
export class TeamFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  teamId: string | null = null;
  tournaments: Tournament[] = [];
  tournamentsLoading = false;

  constructor(
    private fb: FormBuilder,
    private api: TeamsApiService,
    private notify: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private tournamentsApi: TournamentsApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]], tournamentId: ['', Validators.required] });
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.teamId;

    if (this.isEditMode) {
      this.loadTeam();
    }

    this.loadTournaments();
  }

  private loadTeam(): void {
    if (!this.teamId) {
      return;
    }

    this.loading = true;
    this.api.getById(this.teamId).subscribe({
      next: (team) => {
        this.form.patchValue({
          name: team.name,
          tournamentId: this.normalizeId(team.tournamentId),
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('No se pudo cargar el equipo');
        this.router.navigate(['/app/teams']);
      },
    });
  }

  private loadTournaments(): void {
    this.tournamentsLoading = true;
    this.tournamentsApi.getAll().subscribe({
      next: (data) => {
        const tokenPayload = this.auth.getTokenPayload();
        const currentUserId = this.normalizeId(tokenPayload?.id ?? tokenPayload?.sub);

        const filteredTournaments = currentUserId
          ? data.filter((tournament) => this.normalizeId(tournament.userId) === currentUserId)
          : data;

        // Force string ids to keep mat-select value matching stable in edit mode.
        this.tournaments = filteredTournaments.map((tournament) => ({
          ...tournament,
          id: this.normalizeId(tournament.id) ?? String(tournament.id),
        }));

        this.tournamentsLoading = false;
      },
      error: () => {
        this.tournamentsLoading = false;
        this.notify.error('No se pudieron cargar los torneos');
      }
    });
  }

  private normalizeId(value: unknown): string | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const tournamentId = this.normalizeId(this.tournamentId?.value);
    if (!tournamentId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      tournamentId,
    };

    this.loading = true;
    if (this.isEditMode && this.teamId) {
      this.api.update(this.teamId, payload).subscribe({
        next: () => {
          this.notify.success('Equipo actualizado');
          this.router.navigate(['/app/teams']);
        },
        error: () => {
          this.loading = false;
        },
      });
      return;
    }

    this.api.create(payload).subscribe({
      next: () => {
        this.notify.success('Equipo creado');
        this.router.navigate(['/app/teams']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  get name() { return this.form.get('name'); }
  get tournamentId() { return this.form.get('tournamentId'); }
}
