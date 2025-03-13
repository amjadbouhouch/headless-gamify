import { rewardValidator } from '@headless-gamify/common';
import { commonHelper } from 'src/utils';
import { Company, prisma, Prisma } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';
import { assertHelper } from 'src/utils/assert.helper';

export namespace rewardService {
  export type ListArgs = CommonQueryParams & {
    company: Company;
  };

  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.reward.findMany>[0]>['where'] = {
      companyId: company.id,
      isDeleted: false,
    };

    const items = await prisma.reward.findMany({
      where,
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.reward.count({
      where,
    });

    const response = commonHelper.getPaginationFields({
      totalDocs: total,
      docs: items,
      limit: rest.limit,
      page: rest.page,
    });

    return response;
  }

  export type RetrieveArgs = {
    id: string;
    company: Company;
  };

  export function retrieve({ company, id }: RetrieveArgs) {
    return prisma.reward.findUnique({
      where: {
        id,
        AND: {
          companyId: company.id,
          AND: {
            isDeleted: false,
          },
        },
      },
      include: {
        userRewards: {
          where: {
            isDeleted: false,
          },
        },
      },
    });
  }

  export type CreateArgs = Prisma.RewardCreateInput;
  export function create(payload: CreateArgs) {
    return prisma.reward.create({
      data: {
        ...payload,
      },
      include: {
        userRewards: true,
      },
    });
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: rewardValidator.Update;
  };
  export async function update({ company, id, payload }: UpdateArgs) {
    const reward = await retrieve({ company, id });
    assertHelper.assertNotFound(reward, 'Reward not found');
    return prisma.reward.update({
      where: {
        id,
        AND: {
          companyId: company.id,
        },
      },
      data: {
        ...payload,
      },
      include: {
        userRewards: {
          where: {
            isDeleted: false,
          },
        },
      },
    });
  }

  export type DeleteArgs = {
    id: string;
    company: Company;
  };

  export function remove({ id, company }: DeleteArgs) {
    return prisma.reward.update({
      where: {
        id,
        companyId: company.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  export type ClaimRewardArgs = {
    userId: string;
    rewardId: string;
    company: Company;
  };

  export async function claimReward({ userId, rewardId, company }: ClaimRewardArgs) {
    // First, check if the reward exists and belongs to the company
    const reward = await prisma.reward.findUnique({
      where: {
        id: rewardId,
        companyId: company.id,
        isDeleted: false,
      },
    });
    assertHelper.assertNotFound(reward, 'Reward not found');

    // Check if the user exists and belongs to the company
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        companyId: company.id,
        isDeleted: false,
      },
    });
    assertHelper.assertNotFound(user, 'User not found');

    // Check if the user has enough XP to claim the reward
    assertHelper.assertBadRequest(
      user.xp >= reward.xpThreshold,
      `User does not have enough XP to claim this reward. Required: ${reward.xpThreshold}, Current: ${user.xp}`
    );

    // Check if the reward has expired
    if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
      assertHelper.assertBadRequest(false, 'This reward has expired');
    }

    // Check if the reward has available quantity
    assertHelper.assertBadRequest(reward.quantity > 0, 'This reward is out of stock');

    // Check if the user has already claimed this reward
    // const existingClaimsCount = await prisma.userReward.count({
    //   where: {
    //     userId,
    //     rewardId,
    //     isDeleted: false,
    //   },
    // });
    // TODO here
    // if (existingClaimsCount >= user allowed to claim this reward) {
    //   throw new Error('User reached maximum claim limit');
    // }
    const _userReward = await prisma.$transaction(async (tx) => {
      const userReward = await tx.userReward.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          reward: {
            connect: {
              id: rewardId,
            },
          },
          status: 'claimed',
          claimedAt: new Date(),
        },
      });

      await tx.reward.update({
        where: {
          id: rewardId,
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });

      // Update user's XP
      await tx.user.update({
        where: { id: userId },
        data: {
          usedXp: {
            increment: reward.xpThreshold,
          },
        },
      });
      return userReward;
    });

    return _userReward;
  }
}
