import { createUser } from "@/lib/users/users";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  let evt;

  try {
    evt = await verifyWebhook(req);
  } catch (error) {
    console.error("Webhook verification failed:", error);

    return new Response("Invalid webhook", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    try {
      await createUser(evt.data.id);
    } catch (error) {
      console.error("Failed to create Relay user:", error);

      return new Response("Failed to create Relay user", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", {
    status: 200,
  });
}
