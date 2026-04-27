import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../index";
import * as voteService from "../../services/vote.service";
import jwt from "jsonwebtoken";

vi.mock("../../services/vote.service");

describe("Vote Routes - Integration", () => {
  describe("POST /api/jury/votes", () => {
    it("should return 403 if no token provided", async () => {
      const res = await request(app)
        .post("/api/jury/votes")
        .send({ filmId: 1, sentiment: "LIKE", rating: 8 });
      expect(res.status).toBe(403);
    });

    it("should return 200/201 on valid vote cast", async () => {
      const token = jwt.sign(
        { id: "u1", role: "JURY" },
        process.env.JWT_SECRET || "secret",
      );
      vi.mocked(voteService.castVote).mockResolvedValue({ id: "v1" } as any);

      const res = await request(app)
        .post("/api/jury/votes")
        .set("Cookie", [`marsai_token=${token}`])
        .send({ filmId: 1, sentiment: "LIKE", rating: 8 });

      // Usually it returns 201 or 200, we'll check it's successful
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(300);
    });
  });
});
