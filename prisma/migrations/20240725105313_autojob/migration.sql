-- AlterTable
ALTER TABLE `search` ADD COLUMN `blackInfo` VARCHAR(50) NULL,
    ADD COLUMN `isCanPost` BOOLEAN NULL,
    ADD COLUMN `whiteInfo` VARCHAR(50) NULL;
