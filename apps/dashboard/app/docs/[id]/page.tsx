import { Doc } from "@/app/types";
import SingleDoc from "@/components/screens/SingleDoc";
import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    console.log("NOT AUTHENTICATED");
    notFound();
  }

  const doc = await prisma.doc.findFirst({
    where: {
      id,
      user: {
        clerkId: userId,
      },
    },
    include: {
      summaries: true,
      _count: true,
    },
  });

  if (!doc) {
    notFound();
  }
  return <SingleDoc doc={doc as unknown as Doc} />;
}
