import { Component, OnInit } from '@angular/core';
import { Phase } from '../../../../shared/models';
import { PhasesApiService } from '../../services/phases-api.service';

@Component({
  selector: 'app-phase-list',
  templateUrl: './phase-list.component.html',
  styleUrls: ['./phase-list.component.scss'],
  standalone: false
})
export class PhaseListComponent implements OnInit {
    phases: Phase[] = [];
    loading = false;
    displayedColumns = ['name', 'status', 'orderNumber', 'tournamentId'];

    constructor(private api: PhasesApiService) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;
        this.api.getAll().subscribe({
            next: (data) => {
                this.phases = [...data].sort(
                    (a, b) => (a.orderNumber ?? 999) - (b.orderNumber ?? 999)
                );
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    trackById(_: number, phase: Phase): string {
        return String(phase.id);
    }
}
