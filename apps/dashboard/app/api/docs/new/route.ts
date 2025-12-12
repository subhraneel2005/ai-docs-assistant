import { NewDocPayload } from "@/app/types";
import { prisma } from "@/prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  console.log("🔥 API HIT!");

  const payload: NewDocPayload = await request.json();

  //   console.log("📩 Received from extension:", payload);

  const { isAuthenticated } = await auth();

  if (!payload) {
    return new Response("DOC PAYLOAD NOT FOUND", { status: 404 });
  }
  if (!isAuthenticated) {
    return new Response("UNAUTHORIZED ACCESS. USER IS NOT LOGGED IN", {
      status: 401,
    });
  }

  const user = await currentUser();

  try {
    const { metadata, success, parsedMarkdown } = payload;

    if (success === false) {
      return new Response("SUCCESS FALSE FROM EXTENSION REQUEST", {
        status: 400,
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user?.id,
      },
    });

    if (!dbUser) {
      return new Response("USER NOT FOUND IN DATABASE", { status: 404 });
    }

    // add new doc to the user's doc table
    await prisma.doc.create({
      data: {
        userId: dbUser?.id,
        markdown: parsedMarkdown,
        title: metadata.title,
        description: metadata.description,
        pageUrl: metadata.url,
      },
    });

    return new Response("DOC ADDED SUCCESSFULLY", { status: 201 });
  } catch (error) {
    console.error(`❌ INTERNAL SERVER ERROR WHILE ADDING NEW DOCS: ${error}`);
    return new Response(
      `INTERNAL SERVER ERROR WHILE ADDING NEW DOCS: ${error}`,
      { status: 500 }
    );
  }
}
