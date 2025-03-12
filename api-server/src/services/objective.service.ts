import { objectiveValidator } from '@headless-gamify/common';
import { HTTPException } from 'hono/http-exception';
import { commonHelper } from 'src/utils';
import { Company, prisma } from 'src/utils/prisma';
import { CommonQueryParamsOutput } from '../validators/common.validator';
import { objectiveHelper } from 'src/utils/objective.helper';

export namespace objectiveService {
  export type ListArgs = CommonQueryParamsOutput & {
    company: Company;
  };
  const _include: NonNullable<Parameters<typeof prisma.objective.findMany>[0]>['include'] = {
    metric: true,
    objectiveTracker: {
      include: {
        user: true,
      },
      // where: {
      //   isDeleted: false,
      // },
    },
    // users: true,
  };
  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.objective.findMany>[0]>['where'] = {
      companyId: company.id,
    };

    const items = await prisma.objective.findMany({
      where,
      include: _include,
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.objective.count({
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
    return prisma.objective.findUnique({
      where: {
        id,
        AND: {
          companyId: company.id,
          AND: {
            isDeleted: false,
          },
        },
      },
      include: _include,
    });
  }

  export type CreateArgs = objectiveValidator.CreateOutput;
  export async function create(payload: CreateArgs, company: Company) {
    const membersIds = await objectiveHelper.getMembersIds({ company, payload });

    const data: NonNullable<Parameters<typeof prisma.objective.create>[0]>['data'] = {
      ...payload,
      users: {
        connect: payload.users.map((id) => ({ id })),
      },
      objectiveTracker: {
        createMany: {
          data: membersIds.map((elem) => ({
            userId: elem,
          })),
        },
      },
      companyId: company.id,
    };

    const createdItem = await prisma.objective.create({
      data,
      include: _include,
    });
    return createdItem;
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: objectiveValidator.Update;
  };
  export async function update({ company, id, payload }: UpdateArgs) {
    const item = await retrieve({ company, id });

    if (!item) {
      throw new HTTPException(404, { message: `Objective not found with id=${id}` });
    }

    const membersIds = await objectiveHelper.getMembersIds({ company, payload });

    // Fetch existing objective trackers
    const existingTrackers = await prisma.objectiveTracker.findMany({
      where: { objectiveId: id },
    });

    // Identify new users to add
    const newUserIds = membersIds.filter((userId) => !existingTrackers.some((tracker) => tracker.userId === userId));

    // Identify users to remove
    const usersToRemove = existingTrackers.filter((tracker) => !membersIds.includes(tracker.userId));

    // Identify users to restore (previously deleted but now part of the objective again)
    const usersToRestore = existingTrackers.filter(
      (tracker) => membersIds.includes(tracker.userId) && tracker.isDeleted === true
    );

    return prisma.objective.update({
      where: {
        id,
        AND: {
          companyId: company.id,
          isDeleted: false,
        },
      },
      data: {
        ...payload,
        users: payload.users
          ? {
              connect: payload.users.map((id) => ({ id })),
            }
          : undefined,
        objectiveTracker: {
          // Add new users
          createMany: {
            data: newUserIds.map((userId) => ({
              userId,
              progress: 0,
              isDeleted: false,
            })),
          },
          // Remove users no longer in the objective
          updateMany: [
            {
              where: {
                userId: { in: usersToRemove.map((tracker) => tracker.userId) },
              },
              data: {
                isDeleted: true,
              },
            },
            // Restore previously deleted users
            {
              where: {
                userId: { in: usersToRestore.map((tracker) => tracker.userId) },
              },
              data: {
                isDeleted: false,
              },
            },
          ],
        },
      },
      include: _include,
    });
  }
  export type DeleteArgs = {
    id: string;
    company: Company;
  };

  export async function remove({ id, company }: DeleteArgs) {
    return await prisma.objective.update({
      where: {
        id,
        companyId: company.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
