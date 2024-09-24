/*
  Warnings:

  - You are about to drop the column `wordId` on the `files` table. All the data in the column will be lost.
  - Added the required column `workId` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `Files_wordId_fkey`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `wordId`,
    ADD COLUMN `workId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `Work`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
