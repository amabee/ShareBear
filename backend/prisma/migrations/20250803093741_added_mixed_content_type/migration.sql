-- AlterTable
ALTER TABLE `post` MODIFY `contentType` ENUM('TEXT', 'IMAGE', 'VIDEO', 'MIXED') NOT NULL;
