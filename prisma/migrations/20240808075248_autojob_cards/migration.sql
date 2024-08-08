/*
  Warnings:

  - You are about to drop the `Creatings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GreatingsType" AS ENUM ('ACTICE', 'DEACTIVE');

-- DropTable
DROP TABLE "Creatings";

-- DropEnum
DROP TYPE "CreatingsType";

-- CreateTable
CREATE TABLE "Greatings" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "status" "GreatingsType" NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Greatings_pkey" PRIMARY KEY ("id")
);
