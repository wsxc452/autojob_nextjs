/*
  Warnings:

  - Added the required column `pinyin` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "City" ADD COLUMN     "pinyin" VARCHAR(100) NOT NULL;
