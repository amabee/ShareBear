/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `like` DROP FOREIGN KEY `Like_postId_fkey`;

-- DropForeignKey
ALTER TABLE `posthashtag` DROP FOREIGN KEY `PostHashtag_postId_fkey`;

-- DropForeignKey
ALTER TABLE `postimage` DROP FOREIGN KEY `PostImage_postId_fkey`;

-- DropForeignKey
ALTER TABLE `share` DROP FOREIGN KEY `Share_postId_fkey`;

-- DropIndex
DROP INDEX `Comment_postId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Like_postId_fkey` ON `like`;

-- DropIndex
DROP INDEX `Share_postId_fkey` ON `share`;

-- AlterTable
ALTER TABLE `comment` MODIFY `postId` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `like` MODIFY `postId` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(32) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `posthashtag` MODIFY `postId` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `postimage` MODIFY `postId` VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE `share` MODIFY `postId` VARCHAR(32) NOT NULL;

-- AddForeignKey
ALTER TABLE `PostImage` ADD CONSTRAINT `PostImage_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Share` ADD CONSTRAINT `Share_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostHashtag` ADD CONSTRAINT `PostHashtag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
