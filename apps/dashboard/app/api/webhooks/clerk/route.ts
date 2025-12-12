import { prisma } from "@/prisma/client";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();
  const eventType = payload?.type;
  const user = payload?.data as UserJSON;
  const userEmail = user?.email_addresses[0]?.email_address;

  try {
    if (!userEmail) {
      return new Response("USER EMAIL NOT FOUND!", { status: 404 });
    }

    if (!user?.id) {
      return new Response(
        "NOTHING TO PROCESS ON DATABASE AS NO CLERK-ID FOUND",
        { status: 400 }
      );
    }
    if (eventType === "user.created") {
      await prisma.user.create({
        data: {
          clerkId: user?.id,
          email: userEmail,
        },
      });

      return new Response("NEW USER ADDED TO DATABASE", { status: 201 });
    }

    if (eventType === "user.updated") {
      await prisma.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          email: userEmail,
        },
      });

      return new Response("USER UPDATED SUCCESSFULLY", { status: 200 });
    }

    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: {
          clerkId: user.id,
        },
      });

      return new Response("USER DELETED SUCCESS", { status: 200 });
    }
  } catch (error) {
    console.error("WEBHOOK ERROR: " + error);
    return new Response(`WEBHOOK ERROR: ${error}`, { status: 500 });
  }
}
