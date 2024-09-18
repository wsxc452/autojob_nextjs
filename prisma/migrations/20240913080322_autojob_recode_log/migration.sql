/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `ReferrerRecord` table. All the data in the column will be lost.
  - You are about to drop the column `isVip` on the `ReferrerRecord` table. All the data in the column will be lost.
  - Added the required column `codeUserId` to the `ReferrerRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReferrerRecord" DROP CONSTRAINT "ReferrerRecord_cardId_fkey";

-- DropIndex
DROP INDEX "ReferrerRecord_cardId_idx";

-- AlterTable
ALTER TABLE "ReferrerRecord" DROP COLUMN "fromUserId",
DROP COLUMN "isVip",
ADD COLUMN     "codeIsVip" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "codeUserId" VARCHAR(64) NOT NULL;

-- CreateTable
CREATE TABLE "ReferrerBindRecord" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "money" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "codeUserId" VARCHAR(64) NOT NULL,
    "codeIsVip" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReferrerBindRecord_pkey" PRIMARY KEY ("id")
);
