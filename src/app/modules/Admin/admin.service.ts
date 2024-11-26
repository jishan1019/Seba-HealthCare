import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import calculatePagination from "../../../helper/paginationHelper";
import prisma from "../../../helper/prisma";

const getAllAdminFromDB = async (
  query: Record<string, unknown>,
  options: any
) => {
  const { searchTerm, ...filterData } = query;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andCondition: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AdminService = {
  getAllAdminFromDB,
};
