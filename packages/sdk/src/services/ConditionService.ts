import type { conditionValidator } from '@headless-gamify/common';
import type { Prisma, Condition } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

export default class ConditionService {
  constructor(private readonly instance: AxiosInstance) {}

  create(payload: conditionValidator.Create) {
    return this.instance.post<Condition>('/conditions', payload);
  }
  update(id: string, payload: conditionValidator.Update) {
    return this.instance.put<Condition>(`/conditions/${id}`, payload);
  }
  delete(id: string) {
    return this.instance.delete<never>(`/conditions/${id}`);
  }
}
