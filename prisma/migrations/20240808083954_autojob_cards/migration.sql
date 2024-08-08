/*
  Warnings:

  - You are about to drop the column `oid` on the `search` table. All the data in the column will be lost.
  - Added the required column `userId` to the `search` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "search" DROP COLUMN "oid",
ADD COLUMN     "userId" VARCHAR(50) NOT NULL;
