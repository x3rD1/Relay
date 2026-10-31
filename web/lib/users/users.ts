import { UserNotOnboardedError } from "@/errors";
import prisma from "../clients/prisma";

export const getUserByClerkId = async (clerkId: string) => {
  const userId = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!userId) throw new UserNotOnboardedError();

  return userId;
};

export const createUser = async (clerkId: string) => {
  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });
};
