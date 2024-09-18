/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ReferrerBindRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CardTypes" ALTER COLUMN "desc" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "ReferrerRecord" ALTER COLUMN "cardInfo" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "UsersAccoutLog" ALTER COLUMN "desc" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Words" ALTER COLUMN "desc" SET DATA TYPE VARCHAR(500);

-- CreateIndex
CREATE UNIQUE INDEX "ReferrerBindRecord_userId_key" ON "ReferrerBindRecord"("userId");
