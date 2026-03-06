export interface Team {
  id: string;
  name: string;
  tournamentId: string;
}

export interface CreateTeamDto {
  name: string;
  tournamentId: string;
}

export type UpdateTeamDto = Partial<CreateTeamDto>;
