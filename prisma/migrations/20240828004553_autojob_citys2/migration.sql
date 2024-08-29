-- AlterTable
ALTER TABLE "search" ADD COLUMN     "tasksId" INTEGER;

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_tasksId_fkey" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
