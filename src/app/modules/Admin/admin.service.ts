import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, ...filterData } = query;

  const andCondition: Prisma.AdminWhereInput[] = [];

  const adminSearchableFields = ["name", "email"];

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
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
