import { createClerkClient } from "@clerk/chrome-extension/client";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

export async function getClerkToken() {
  const clerk = await createClerkClient({
    publishableKey: PUBLISHABLE_KEY,
    syncHost: "http://localhost",
    background: true,
  });

  if (!clerk.session) {
    return null;
  }

  const token = await clerk.session.getToken();

  return token;
}
