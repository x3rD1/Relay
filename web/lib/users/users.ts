import prisma from "../clients/prisma";

export const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
};

export const createUser = async (clerkId: string) => {
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });
};
