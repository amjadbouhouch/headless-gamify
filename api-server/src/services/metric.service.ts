import { commonHelper } from 'src/utils';
import { Company, prisma, Prisma } from 'src/utils/prisma';
import { CommonQueryParams } from '../validators/common.validator';

export namespace metricService {
  //
  export type ListArgs = CommonQueryParams & {
    company: Company;
  };
  //
  export async function list({ company, ...rest }: ListArgs) {
    const items = await prisma.metric.findMany({
      where: {
        companyId: company.id,
        isDeleted: false,
      },
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.metric.count({
      where: {
        companyId: company.id,
        isDeleted: false,
      },
    });

    const response = commonHelper.getPaginationFields({
      totalDocs: total,
      docs: items,
      limit: rest.limit,
      page: rest.page,
    });

    return response;
  }

  //
  export type RetrieveArgs = {
    id: string;
    company: Company;
  };
  //
  export function retrieve({ company, id }: RetrieveArgs) {
    return prisma.metric.findUnique({
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
  //
  export type CreateArgs = Prisma.MetricCreateInput;
  export async function create(payload: CreateArgs) {
    return await prisma.metric.create({
      data: {
        ...payload,
      },
    });
  }
  //
  export type UpdateArgs = {
    id: string;
    company: Company;
    payload: Prisma.MetricUpdateInput;
  };
  //
  export function update({ company, id, payload }: UpdateArgs) {
    return prisma.metric.update({
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
  //
  export type DeleteArgs = {
    id: string;
    company: Company;
  };

  export async function remove({ id, company }: DeleteArgs) {
    return await prisma.metric.update({
      where: {
        id,
        companyId: company.id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  // New function to get user metric history
  export type GetUserMetricHistoryArgs = CommonQueryParams & {
    company: Company;
    userId: string;
    metricId?: string;
  };

  export async function getUserMetricHistory({ company, userId, metricId, ...rest }: GetUserMetricHistoryArgs) {
    const where: Prisma.MetricHistoryWhereInput = {
      userId,
      isDeleted: false,
      metric: {
        companyId: company.id,
        isDeleted: false,
      },
    };

    // Add metricId filter if provided
    if (metricId) {
      where.metricId = metricId;
    }

    const items = await prisma.metricHistory.findMany({
      where,
      include: {
        metric: true, // Include the metric details
      },
      skip: (rest.page - 1) * rest.limit,
      take: rest.limit,
      orderBy: {
        [rest.sorter]: rest.direction,
      },
    });

    const total = await prisma.metricHistory.count({
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
}
