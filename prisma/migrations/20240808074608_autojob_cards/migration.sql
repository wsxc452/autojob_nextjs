-- CreateEnum
CREATE TYPE "CreatingsType" AS ENUM ('ACTICE', 'DEACTIVE');

-- CreateTable
CREATE TABLE "Creatings" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "status" "CreatingsType" NOT NULL,
    "createdBy" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creatings_pkey" PRIMARY KEY ("id")
);
