import { conditionValidator } from '@headless-gamify/common';
import { assertHelper } from 'src/utils/assert.helper';
import { prisma } from 'src/utils/prisma';
export namespace conditionService {
  export type CreateArgs = {
    payload: conditionValidator.Create;
  };
  export async function create({ payload }: CreateArgs) {
    return await prisma.condition.create({
      data: {
        ...payload,
      },
    });
  }
  export type UpdateArgs = {
    id: string;
    payload: conditionValidator.Update;
  };
  export async function update({ id, payload }: UpdateArgs) {
    const condition = await prisma.condition.findUnique({
      where: {
        id,
        AND: {
          isDeleted: false,
        },
      },
    });

    assertHelper.assertExist(condition, 'Condition not found');

    return prisma.condition.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }

  export type DeleteArgs = {
    id: string;
  };

  export async function remove({ id }: DeleteArgs) {
    return await prisma.condition.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
