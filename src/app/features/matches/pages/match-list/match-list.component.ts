import { Component, OnInit } from '@angular/core';
import { MatchesApiService } from '../../services/matches-api.service';
import { Match, MatchdayGroup, Phase } from '../../../../shared/models';
import { PhasesApiService } from '../../../phases/services/phases-api.service';
import { forkJoin } from 'rxjs';

interface PhaseMatchdayGroup {
  phaseId: string;
  phaseName: string;
  days: MatchdayGroup[];
  totalMatches: number;
}

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
  standalone: false
})
export class MatchListComponent implements OnInit {
  phaseGroups: PhaseMatchdayGroup[] = [];
  collapsedPhaseIds = new Set<string>();
  totalMatches = 0;
  loading = false;

  constructor(
    private api: MatchesApiService,
    private phasesApi: PhasesApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      matchesResponse: this.api.getAllGrouped(),
      phases: this.phasesApi.getAll(),
    }).subscribe({
      next: ({ matchesResponse, phases }) => {
        const matchdays = matchesResponse.matchdays ?? [];
        this.phaseGroups = this.groupByPhase(matchdays, phases);
        this.collapsedPhaseIds.clear();
        this.totalMatches = matchesResponse.totalMatches ?? 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private groupByPhase(matchdays: MatchdayGroup[], phases: Phase[]): PhaseMatchdayGroup[] {
    const phaseNameById = new Map<string, string>(
      phases.map((phase) => [String(phase.id), phase.name])
    );

    const phaseMap = new Map<string, MatchdayGroup[]>();

    for (const day of matchdays) {
      const dayByPhase = new Map<string, Match[]>();

      for (const match of day.matches ?? []) {
        const phaseId = String(match.phaseId);
        const existing = dayByPhase.get(phaseId) ?? [];
        existing.push(match);
        dayByPhase.set(phaseId, existing);
      }

      for (const [phaseId, matches] of dayByPhase.entries()) {
        const existingDays = phaseMap.get(phaseId) ?? [];
        existingDays.push({
          matchday: day.matchday,
          totalMatches: matches.length,
          matches,
        });
        phaseMap.set(phaseId, existingDays);
      }
    }

    return Array.from(phaseMap.entries())
      .map(([phaseId, days]) => ({
        phaseId,
        phaseName: phaseNameById.get(phaseId) ?? `Fase ${phaseId}`,
        days: [...days].sort((a, b) => a.matchday - b.matchday),
        totalMatches: days.reduce((acc, day) => acc + day.totalMatches, 0),
      }))
      .sort((a, b) => Number(a.phaseId) - Number(b.phaseId));
  }

  togglePhase(phaseId: string): void {
    if (this.collapsedPhaseIds.has(phaseId)) {
      this.collapsedPhaseIds.delete(phaseId);
      return;
    }

    this.collapsedPhaseIds.add(phaseId);
  }

  isPhaseCollapsed(phaseId: string): boolean {
    return this.collapsedPhaseIds.has(phaseId);
  }
}
