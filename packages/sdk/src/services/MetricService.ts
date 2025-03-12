import type { PaginationResponse, commonValidator, metricValidator } from '@headless-gamify/common';
import type { Prisma, Metric } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

export default class MetricService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<Metric>>('/metrics', {
      params,
    });
  }
  retrieve(id: string) {
    return this.instance.get<Metric>(`/metrics/${id}`);
  }
  create(payload: metricValidator.Create) {
    return this.instance.post<Metric>('/metrics', payload);
  }
  update(id: string, payload: metricValidator.Update) {
    return this.instance.put<Metric>(`/metrics/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/metrics/${id}`);
  }
}
