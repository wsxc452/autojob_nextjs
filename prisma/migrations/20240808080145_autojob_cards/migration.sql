/*
  Warnings:

  - You are about to drop the `Greatings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GreetingsType" AS ENUM ('ACTICE', 'DEACTIVE');

-- DropTable
DROP TABLE "Greatings";

-- DropEnum
DROP TYPE "GreatingsType";

-- CreateTable
CREATE TABLE "Greetings" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "status" "GreetingsType" NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Greetings_pkey" PRIMARY KEY ("id")
);
