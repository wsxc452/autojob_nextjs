/*
  Warnings:

  - You are about to alter the column `autoThreadNo` on the `search` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE `search` MODIFY `autoThreadNo` VARCHAR(32) NOT NULL DEFAULT '';
