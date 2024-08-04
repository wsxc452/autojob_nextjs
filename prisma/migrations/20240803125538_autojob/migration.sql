/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserBackup" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "username" VARCHAR(128),
    "passwordHash" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBackup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBackup_userId_key" ON "UserBackup"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBackup_email_key" ON "UserBackup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserBackup_username_key" ON "UserBackup"("username");

-- CreateIndex
CREATE INDEX "UserBackup_email_idx" ON "UserBackup"("email");

-- CreateIndex
CREATE INDEX "UserBackup_username_idx" ON "UserBackup"("username");

-- CreateIndex
CREATE INDEX "UserBackup_email_username_idx" ON "UserBackup"("email", "username");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
