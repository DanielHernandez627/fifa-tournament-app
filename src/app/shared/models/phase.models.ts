export type PhaseStatus = 'scheduled' | 'in_progress' | 'closed';

export interface Phase {
  id: string;
  name: string;
  orderNumber?: number;
  status?: PhaseStatus;
  tournamentId: string;
}

export interface CreatePhaseDto {
  name: string;
  orderNumber?: number;
  tournamentId: string;
}

export type UpdatePhaseDto = Partial<CreatePhaseDto>;
