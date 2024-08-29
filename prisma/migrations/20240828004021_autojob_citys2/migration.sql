-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_taskId_fkey";

-- DropIndex
DROP INDEX "search_taskId_md5_key";
