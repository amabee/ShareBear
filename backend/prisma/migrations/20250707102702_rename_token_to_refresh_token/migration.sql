/*
  Warnings:

  - You are about to drop the column `token` on the `usersession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserSession_token_key` ON `usersession`;

-- AlterTable
ALTER TABLE `usersession` DROP COLUMN `token`,
    ADD COLUMN `refreshToken` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserSession_refreshToken_key` ON `UserSession`(`refreshToken`);
