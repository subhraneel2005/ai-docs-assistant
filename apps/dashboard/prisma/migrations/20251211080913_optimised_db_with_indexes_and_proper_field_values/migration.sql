-- DropForeignKey
ALTER TABLE "Doc" DROP CONSTRAINT "Doc_userId_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_docId_fkey";

-- AlterTable
ALTER TABLE "Doc" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Summary" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Doc_userId_idx" ON "Doc"("userId");

-- CreateIndex
CREATE INDEX "Summary_docId_idx" ON "Summary"("docId");

-- AddForeignKey
ALTER TABLE "Doc" ADD CONSTRAINT "Doc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_docId_fkey" FOREIGN KEY ("docId") REFERENCES "Doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
