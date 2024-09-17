/*
  Warnings:

  - The values [profesor] on the enum `Users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'admin', 'professor', 'service') NOT NULL DEFAULT 'user';
