/*
  Warnings:

  - A unique constraint covering the columns `[youtubeVideoId]` on the table `films` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `films_submitterId_fkey` ON `films`;

-- DropIndex
DROP INDEX `votes_userId_fkey` ON `votes`;

-- AlterTable
ALTER TABLE `films` ADD COLUMN `s3VideoKey` VARCHAR(191) NULL,
    ADD COLUMN `s3VideoUrl` VARCHAR(191) NULL,
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
    MODIFY `youtubeUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `lastLogin` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `films_youtubeVideoId_key` ON `films`(`youtubeVideoId`);

-- CreateIndex
CREATE INDEX `films_youtubeStatus_idx` ON `films`(`youtubeStatus`);

-- AddForeignKey
ALTER TABLE `films` ADD CONSTRAINT `films_submitterId_fkey` FOREIGN KEY (`submitterId`) REFERENCES `submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
