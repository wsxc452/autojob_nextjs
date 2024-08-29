-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "activeCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bossOnlineCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "headhunterCheck" BOOLEAN NOT NULL DEFAULT false;
