export interface Match {
  id: string;
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  matchday?: number;
  isPlayed?: boolean;
  // Populated in frontend
  homeTeamName?: string;
  awayTeamName?: string;
}

export interface CreateMatchDto {
  phaseId: string;
  homeTeamId: string;
  awayTeamId: string;
  matchday?: number;
}

export type UpdateMatchDto = Partial<CreateMatchDto>;

export interface MatchResultDto {
  homeTeamScore: number;
  awayTeamScore: number;
  overwrite?: boolean;
}
