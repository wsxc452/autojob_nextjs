/*
  Warnings:

  - You are about to drop the `UserBackup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserBackup";

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "dId" VARCHAR(50) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "username" VARCHAR(128),
    "passwordHash" VARCHAR(128) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isVip" BOOLEAN NOT NULL DEFAULT false,
    "isSuperUser" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER NOT NULL DEFAULT 1,
    "isDistributor" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_dId_key" ON "Users"("dId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_userId_idx" ON "Users"("userId");
