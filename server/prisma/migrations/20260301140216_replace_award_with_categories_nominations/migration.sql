/*
  Warnings:

  - You are about to drop the `awards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `awards` DROP FOREIGN KEY `awards_filmId_fkey`;

-- DropTable
DROP TABLE `awards`;

-- CreateTable
CREATE TABLE `award_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `edition` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `award_categories_edition_idx`(`edition`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `film_nominations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filmId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `isWinner` BOOLEAN NOT NULL DEFAULT false,

    INDEX `film_nominations_filmId_idx`(`filmId`),
    INDEX `film_nominations_categoryId_idx`(`categoryId`),
    UNIQUE INDEX `film_nominations_filmId_categoryId_key`(`filmId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `film_nominations` ADD CONSTRAINT `film_nominations_filmId_fkey` FOREIGN KEY (`filmId`) REFERENCES `films`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `film_nominations` ADD CONSTRAINT `film_nominations_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `award_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
