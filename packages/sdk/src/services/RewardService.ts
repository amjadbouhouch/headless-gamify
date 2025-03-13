import type { PaginationResponse, commonValidator, rewardValidator } from '@headless-gamify/common';
import type { Prisma, Reward } from '@headless-gamify/prisma-client';
import { AxiosInstance } from 'axios';

// Define the type for Reward with UserRewards included
type RewardWithUserRewards = Prisma.RewardGetPayload<{
  include: { userRewards: true };
}>;

export default class RewardService {
  constructor(private readonly instance: AxiosInstance) {}

  list(params: Partial<commonValidator.CommonQueryParams> = {}) {
    return this.instance.get<PaginationResponse<Reward>>('/rewards', {
      params,
    });
  }

  retrieve(id: string) {
    return this.instance.get<RewardWithUserRewards>(`/rewards/${id}`);
  }

  create(payload: rewardValidator.Create) {
    return this.instance.post<RewardWithUserRewards>('/rewards', payload);
  }

  update(id: string, payload: rewardValidator.Update) {
    return this.instance.put<RewardWithUserRewards>(`/rewards/${id}`, payload);
  }

  delete(id: string) {
    return this.instance.delete<never>(`/rewards/${id}`);
  }

  // Method for users to claim rewards
  claimReward({ rewardId, userId }: { rewardId: string; userId: string }) {
    return this.instance.post<Prisma.UserRewardGetPayload<{}>>(`/rewards/${rewardId}/users/${userId}/claim`);
  }
}
