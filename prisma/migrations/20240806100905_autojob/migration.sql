/*
  Warnings:

  - You are about to drop the column `usersId` on the `UserCards` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `CardTypes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserCards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_code_fkey";

-- AlterTable
ALTER TABLE "CardTypes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserCards" DROP COLUMN "usersId",
ADD COLUMN     "cardsId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "UserCards" ADD CONSTRAINT "UserCards_cardsId_fkey" FOREIGN KEY ("cardsId") REFERENCES "Cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
