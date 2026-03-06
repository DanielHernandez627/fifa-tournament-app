import { Component } from '@angular/core';
@Component({
    selector: 'app-phase-list', template: '<div class="page-content"><h1 class="page-title">Fases</h1><app-empty-state icon="swap_horiz" title="Sin fases" subtitle="Las fases se gestionan desde el detalle del torneo" /></div>',
    standalone: false
})
export class PhaseListComponent {}
