import { challengeValidator } from '@headless-gamify/common';
import { commonHelper } from 'src/utils';
import { assertHelper } from 'src/utils/assert.helper';
import { Company, prisma } from 'src/utils/prisma';
import { CommonQueryParamsOutput } from '../validators/common.validator';

export namespace challengeService {
  export type ListArgs = CommonQueryParamsOutput & {
    company: Company;
  };

  const _include: NonNullable<Parameters<typeof prisma.challenge.findMany>[0]>['include'] = {
    objectives: true,
    challengeTrackers: {
      include: {
        user: true,
        team: true,
      },
    },
  };

  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.challenge.findMany>[0]>['where'] = {
      companyId: company.id,
      isDeleted: false,
    };

    const items = await prisma.challenge.findMany({
      where,
      include: _include,
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.challenge.count({
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
    return prisma.challenge.findUnique({
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

  export type CreateArgs = challengeValidator.CreateOutput;
  export async function create(payload: CreateArgs, company: Company) {
    const data: NonNullable<Parameters<typeof prisma.challenge.create>[0]>['data'] = {
      ...payload,
      objectives: {
        connect: payload.objectives.map((id) => ({ id })),
      },
      companyId: company.id,
    };

    const createdItem = await prisma.challenge.create({
      data,
      include: _include,
    });
    return createdItem;
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: challengeValidator.Update;
  };
  export async function update({ company, id, payload }: UpdateArgs) {
    const item = await retrieve({ company, id });
    assertHelper.assertNotFound(item, `Challenge not found with id=${id}`);

    return prisma.challenge.update({
      where: {
        id,
        AND: {
          companyId: company.id,
          isDeleted: false,
        },
      },
      data: {
        ...payload,
        objectives: payload.objectives
          ? {
              set: [], // Clear existing connections
              connect: payload.objectives.map((id) => ({ id })),
            }
          : undefined,
      },
      include: _include,
    });
  }

  export type DeleteArgs = {
    id: string;
    company: Company;
  };

  export function remove({ id, company }: DeleteArgs) {
    return prisma.challenge.update({
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
