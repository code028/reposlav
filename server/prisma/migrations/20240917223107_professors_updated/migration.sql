/*
  Warnings:

  - You are about to drop the `profesors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `profesors` DROP FOREIGN KEY `Profesors_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `profesors` DROP FOREIGN KEY `Profesors_userId_fkey`;

-- DropTable
DROP TABLE `profesors`;

-- CreateTable
CREATE TABLE `ProfessorsOnDepartments` (
    `userId` INTEGER NOT NULL,
    `departmentId` INTEGER NOT NULL,

    UNIQUE INDEX `ProfessorsOnDepartments_userId_departmentId_key`(`userId`, `departmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProfessorsOnDepartments` ADD CONSTRAINT `ProfessorsOnDepartments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfessorsOnDepartments` ADD CONSTRAINT `ProfessorsOnDepartments_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
