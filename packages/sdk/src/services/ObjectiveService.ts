import type { PaginationResponse, commonValidator, objectiveValidator } from '@headless-gamify/common';
import type { Prisma } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

export default class ObjectiveService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<
      PaginationResponse<
        Prisma.ObjectiveGetPayload<{
          include: {
            metric: true;
            objectiveTracker: {
              include: {
                user: true;
              };
            };
          };
        }>
      >
    >('/objectives', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<
      Prisma.ObjectiveGetPayload<{
        include: {
          metric: true;
          objectiveTracker: {
            include: {
              user: true;
            };
          };
        };
      }>
    >(`/objectives/${id}`);
  }
  create(payload: objectiveValidator.Create) {
    return this.instance.post<
      Prisma.ObjectiveGetPayload<{
        include: {
          metric: true;
          objectiveTracker: {
            include: {
              user: true;
            };
          };
        };
      }>
    >('/objectives', payload);
  }
  update(id: string, payload: objectiveValidator.Update) {
    return this.instance.put<
      Prisma.ObjectiveGetPayload<{
        include: {
          metric: true;
          objectiveTracker: {
            include: {
              user: true;
            };
          };
        };
      }>
    >(`/objectives/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/objectives/${id}`);
  }
}
