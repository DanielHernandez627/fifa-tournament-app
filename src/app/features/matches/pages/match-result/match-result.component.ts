import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TournamentsApiService } from '../../../tournaments/services/tournaments-api.service';
import { MatchesApiService } from '../../services/matches-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Match } from '../../../../shared/models';

@Component({
    selector: 'app-match-result',
    templateUrl: './match-result.component.html',
    styleUrls: ['./match-result.component.scss'],
    standalone: false
})
export class MatchResultComponent implements OnInit {
  matchId!: string;
  match?: Match;
  form!: FormGroup;
  loading = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private matchesApi: MatchesApiService,
    private tournamentsApi: TournamentsApiService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.matchId = this.route.snapshot.paramMap.get('matchId') ?? '';
    this.form = this.fb.group({
      homeTeamScore: [0, [Validators.required, Validators.min(0)]],
      awayTeamScore: [0, [Validators.required, Validators.min(0)]],
    });
    this.loadMatch();
  }

  loadMatch(): void {
    this.loading = true;
    this.matchesApi.getById(this.matchId).subscribe({
      next: (m) => { this.match = m; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { return; }
    this.saving = true;
    this.tournamentsApi
      .registerMatchResult(this.matchId, this.form.value)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.notify.success('Resultado registrado exitosamente');
          this.router.navigate(['/app/matches']);
        },
      });
  }
}
