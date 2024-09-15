-- AlterTable
ALTER TABLE `sessions` MODIFY `refreshToken` LONGTEXT NOT NULL,
    MODIFY `device` LONGTEXT NULL;
