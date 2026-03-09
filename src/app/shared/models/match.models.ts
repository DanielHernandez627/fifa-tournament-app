export type ApiId = string | number;

export interface Match {
  id: ApiId;
  phaseId: ApiId;
  homeTeamId: ApiId;
  awayTeamId: ApiId;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  matchday?: number;
  isPlayed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  homeTeamName?: string;
  awayTeamName?: string;
}

export interface CreateMatchDto {
  phaseId: ApiId;
  homeTeamId: ApiId;
  awayTeamId: ApiId;
  matchday?: number;
}

export type UpdateMatchDto = Partial<CreateMatchDto>;

export interface MatchResultDto {
  homeTeamScore: number;
  awayTeamScore: number;
  overwrite?: boolean;
}

export interface MatchdayGroup {
  matchday: number;
  totalMatches: number;
  matches: Match[];
}

export interface MatchesGroupedResponse {
  totalMatches: number;
  totalMatchdays: number;
  matchdays: MatchdayGroup[];
}

export interface MatchesQueryParams {
  phaseId?: ApiId;
  groupByMatchday?: boolean;
}
