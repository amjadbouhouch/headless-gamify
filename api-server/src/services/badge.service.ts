import { commonHelper } from 'src/utils';
import { Company, prisma, Prisma } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';
import { badgeValidator } from '@headless-gamify/common';
import { assertHelper } from 'src/utils/assert.helper';
export namespace badgeService {
  export type ListArgs = CommonQueryParams & {
    company: Company;
  };

  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.badge.findMany>[0]>['where'] = {
      companyId: company.id,
      isDeleted: false,
    };

    const items = await prisma.badge.findMany({
      where,
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
      include: {
        conditions: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const total = await prisma.badge.count({
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
    return prisma.badge.findUnique({
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
        conditions: {
          where: {
            isDeleted: false,
          },
        },
      },
    });
  }

  export type CreateArgs = Prisma.BadgeCreateInput;
  export async function create(payload: CreateArgs) {
    return await prisma.badge.create({
      data: {
        ...payload,
      },
      include: {
        conditions: true,
      },
    });
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: badgeValidator.Update;
  };
  export async function update({ company, id, payload }: UpdateArgs) {
    const badge = await retrieve({ company, id });
    assertHelper.assertExist(badge, 'Badge not found');
    return prisma.badge.update({
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
        conditions: {
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

  export async function remove({ id, company }: DeleteArgs) {
    return await prisma.badge.update({
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
