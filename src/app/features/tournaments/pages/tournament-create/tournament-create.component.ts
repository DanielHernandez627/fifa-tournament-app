import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TournamentsApiService } from '../../services/tournaments-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TournamentType } from '../../../../shared/models';

@Component({
    selector: 'app-tournament-create',
    templateUrl: './tournament-create.component.html',
    styleUrls: ['./tournament-create.component.scss'],
    standalone: false
})
export class TournamentCreateComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  tournamentTypes: { value: TournamentType; label: string; icon: string; desc: string }[] = [
    { value: 'LIGA',         label: 'Liga',         icon: '⚽', desc: 'Todos contra todos, ida y vuelta' },
    { value: 'CUADRANGULAR', label: 'Cuadrangular', icon: '4️⃣', desc: '4 equipos, ronda única' },
    { value: 'MIXTO',        label: 'Mixto',        icon: '🔀', desc: 'Fase de grupos + eliminación' },
  ];

  constructor(
    private fb: FormBuilder,
    private api: TournamentsApiService,
    private notify: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: ['LIGA', Validators.required],
    });
  }

  selectType(type: TournamentType): void {
    this.form.patchValue({ type });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.api.create(this.form.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (t) => {
          this.notify.success(`Torneo "${t.name}" creado exitosamente`);
          this.router.navigate(['/app/tournaments', t.id]);
        },
      });
  }

  get name() { return this.form.get('name'); }
  get selectedType(): TournamentType { return this.form.get('type')?.value; }
}
