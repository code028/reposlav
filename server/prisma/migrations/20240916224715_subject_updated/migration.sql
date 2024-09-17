/*
  Warnings:

  - Added the required column `description` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `espb` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `subject` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `subject` ADD COLUMN `description` LONGTEXT NOT NULL,
    ADD COLUMN `espb` INTEGER NOT NULL,
    MODIFY `code` VARCHAR(191) NOT NULL;
