import type { PaginationResponse, commonValidator, teamValidator } from '@headless-gamify/common';
import type { Team, Prisma } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';
// populate members
type TeamResponse = Prisma.TeamGetPayload<{
  include: {
    members: true;
  };
}>;
export default class TeamService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<TeamResponse>>('/teams', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<TeamResponse>(`/teams/${id}`);
  }
  create(payload: teamValidator.Create) {
    return this.instance.post<TeamResponse>('/teams', payload);
  }
  update(id: string, payload: teamValidator.Update) {
    return this.instance.put<TeamResponse>(`/teams/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/teams/${id}`);
  }
}
