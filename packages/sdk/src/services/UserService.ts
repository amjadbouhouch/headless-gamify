import type { PaginationResponse, commonValidator, userValidator } from '@headless-gamify/common';
import type { User, Prisma } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

export default class UserService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<User>>('/users', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<User>(`/users/${id}`);
  }
  create(payload: userValidator.Create) {
    return this.instance.post<User>('/users', payload);
  }
  update(id: string, payload: userValidator.Update) {
    return this.instance.put<User>(`/users/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/users/${id}`);
  }
  updateMetric(userId: string, metricId: string, payload: userValidator.IncrementMetric) {
    return this.instance.post<never>(`/users/${userId}/metrics/${metricId}/increment`, payload);
  }
}
