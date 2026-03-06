import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamsApiService } from '../../services/teams-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-team-form', templateUrl: './team-form.component.html',
    standalone: false
})
export class TeamFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  constructor(private fb: FormBuilder, private api: TeamsApiService, private notify: NotificationService, private router: Router) {}
  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]], tournamentId: ['', Validators.required] });
  }
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.api.create(this.form.value).subscribe({ next: () => { this.notify.success('Equipo creado'); this.router.navigate(['/app/teams']); }, error: () => this.loading = false });
  }
  get name() { return this.form.get('name'); }
}
