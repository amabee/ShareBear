/*
  Warnings:

  - You are about to drop the column `bio` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `coverPhotoUrl` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bio`,
    DROP COLUMN `birthDate`,
    DROP COLUMN `coverPhotoUrl`,
    DROP COLUMN `displayName`,
    DROP COLUMN `firstName`,
    DROP COLUMN `gender`,
    DROP COLUMN `lastName`,
    DROP COLUMN `location`,
    DROP COLUMN `profilePictureUrl`;

-- CreateTable
CREATE TABLE `UserInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `displayName` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `profilePictureUrl` VARCHAR(191) NULL,
    `coverPhotoUrl` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED') NULL,
    `location` VARCHAR(191) NULL,

    UNIQUE INDEX `UserInfo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserInfo` ADD CONSTRAINT `UserInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
