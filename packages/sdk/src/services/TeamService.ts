import type { PaginationResponse, commonValidator, teamValidator } from '@headless-gamify/common';
import type { Team, Prisma } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

export default class TeamService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<Team>>('/teams', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<
      Prisma.TeamGetPayload<{
        include: {
          members: true;
        };
      }>
    >(`/teams/${id}`);
  }
  create(payload: teamValidator.Create) {
    return this.instance.post<
      Prisma.TeamGetPayload<{
        include: {
          members: true;
        };
      }>
    >('/teams', payload);
  }
  update(id: string, payload: teamValidator.Update) {
    return this.instance.put<
      Prisma.TeamGetPayload<{
        include: {
          members: true;
        };
      }>
    >(`/teams/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/teams/${id}`);
  }
}
