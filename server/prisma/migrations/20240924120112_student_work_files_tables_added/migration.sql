-- CreateTable
CREATE TABLE `Student` (
    `studentTableId` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `studentIndexNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `facultyId` INTEGER NOT NULL,
    `facultyName` VARCHAR(191) NOT NULL,
    `universityId` INTEGER NOT NULL,
    `universityName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`studentTableId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Work` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `degree` INTEGER NOT NULL DEFAULT 5,
    `workName` VARCHAR(191) NOT NULL,
    `workGrade` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `wordId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Work` ADD CONSTRAINT `Work_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentTableId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_wordId_fkey` FOREIGN KEY (`wordId`) REFERENCES `Work`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
