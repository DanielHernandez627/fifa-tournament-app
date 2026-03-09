import { ApiId } from './match.models';
import { PhaseStatus } from './phase.models';

export interface StandingsRow {
  teamId: ApiId;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TournamentStandings {
  tournamentId: ApiId;
  phaseId: ApiId;
  phaseName: string;
  phaseStatus: PhaseStatus;
  standings: StandingsRow[];
}
