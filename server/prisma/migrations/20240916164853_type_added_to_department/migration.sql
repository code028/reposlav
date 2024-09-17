-- AlterTable
ALTER TABLE `department` ADD COLUMN `type` ENUM('osnovne', 'master') NOT NULL DEFAULT 'osnovne';
