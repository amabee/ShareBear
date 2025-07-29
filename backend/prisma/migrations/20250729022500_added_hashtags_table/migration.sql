-- CreateTable
CREATE TABLE `Hashtag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Hashtag_name_key`(`name`),
    INDEX `Hashtag_name_idx`(`name`),
    INDEX `Hashtag_usageCount_idx`(`usageCount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostHashtag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `hashtagId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PostHashtag_postId_idx`(`postId`),
    INDEX `PostHashtag_hashtagId_idx`(`hashtagId`),
    UNIQUE INDEX `PostHashtag_postId_hashtagId_key`(`postId`, `hashtagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PostHashtag` ADD CONSTRAINT `PostHashtag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostHashtag` ADD CONSTRAINT `PostHashtag_hashtagId_fkey` FOREIGN KEY (`hashtagId`) REFERENCES `Hashtag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
