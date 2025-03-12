import { PaginationResponse } from '@headless-gamify/common';
import { Prisma } from '@headless-gamify/prisma-client';
import { randomBytes } from 'crypto';

const BASE_XP = 100;
const GROWTH_FACTOR = 1.4;

function getXpRequiredForLevel(level: number) {
  if (level < 1) throw new Error('Level must be at least 1');
  return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, level - 1));
}

function getTotalXpForLevel(targetLevel: number): number {
  let totalXp = 0;
  for (let l = 1; l < targetLevel; l++) {
    totalXp += getXpRequiredForLevel(l);
  }
  return totalXp;
}
export function getCurrentLevel(xp: number): number {
  if (xp < 0) return 1;

  let level = 1;
  while (xp >= getTotalXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

export function generateApiKey(length = 32, chunkSize = 8) {
  const rawKey = randomBytes(length).toString('hex');
  return rawKey
    .match(new RegExp(`.{1,${chunkSize}}`, 'g'))!
    .join('-')
    .toUpperCase();
}
type GetPaginationFieldsType<T> = {
  totalDocs: number;
  limit: number;
  page: number;
  docs: T[];
};

export function getPaginationFields<T>({
  totalDocs,
  limit,
  page,
  docs,
}: GetPaginationFieldsType<T>): PaginationResponse<T> {
  const totalPagesFloat = totalDocs / limit;
  // @ts-ignore
  let totalPagesInt: any = parseInt(totalDocs / limit);
  if (totalPagesFloat > totalPagesInt) totalPagesInt++;
  const nextPage = totalPagesInt > page ? page + 1 : null;
  const hasNextPage = !!nextPage;
  const prevPage = page === 1 ? null : page - 1;
  const hasPrevPage = !!prevPage;

  return {
    docs: docs,
    totalDocs,
    limit,
    page,
    totalPages: totalPagesInt,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  };
}

// validation rules
export function isPrismaValidationError(error: any): error is Prisma.PrismaClientValidationError {
  return error.constructor.name === Prisma.PrismaClientValidationError.name;
}

// something unique and it got duplicated
export function isPrismaConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export function isPrismaKnownRequestError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}
