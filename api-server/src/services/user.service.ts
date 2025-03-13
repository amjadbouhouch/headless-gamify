import { userValidator } from '@headless-gamify/common';
import { commonHelper } from 'src/utils';
import { Company, prisma, Prisma } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';
import { metricService } from './metric.service';
import { objectiveHelper } from 'src/utils/objective.helper';
import { assertHelper } from 'src/utils/assert.helper';
export namespace userService {
  export type ListArgs = CommonQueryParams & {
    company: Company;
  };

  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.user.findMany>[0]>['where'] = {
      companyId: company.id,
      isDeleted: false,
    };

    const items = await prisma.user.findMany({
      where,
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.user.count({
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
    return prisma.user.findUnique({
      where: {
        id,
        AND: {
          companyId: company.id,
          AND: {
            isDeleted: false,
          },
        },
      },
    });
  }

  export type CreateArgs = Prisma.UserCreateInput;
  export async function create(payload: CreateArgs) {
    const createUser = await prisma.user.create({
      data: {
        ...payload,
      },
    });
    //  TODO here
    return createUser;
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: Prisma.UserUpdateInput;
  };
  export function update({ company, id, payload }: UpdateArgs) {
    return prisma.user.update({
      where: {
        id,
        AND: {
          companyId: company.id,
        },
      },
      data: {
        ...payload,
      },
    });
  }
  export type DeleteArgs = {
    id: string;
    company: Company;
  };

  export async function remove({ id, company }: DeleteArgs) {
    return await prisma.user.update({
      where: {
        id,
        companyId: company.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  export type IncrementMetricArgs = {
    payload: userValidator.IncrementMetric;
    company: Company;
    userId: string;
    metricId: string;
  };
  export async function incrementMetric({ company, metricId, payload: { value }, userId }: IncrementMetricArgs) {
    assertHelper.assertBadRequest(value > 0, 'Value must be greater than 0');

    const user = await retrieve({ company, id: userId });
    assertHelper.assertNotFound(user, 'User not found');
    const metric = await metricService.retrieve({ company, id: metricId });
    assertHelper.assertNotFound(metric, 'Metric not found');

    await prisma.$transaction(async (tx) => {
      const objectives = await tx.objective.findMany({
        where: {
          metricId,
          companyId: company.id,
          isDeleted: false,
        },
        include: {
          objectiveTracker: {
            where: {
              userId,
              isDeleted: false,
            },
          },
        },
      });
      let totalXpGain = value * metric.defaultGainXP; // Base XP gain
      // Step 2: Update progress for each objective
      for (const objective of objectives) {
        const rewardedXP = await objectiveHelper.incrementObjectiveTracker({
          objective,
          tx,
          value,
        });
        totalXpGain += rewardedXP;
      }
      // step 3: update user xp
      return tx.user.update({
        where: {
          id: userId,
        },
        data: {
          //
          xp: { increment: totalXpGain },
          //
          level: commonHelper.getCurrentLevel(user.xp + totalXpGain),
        },
      });
    });
  }
}
