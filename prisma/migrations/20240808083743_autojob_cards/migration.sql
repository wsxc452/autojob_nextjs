/*
  Warnings:

  - Added the required column `userId` to the `filtered_company_keywords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "filtered_company_keywords" ADD COLUMN     "userId" VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "userId" VARCHAR(64) NOT NULL,
ALTER COLUMN "oid" DROP NOT NULL;
