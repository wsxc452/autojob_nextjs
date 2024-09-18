-- CreateEnum
CREATE TYPE "AcountLogType" AS ENUM ('BINDREFERRER', 'CODECHARGE', 'WORDCHARGE');

-- AlterTable
ALTER TABLE "UsersAccoutLog" ADD COLUMN     "type" "AcountLogType";
