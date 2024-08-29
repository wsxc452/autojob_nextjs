/*
  Warnings:

  - You are about to drop the column `usersId` on the `Greetings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Greetings" DROP CONSTRAINT "Greetings_usersId_fkey";

-- AlterTable
ALTER TABLE "Greetings" DROP COLUMN "usersId";

-- AddForeignKey
ALTER TABLE "Greetings" ADD CONSTRAINT "Greetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
