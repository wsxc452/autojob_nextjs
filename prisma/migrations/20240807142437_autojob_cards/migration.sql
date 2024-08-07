/*
  Warnings:

  - You are about to drop the `UserCards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCards" DROP CONSTRAINT "UserCards_cardsId_fkey";

-- DropForeignKey
ALTER TABLE "UserCards" DROP CONSTRAINT "UserCards_userId_fkey";

-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "redeemedBy" VARCHAR(64);

-- DropTable
DROP TABLE "UserCards";
