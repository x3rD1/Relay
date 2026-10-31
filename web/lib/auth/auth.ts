import { HttpError, UnauthorizedError, UserNotOnboardedError } from "@/errors";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "../users/users";
import { verifyToken } from "@clerk/backend";

export async function getAuthenticatedUserIdFromClerkAuth() {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const user = await getUserByClerkId(userId);
  if (!user) throw new UserNotOnboardedError();

  return user.id;
}

export async function getAuthenticatedUserIdFromClerkToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authHeader.split(" ")[1];

  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    throw new Error("Clerk secret key is not configured");
  }

  try {
    const claims = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });

    const { id: userId } = await getUserByClerkId(claims.sub);

    if (!userId) throw new UserNotOnboardedError();

    return userId;
  } catch (error) {
    if (error instanceof HttpError) throw error;

    console.error(error);
    throw new UnauthorizedError();
  }
}
