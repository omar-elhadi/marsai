-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'MODERATOR', 'JURY') NOT NULL DEFAULT 'JURY',
    `loginToken` VARCHAR(191) NULL,
    `tokenExpires` DATETIME(3) NULL,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_loginToken_key`(`loginToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submitters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `website` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `loginToken` VARCHAR(191) NULL,
    `tokenExpires` DATETIME(3) NULL,

    UNIQUE INDEX `submitters_email_key`(`email`),
    UNIQUE INDEX `submitters_loginToken_key`(`loginToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `films` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submitterId` INTEGER NOT NULL,
    `submissionToken` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NULL,
    `posterUrl` VARCHAR(191) NULL,
    `subtitleUrl` VARCHAR(191) NULL,
    `aiToolsUsed` TEXT NOT NULL,
    `aiMethodologyUrl` TEXT NULL,
    `youtubeUrl` VARCHAR(191) NULL,
    `youtubeVideoId` VARCHAR(191) NULL,
    `youtubeStatus` ENUM('PENDING', 'UPLOADING', 'PROCESSING', 'APPROVED', 'REJECTED', 'EXPLICIT_CONTENT', 'VIOLENCE', 'FAILED') NULL,
    `youtubeUploadedAt` DATETIME(3) NULL,
    `s3VideoKey` VARCHAR(191) NULL,
    `videoDuration` DOUBLE NULL,
    `videoFormat` VARCHAR(191) NULL,
    `videoSize` INTEGER NULL,
    `videoWidth` INTEGER NULL,
    `videoHeight` INTEGER NULL,
    `videoCodec` VARCHAR(191) NULL,
    `status` ENUM('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY', 'SELECTION', 'FINALIST', 'AWARD') NOT NULL DEFAULT 'SUBMITTED',
    `avgRating` DOUBLE NULL,
    `totalVotes` INTEGER NOT NULL DEFAULT 0,
    `totalLikes` INTEGER NOT NULL DEFAULT 0,
    `totalDislikes` INTEGER NOT NULL DEFAULT 0,
    `modificationRequest` TEXT NULL,
    `modificationRequestedAt` DATETIME(3) NULL,
    `modificationRequestedBy` INTEGER NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `films_submissionToken_key`(`submissionToken`),
    INDEX `films_status_idx`(`status`),
    INDEX `films_country_idx`(`country`),
    INDEX `films_avgRating_idx`(`avgRating`),
    INDEX `films_youtubeStatus_idx`(`youtubeStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `film_versions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filmId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `aiToolsUsed` TEXT NOT NULL,
    `posterUrl` VARCHAR(191) NULL,
    `youtubeUrl` VARCHAR(191) NULL,
    `s3VideoKey` VARCHAR(191) NULL,
    `archivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `film_versions_filmId_idx`(`filmId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filmId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `sentiment` ENUM('LIKE', 'DISLIKE') NOT NULL,
    `rating` INTEGER NOT NULL,
    `suggestModification` BOOLEAN NOT NULL DEFAULT false,
    `votedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `votes_filmId_idx`(`filmId`),
    INDEX `votes_userId_idx`(`userId`),
    UNIQUE INDEX `votes_filmId_userId_key`(`filmId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voteId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `isInternal` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_comments_voteId_idx`(`voteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `awards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `filmId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jury_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `bio` TEXT NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `website` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currentYear` INTEGER NOT NULL DEFAULT 2026,
    `festivalTheme` VARCHAR(191) NULL,
    `festivalDates` VARCHAR(191) NULL,
    `trailerUrl` VARCHAR(191) NULL,
    `heroImageUrl` VARCHAR(191) NULL,
    `aboutText` TEXT NULL,
    `rulesText` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `newsletter_subscribers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `unsubscribeToken` VARCHAR(191) NOT NULL,
    `subscribedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `newsletter_subscribers_email_key`(`email`),
    UNIQUE INDEX `newsletter_subscribers_unsubscribeToken_key`(`unsubscribeToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FilmAssignments` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FilmAssignments_AB_unique`(`A`, `B`),
    INDEX `_FilmAssignments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `films` ADD CONSTRAINT `films_submitterId_fkey` FOREIGN KEY (`submitterId`) REFERENCES `submitters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_versions` ADD CONSTRAINT `film_versions_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_comments` ADD CONSTRAINT `review_comments_voteId_fkey` FOREIGN KEY (`voteId`) REFERENCES `votes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `awards` ADD CONSTRAINT `awards_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FilmAssignments` ADD CONSTRAINT `_FilmAssignments_A_fkey` FOREIGN KEY (`A`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FilmAssignments` ADD CONSTRAINT `_FilmAssignments_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
