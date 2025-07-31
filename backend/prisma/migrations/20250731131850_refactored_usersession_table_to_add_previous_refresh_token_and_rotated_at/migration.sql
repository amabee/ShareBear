-- AlterTable
ALTER TABLE `usersession` ADD COLUMN `previousRefreshToken` VARCHAR(255) NULL,
    ADD COLUMN `rotatedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `UserSession_previousRefreshToken_idx` ON `UserSession`(`previousRefreshToken`);
