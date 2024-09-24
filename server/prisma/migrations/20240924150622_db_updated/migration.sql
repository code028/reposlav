/*
  Warnings:

  - You are about to drop the column `studentId` on the `work` table. All the data in the column will be lost.
  - Added the required column `studentTableId` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `Work_studentId_fkey`;

-- AlterTable
ALTER TABLE `work` DROP COLUMN `studentId`,
    ADD COLUMN `studentTableId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Work` ADD CONSTRAINT `Work_studentTableId_fkey` FOREIGN KEY (`studentTableId`) REFERENCES `Student`(`studentTableId`) ON DELETE RESTRICT ON UPDATE CASCADE;
