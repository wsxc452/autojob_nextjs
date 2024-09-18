/*
  Warnings:

  - Added the required column `cardCode` to the `ReferrerRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReferrerRecord" ADD COLUMN     "cardCode" VARCHAR(200) NOT NULL,
ADD COLUMN     "cardType" "CardType";

-- CreateTable
CREATE TABLE "WordsRecord" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(64) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "money" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wordInfo" VARCHAR(200),
    "cardType" "CardType",
    "wordCode" VARCHAR(200) NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "WordsRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordsRecord" ADD CONSTRAINT "WordsRecord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
