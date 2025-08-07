-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('LIKE', 'COMMENT', 'FOLLOW', 'SHARE', 'MENTION', 'STORY_VIEW', 'MESSAGE', 'SYSTEM') NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'ARCHIVED', 'DISMISSED') NOT NULL DEFAULT 'UNREAD',
    `title` VARCHAR(100) NULL,
    `content` VARCHAR(500) NOT NULL,
    `recipientId` INTEGER NOT NULL,
    `senderId` INTEGER NULL,
    `postId` VARCHAR(32) NULL,
    `commentId` INTEGER NULL,
    `conversationId` INTEGER NULL,
    `messageId` INTEGER NULL,
    `followId` INTEGER NULL,
    `storyId` INTEGER NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readAt` DATETIME(3) NULL,
    `archivedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NULL,

    INDEX `Notification_recipientId_status_createdAt_idx`(`recipientId`, `status`, `createdAt` DESC),
    INDEX `Notification_recipientId_type_status_idx`(`recipientId`, `type`, `status`),
    INDEX `Notification_recipientId_status_idx`(`recipientId`, `status`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    INDEX `Notification_expiresAt_idx`(`expiresAt`),
    INDEX `Notification_senderId_idx`(`senderId`),
    INDEX `Notification_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationPreference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `emailOnLike` BOOLEAN NOT NULL DEFAULT false,
    `emailOnComment` BOOLEAN NOT NULL DEFAULT true,
    `emailOnFollow` BOOLEAN NOT NULL DEFAULT true,
    `emailOnMessage` BOOLEAN NOT NULL DEFAULT true,
    `emailOnMention` BOOLEAN NOT NULL DEFAULT true,
    `emailDigest` BOOLEAN NOT NULL DEFAULT true,
    `pushOnLike` BOOLEAN NOT NULL DEFAULT true,
    `pushOnComment` BOOLEAN NOT NULL DEFAULT true,
    `pushOnFollow` BOOLEAN NOT NULL DEFAULT true,
    `pushOnMessage` BOOLEAN NOT NULL DEFAULT true,
    `pushOnMention` BOOLEAN NOT NULL DEFAULT true,
    `pushOnStoryView` BOOLEAN NOT NULL DEFAULT false,
    `inAppOnLike` BOOLEAN NOT NULL DEFAULT true,
    `inAppOnComment` BOOLEAN NOT NULL DEFAULT true,
    `inAppOnFollow` BOOLEAN NOT NULL DEFAULT true,
    `inAppOnMessage` BOOLEAN NOT NULL DEFAULT true,
    `inAppOnMention` BOOLEAN NOT NULL DEFAULT true,
    `inAppOnShare` BOOLEAN NOT NULL DEFAULT true,
    `quietHoursEnabled` BOOLEAN NOT NULL DEFAULT false,
    `quietHoursStart` VARCHAR(191) NULL,
    `quietHoursEnd` VARCHAR(191) NULL,
    `timezone` VARCHAR(191) NULL DEFAULT 'UTC',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NotificationPreference_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('LIKE', 'COMMENT', 'FOLLOW', 'SHARE', 'MENTION', 'STORY_VIEW', 'MESSAGE', 'SYSTEM') NOT NULL,
    `senderId` INTEGER NULL,
    `title` VARCHAR(100) NULL,
    `content` VARCHAR(500) NOT NULL,
    `metadata` JSON NULL,
    `postId` VARCHAR(32) NULL,
    `commentId` INTEGER NULL,
    `storyId` INTEGER NULL,
    `recipientCount` INTEGER NOT NULL DEFAULT 0,
    `sentCount` INTEGER NOT NULL DEFAULT 0,
    `failedCount` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `NotificationBatch_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `NotificationBatch_type_createdAt_idx`(`type`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_followId_fkey` FOREIGN KEY (`followId`) REFERENCES `Follow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationPreference` ADD CONSTRAINT `NotificationPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationBatch` ADD CONSTRAINT `NotificationBatch_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationBatch` ADD CONSTRAINT `NotificationBatch_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationBatch` ADD CONSTRAINT `NotificationBatch_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationBatch` ADD CONSTRAINT `NotificationBatch_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `Story`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
