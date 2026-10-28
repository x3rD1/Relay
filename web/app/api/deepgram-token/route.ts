import { HttpError } from "@/errors";
import { getUserByClerkId } from "@/lib/users/users";
import { verifyToken } from "@clerk/backend";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { error: "Unauthorized missing token" },
      { status: 401 },
    );
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;

    if (!clerkSecretKey) {
      return Response.json(
        { error: "Clerk secret key is not configured" },
        { status: 500 },
      );
    }

    const claims = await verifyToken(token, {
      secretKey: clerkSecretKey,
    });

    await getUserByClerkId(claims.sub);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error(error);
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const apikey = process.env.DEEPGRAM_API_KEY;

  if (!apikey) {
    return Response.json(
      { error: "Deepgram API key is not configured" },
      { status: 500 },
    );
  }

  const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
    method: "POST",
    headers: {
      Authorization: `Token ${apikey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ttl_seconds: 30,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { error: "Failed to create Deepgram token" },
      { status: response.status },
    );
  }

  const data = await response.json();

  return Response.json({
    token: data.access_token,
  });
}
