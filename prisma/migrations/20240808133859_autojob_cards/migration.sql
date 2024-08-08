/*
  Warnings:

  - You are about to drop the column `position` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "position";

-- CreateTable
CREATE TABLE "filtered_position_keywords" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" VARCHAR(64) NOT NULL,

    CONSTRAINT "filtered_position_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filtered_position_keywords_taskId_keyword_key" ON "filtered_position_keywords"("taskId", "keyword");

-- AddForeignKey
ALTER TABLE "filtered_position_keywords" ADD CONSTRAINT "filtered_position_keywords_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
