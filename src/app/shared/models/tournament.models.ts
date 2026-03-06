export type TournamentType = 'LIGA' | 'CUADRANGULAR' | 'MIXTO';

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  userId: string;
  championId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTournamentDto {
  name: string;
  type: TournamentType;
}

export type UpdateTournamentDto = Partial<CreateTournamentDto>;

export interface TournamentSummary extends Tournament {
  teamCount?: number;
  phaseCount?: number;
  matchCount?: number;
}
