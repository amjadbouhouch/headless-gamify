import { commonHelper } from 'src/utils';
import { Company, prisma, Prisma, Team } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';

export namespace teamService {
  export type ListArgs = CommonQueryParams & {
    company: Company;
  };

  export async function list({ company, ...rest }: ListArgs) {
    const where: NonNullable<Parameters<typeof prisma.team.findMany>[0]>['where'] = {
      companyId: company.id,
      isDeleted: false,
    };

    const items = await prisma.team.findMany({
      where,
      include: {
        members: {
          where: {
            isDeleted: false,
          },
        },
      },
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.team.count({
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
    return prisma.team.findUnique({
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
        members: {
          where: {
            isDeleted: false,
          },
        },
      },
    });
  }

  export type CreateArgs = Prisma.TeamCreateInput;
  export async function create(payload: CreateArgs) {
    const team = await prisma.team.findFirst({
      where: {
        name: payload.name,
      },
    });
    if (team && team.isDeleted) {
      return prisma.team.update({
        where: {
          id: team.id,
        },
        data: {
          ...payload,
          isDeleted: false,
        },
        include: {
          members: {
            where: {
              isDeleted: false,
            },
          },
        },
      });
    }
    const created = prisma.team.create({
      data: {
        ...payload,
      },
      include: {
        members: {
          where: {
            isDeleted: false,
          },
        },
      },
    });
    //  TODO here
    return created;
  }

  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: Prisma.TeamUpdateInput;
  };
  export function update({ company, id, payload }: UpdateArgs) {
    return prisma.team.update({
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
        members: {
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
    return await prisma.team.update({
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
