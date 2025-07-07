-- AlterTable
ALTER TABLE `usersession` MODIFY `token` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `SystemLogs` (
    `id` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `level` ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    `source` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `context` JSON NULL,
    `userId` INTEGER NULL,
    `sessionId` VARCHAR(255) NULL,
    `requestId` VARCHAR(64) NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `stackTrace` TEXT NULL,

    INDEX `SystemLogs_timestamp_idx`(`timestamp`),
    INDEX `SystemLogs_level_idx`(`level`),
    INDEX `SystemLogs_source_idx`(`source`),
    INDEX `SystemLogs_userId_idx`(`userId`),
    INDEX `SystemLogs_sessionId_idx`(`sessionId`),
    INDEX `SystemLogs_requestId_idx`(`requestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SystemLogs` ADD CONSTRAINT `SystemLogs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
