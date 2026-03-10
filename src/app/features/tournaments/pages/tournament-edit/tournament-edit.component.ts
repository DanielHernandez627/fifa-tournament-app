import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatchesApiService } from '../../../matches/services/matches-api.service';
import { PhasesApiService } from '../../../phases/services/phases-api.service';
import { Tournament, TournamentType } from '../../../../shared/models';

interface TournamentTypeOption {
    value: TournamentType;
    label: string;
    icon: string;
    desc: string;
}

@Component({
    selector: 'app-tournament-edit',
    templateUrl: './tournament-edit.component.html',
    styleUrls: ['./tournament-edit.component.scss'],
    standalone: false
})
export class TournamentEditComponent implements OnInit {
    id = '';
    tournament?: Tournament;
    form!: FormGroup;
    loading = false;
    saving = false;
    hasPlayedMatches = false;

    tournamentTypes: TournamentTypeOption[] = [
        { value: 'LIGA', label: 'Liga', icon: '⚽', desc: 'Todos contra todos, ida y vuelta' },
        { value: 'CUADRANGULAR', label: 'Cuadrangular', icon: '4️⃣', desc: '4 equipos, ronda única' },
        { value: 'MIXTO', label: 'Mixto', icon: '🔀', desc: 'Fase de grupos + eliminación' },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private api: TournamentsApiService,
        private phasesApi: PhasesApiService,
        private matchesApi: MatchesApiService,
        private notify: NotificationService,
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? '';
        if (!this.id) {
            this.router.navigate(['/app/tournaments']);
            return;
        }

        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            type: ['LIGA', Validators.required],
        });

        this.load();
    }

    load(): void {
        this.loading = true;

        this.api.getById(this.id).subscribe({
            next: (tournament) => {
                this.tournament = tournament;
                this.form.patchValue({
                    name: tournament.name,
                    type: tournament.type,
                });
                this.loadMatchesState();
            },
            error: () => {
                this.loading = false;
                this.router.navigate(['/app/tournaments']);
            },
        });
    }

    private loadMatchesState(): void {
        this.phasesApi.getAll().subscribe({
            next: (allPhases) => {
                const phaseIds = new Set(
                    allPhases
                        .filter((phase) => String(phase.tournamentId) === this.id)
                        .map((phase) => String(phase.id))
                );

                this.matchesApi.getAllFlat().pipe(
                    finalize(() => (this.loading = false))
                ).subscribe({
                    next: (allMatches) => {
                        const tournamentMatches = allMatches.filter((match) => phaseIds.has(String(match.phaseId)));
                        this.hasPlayedMatches = tournamentMatches.some((match) => !!match.isPlayed);

                        if (this.hasPlayedMatches) {
                            this.form.get('type')?.disable({ emitEvent: false });
                        } else {
                            this.form.get('type')?.enable({ emitEvent: false });
                        }
                    },
                    error: () => {
                        // If we cannot determine played matches from frontend, keep backend as source of truth.
                        this.hasPlayedMatches = false;
                        this.loading = false;
                    },
                });
            },
            error: () => {
                this.hasPlayedMatches = false;
                this.loading = false;
            },
        });
    }

    selectType(type: TournamentType): void {
        if (this.hasPlayedMatches) {
            return;
        }

        this.form.patchValue({ type });
    }

    onSubmit(): void {
        if (!this.tournament) {
            return;
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const trimmedName = String(this.form.get('name')?.value ?? '').trim();
        if (!trimmedName) {
            this.notify.error('El nombre del torneo no puede estar vacío');
            return;
        }

        const originalType = this.tournament.type;
        const selectedType = this.selectedType;
        const typeChanged = selectedType !== originalType;

        if (typeChanged) {
            const confirmed = window.confirm(
                'Cambiar el tipo del torneo recreará las fases del torneo. ¿Deseas continuar?'
            );

            if (!confirmed) {
                return;
            }
        }

        const payload: { name: string; type?: TournamentType } = { name: trimmedName };
        if (typeChanged && !this.hasPlayedMatches) {
            payload.type = selectedType;
        }

        this.saving = true;
        this.api.update(this.id, payload)
            .pipe(finalize(() => (this.saving = false)))
            .subscribe({
                next: (updated) => {
                    this.notify.success(`Torneo "${updated.name}" actualizado exitosamente`);
                    this.router.navigate(['/app/tournaments', this.id]);
                },
                error: () => undefined,
            });
    }

    get name() {
        return this.form.get('name');
    }

    get selectedType(): TournamentType {
        return this.form.getRawValue().type as TournamentType;
    }
}
