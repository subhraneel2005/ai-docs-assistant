/*
  Warnings:

  - Added the required column `description` to the `Doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doc" ADD COLUMN     "canonical" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT;
