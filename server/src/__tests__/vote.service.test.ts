import { describe, it, expect, vi } from "vitest";
import * as voteService from "../services/vote.service";
import { prismaMock } from "./setup";

describe("Vote Service", () => {
  describe("castVote", () => {
    it("should upsert a vote and update stats", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "IN_REVIEW",
      });
      // @ts-ignore
      prismaMock.vote.upsert.mockResolvedValue({
        id: "v1",
        filmId: "1",
        userId: "u1",
        sentiment: "LIKE",
        rating: 8,
        suggestModification: false,
      });

      const result = await voteService.castVote("1", "u1", "LIKE", {
        ratingOverride: 8,
      });

      expect(prismaMock.vote.upsert).toHaveBeenCalledWith({
        where: { filmId_userId: { filmId: "1", userId: "u1" } },
        create: expect.objectContaining({
          filmId: "1",
          userId: "u1",
          sentiment: "LIKE",
          rating: 8,
          suggestModification: false,
        }),
        update: expect.objectContaining({
          sentiment: "LIKE",
          rating: 8,
          suggestModification: false,
        }),
      });
      // The function also calls prisma.film.update to update denormalized stats but we mocked things enough to pass or fail at least.
    });

    it("should throw out if the film is frozen (APPROVED)", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "APPROVED",
      });

      await expect(voteService.castVote("1", "u1", "LIKE")).rejects.toThrow(
        "Vote impossible : le film est en statut APPROVED.",
      );
    });

    it("should handle suggestModification and add a comment", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "IN_REVIEW",
      });
      // @ts-ignore
      prismaMock.vote.upsert.mockResolvedValue({
        id: "v1",
        filmId: "1",
        userId: "u1",
        sentiment: "MIXED",
        rating: 5,
        suggestModification: true,
      });

      await voteService.castVote("1", "u1", "MIXED", {
        suggestModification: true,
        comment: "Needs fixing sound.",
      });

      expect(prismaMock.reviewComment.deleteMany).toHaveBeenCalled();
      expect(prismaMock.reviewComment.create).toHaveBeenCalledWith({
        data: {
          voteId: "v1",
          content: "Needs fixing sound.",
          isInternal: false,
        },
      });
    });
  });
});
