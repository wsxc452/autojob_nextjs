-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "bindTime" TIMESTAMP(3),
ADD COLUMN     "isBind" BOOLEAN NOT NULL DEFAULT false;
