import type { PaginationResponse, commonValidator, badgeValidator } from '@headless-gamify/common';
import type { Prisma, Badge } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

// Add this type at the top of the file
type BadgeWithConditions = Prisma.BadgeGetPayload<{
  include: { conditions: true };
}>;

export default class BadgeService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<BadgeWithConditions>>('/badges', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<BadgeWithConditions>(`/badges/${id}`);
  }
  create(payload: badgeValidator.Create) {
    return this.instance.post<BadgeWithConditions>('/badges', payload);
  }
  update(id: string, payload: badgeValidator.Update) {
    return this.instance.put<BadgeWithConditions>(`/badges/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/badges/${id}`);
  }
}
