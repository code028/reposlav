/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `work` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `File_workId_fkey`;

-- DropForeignKey
ALTER TABLE `work` DROP FOREIGN KEY `Work_studentTableId_fkey`;

-- DropTable
DROP TABLE `file`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `work`;
