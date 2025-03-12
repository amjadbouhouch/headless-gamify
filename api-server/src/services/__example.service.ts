import { commonHelper } from 'src/utils';
import { Company, prisma, User, Prisma } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';
export namespace exampleService {
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
}
