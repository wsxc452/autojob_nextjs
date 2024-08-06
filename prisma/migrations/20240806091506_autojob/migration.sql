/*
  Warnings:

  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY', 'POINTS');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "username",
ADD COLUMN     "avatar" VARCHAR(256),
ADD COLUMN     "firstName" VARCHAR(128),
ADD COLUMN     "fullName" VARCHAR(128),
ADD COLUMN     "lastName" VARCHAR(128),
ADD COLUMN     "userName" VARCHAR(128);

-- CreateTable
CREATE TABLE "Cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "type" "CardType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdBy" VARCHAR(64) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "distributorId" INTEGER,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardTypes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" "CardType" NOT NULL DEFAULT 'POINTS',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cValue" INTEGER NOT NULL DEFAULT 0,
    "desc" VARCHAR(100),
    "rebate" DOUBLE PRECISION DEFAULT 0,
    "onlyOneTime" BOOLEAN NOT NULL DEFAULT false,
    "isCanDistributor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CardTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCards" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "cardCode" VARCHAR(50) NOT NULL,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),
    "usersId" INTEGER,

    CONSTRAINT "UserCards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cards_code_key" ON "Cards"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserCards_cardCode_key" ON "UserCards"("cardCode");

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_code_fkey" FOREIGN KEY ("code") REFERENCES "UserCards"("cardCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCards" ADD CONSTRAINT "UserCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
