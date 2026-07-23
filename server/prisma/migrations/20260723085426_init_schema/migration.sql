-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'JURY');

-- CreateEnum
CREATE TYPE "FilmStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY', 'SELECTION', 'FINALIST', 'AWARD');

-- CreateEnum
CREATE TYPE "VoteSentiment" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "YoutubeStatus" AS ENUM ('PENDING', 'UPLOADING', 'PROCESSING', 'APPROVED', 'REJECTED', 'EXPLICIT_CONTENT', 'VIOLENCE', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'JURY',
    "loginToken" TEXT,
    "tokenExpires" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submitters" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "loginToken" TEXT,
    "tokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "submitters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "films" (
    "id" SERIAL NOT NULL,
    "submitterId" INTEGER NOT NULL,
    "submissionToken" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT,
    "posterUrl" TEXT,
    "subtitleUrl" TEXT,
    "aiToolsUsed" TEXT NOT NULL,
    "aiMethodologyUrl" TEXT,
    "youtubeUrl" TEXT,
    "youtubeVideoId" TEXT,
    "youtubeStatus" "YoutubeStatus",
    "youtubeUploadedAt" TIMESTAMP(3),
    "s3VideoKey" TEXT,
    "videoDuration" DOUBLE PRECISION,
    "videoFormat" TEXT,
    "videoSize" INTEGER,
    "videoWidth" INTEGER,
    "videoHeight" INTEGER,
    "videoCodec" TEXT,
    "status" "FilmStatus" NOT NULL DEFAULT 'SUBMITTED',
    "avgRating" DOUBLE PRECISION,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalDislikes" INTEGER NOT NULL DEFAULT 0,
    "modificationRequest" TEXT,
    "modificationRequestedAt" TIMESTAMP(3),
    "modificationRequestedBy" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" INTEGER,
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "films_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film_versions" (
    "id" SERIAL NOT NULL,
    "filmId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aiToolsUsed" TEXT NOT NULL,
    "posterUrl" TEXT,
    "youtubeUrl" TEXT,
    "s3VideoKey" TEXT,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "film_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" SERIAL NOT NULL,
    "filmId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sentiment" "VoteSentiment" NOT NULL,
    "rating" INTEGER NOT NULL,
    "suggestModification" BOOLEAN NOT NULL DEFAULT false,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_comments" (
    "id" SERIAL NOT NULL,
    "voteId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_categories" (
    "id" SERIAL NOT NULL,
    "edition" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "award_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film_nominations" (
    "id" SERIAL NOT NULL,
    "filmId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "film_nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jury_members" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "website" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,

    CONSTRAINT "jury_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "currentYear" INTEGER NOT NULL DEFAULT 2026,
    "festivalTheme" TEXT,
    "festivalDates" TEXT,
    "trailerUrl" TEXT,
    "heroImageUrl" TEXT,
    "aboutText" TEXT,
    "rulesText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "unsubscribeToken" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "film_status_history" (
    "id" SERIAL NOT NULL,
    "filmId" INTEGER NOT NULL,
    "fromStatus" "FilmStatus" NOT NULL,
    "toStatus" "FilmStatus" NOT NULL,
    "changedBy" INTEGER,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,

    CONSTRAINT "film_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FilmAssignments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FilmAssignments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_loginToken_key" ON "users"("loginToken");

-- CreateIndex
CREATE UNIQUE INDEX "submitters_email_key" ON "submitters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "submitters_loginToken_key" ON "submitters"("loginToken");

-- CreateIndex
CREATE UNIQUE INDEX "films_submissionToken_key" ON "films"("submissionToken");

-- CreateIndex
CREATE INDEX "films_status_idx" ON "films"("status");

-- CreateIndex
CREATE INDEX "films_country_idx" ON "films"("country");

-- CreateIndex
CREATE INDEX "films_avgRating_idx" ON "films"("avgRating");

-- CreateIndex
CREATE INDEX "films_youtubeStatus_idx" ON "films"("youtubeStatus");

-- CreateIndex
CREATE INDEX "film_versions_filmId_idx" ON "film_versions"("filmId");

-- CreateIndex
CREATE INDEX "votes_filmId_idx" ON "votes"("filmId");

-- CreateIndex
CREATE INDEX "votes_userId_idx" ON "votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_filmId_userId_key" ON "votes"("filmId", "userId");

-- CreateIndex
CREATE INDEX "review_comments_voteId_idx" ON "review_comments"("voteId");

-- CreateIndex
CREATE INDEX "award_categories_edition_idx" ON "award_categories"("edition");

-- CreateIndex
CREATE INDEX "film_nominations_filmId_idx" ON "film_nominations"("filmId");

-- CreateIndex
CREATE INDEX "film_nominations_categoryId_idx" ON "film_nominations"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "film_nominations_filmId_categoryId_key" ON "film_nominations"("filmId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_unsubscribeToken_key" ON "newsletter_subscribers"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "film_status_history_filmId_idx" ON "film_status_history"("filmId");

-- CreateIndex
CREATE INDEX "film_status_history_changedBy_idx" ON "film_status_history"("changedBy");

-- CreateIndex
CREATE INDEX "_FilmAssignments_B_index" ON "_FilmAssignments"("B");

-- AddForeignKey
ALTER TABLE "films" ADD CONSTRAINT "films_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "submitters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "film_versions" ADD CONSTRAINT "film_versions_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "film_nominations" ADD CONSTRAINT "film_nominations_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "film_nominations" ADD CONSTRAINT "film_nominations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "award_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "film_status_history" ADD CONSTRAINT "film_status_history_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "film_status_history" ADD CONSTRAINT "film_status_history_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmAssignments" ADD CONSTRAINT "_FilmAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "films"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmAssignments" ADD CONSTRAINT "_FilmAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
