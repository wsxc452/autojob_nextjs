/*
  Warnings:

  - You are about to drop the column `tasksId` on the `search` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_tasksId_fkey";

-- AlterTable
ALTER TABLE "search" DROP COLUMN "tasksId";

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
