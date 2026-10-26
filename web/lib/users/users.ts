import prisma from "../clients/prisma";

export const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
};
