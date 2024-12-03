import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
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

  const total = await prisma.admin.count({
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

const getSingleAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateAdminFromDB = async (id: string, payload: Partial<Admin>) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) {
    throw new Error("Admin not found");
  }

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (trxClient) => {
    const adminDeletedData = await trxClient.admin.delete({
      where: {
        id: id,
      },
    });

    const userDeleteData = await trxClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

const softAdminDeleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (trxClient) => {
    const adminDeletedData = await trxClient.admin.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userDeleteData = await trxClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminFromDB,
  deleteAdminFromDB,
  softAdminDeleteFromDB,
};
