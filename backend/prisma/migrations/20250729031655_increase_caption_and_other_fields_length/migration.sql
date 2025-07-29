/*
  Warnings:

  - You are about to alter the column `location` on the `post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `caption` VARCHAR(2000) NULL,
    MODIFY `contentUrl` VARCHAR(500) NULL,
    MODIFY `thumbnailUrl` VARCHAR(500) NULL,
    MODIFY `location` VARCHAR(100) NULL;
