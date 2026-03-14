-- AlterTable
ALTER TABLE `films` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` INTEGER NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedBy` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `film_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filmId` INTEGER NOT NULL,
    `fromStatus` ENUM('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY', 'SELECTION', 'FINALIST', 'AWARD') NOT NULL,
    `toStatus` ENUM('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY', 'SELECTION', 'FINALIST', 'AWARD') NOT NULL,
    `changedBy` INTEGER NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comment` TEXT NULL,

    INDEX `film_status_history_filmId_idx`(`filmId`),
    INDEX `film_status_history_changedBy_idx`(`changedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `film_status_history` ADD CONSTRAINT `film_status_history_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_status_history` ADD CONSTRAINT `film_status_history_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
