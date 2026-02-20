/*
  Warnings:

  - You are about to drop the column `aiToolsUsed` on the `films` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[youtubeVideoId]` on the table `films` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loginToken]` on the table `submitters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aiStack` to the `films` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `votes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `films` DROP COLUMN `aiToolsUsed`,
    ADD COLUMN `aiMethodologyUrl` TEXT NULL,
    ADD COLUMN `aiStack` TEXT NOT NULL,
    ADD COLUMN `language` VARCHAR(191) NULL,
    ADD COLUMN `posterUrl` TEXT NULL,
    ADD COLUMN `s3VideoKey` VARCHAR(191) NULL,
    ADD COLUMN `s3VideoUrl` VARCHAR(191) NULL,
    ADD COLUMN `subtitleUrl` TEXT NULL,
    ADD COLUMN `videoCodec` VARCHAR(191) NULL,
    ADD COLUMN `videoDuration` DOUBLE NULL,
    ADD COLUMN `videoFormat` VARCHAR(191) NULL,
    ADD COLUMN `videoHeight` INTEGER NULL,
    ADD COLUMN `videoSize` INTEGER NULL,
    ADD COLUMN `videoWidth` INTEGER NULL,
    ADD COLUMN `youtubeModerationData` JSON NULL,
    ADD COLUMN `youtubeStatus` ENUM('PENDING', 'UPLOADING', 'PROCESSING', 'APPROVED', 'REJECTED', 'EXPLICIT_CONTENT', 'VIOLENCE', 'FAILED') NULL DEFAULT 'PENDING',
    ADD COLUMN `youtubeUploadedAt` DATETIME(3) NULL,
    ADD COLUMN `youtubeVideoId` VARCHAR(191) NULL,
    MODIFY `youtubeUrl` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'SELECTION', 'FINALIST', 'REJECTED', 'TO_MODIFY') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `submitters` ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `loginToken` VARCHAR(191) NULL,
    ADD COLUMN `tokenExpires` DATETIME(3) NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `lastLogin` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `votes` MODIFY `rating` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `awards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `filmId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `films_youtubeVideoId_key` ON `films`(`youtubeVideoId`);

-- CreateIndex
CREATE INDEX `films_youtubeStatus_idx` ON `films`(`youtubeStatus`);

-- CreateIndex
CREATE UNIQUE INDEX `submitters_loginToken_key` ON `submitters`(`loginToken`);

-- AddForeignKey
ALTER TABLE `awards` ADD CONSTRAINT `awards_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
