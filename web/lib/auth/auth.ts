import { UnauthorizedError, UserNotOnboardedError } from "@/errors";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "../users/users";

export async function getAuthenticatedUserId() {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const user = await getUserByClerkId(userId);
  if (!user) throw new UserNotOnboardedError();

  return user.id;
}
