import { prisma } from "@/prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { isAuthenticated } = await auth();

  const user = await currentUser();

  try {
    if (!isAuthenticated) {
      return new Response("UNAUTHORIZED ACCESS. USER IS NOT LOGGED IN", {
        status: 401,
      });
    }

    const allUserDocs = await prisma.doc.findMany({
      where: {
        user: {
          clerkId: user?.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        pageUrl: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(allUserDocs), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("INTERNAL SERVER ERROR", { status: 500 });
  }
}
