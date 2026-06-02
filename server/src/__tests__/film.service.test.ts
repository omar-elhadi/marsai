import { describe, it, expect } from "vitest";
import * as filmService from "../services/film.service";
import { prismaMock } from "./setup";

describe("Film Service", () => {
  describe("changeFilmStatus", () => {
    it("should successfully change status when transition is valid (SUBMITTED -> IN_REVIEW)", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "SUBMITTED",
      });
      // @ts-ignore
      prismaMock.film.update.mockResolvedValue({
        id: "1",
        status: "IN_REVIEW",
      });

      const result = await filmService.changeFilmStatus(
        "1",
        "IN_REVIEW",
        "MODERATOR",
      );
      expect(result.status).toBe("IN_REVIEW");
      expect(prismaMock.film.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { status: "IN_REVIEW" },
      });
    });

    it("should throw an error if transition is invalid (SUBMITTED -> SELECTION)", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "SUBMITTED",
      });

      await expect(
        filmService.changeFilmStatus("1", "SELECTION", "ADMIN"),
      ).rejects.toThrow("Transition invalide : SUBMITTED → SELECTION");
    });

    it("should block non-admin from changing status to SELECTION", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "APPROVED",
      });

      await expect(
        filmService.changeFilmStatus("1", "SELECTION", "MODERATOR"),
      ).rejects.toThrow(
        "La transition vers SELECTION est réservée aux administrateurs.",
      );
    });

    it("should allow admin to change status to SELECTION from APPROVED", async () => {
      // @ts-ignore
      prismaMock.film.findUnique.mockResolvedValue({
        id: "1",
        status: "APPROVED",
      });
      // @ts-ignore
      prismaMock.film.update.mockResolvedValue({
        id: "1",
        status: "SELECTION",
      });

      const result = await filmService.changeFilmStatus(
        "1",
        "SELECTION",
        "ADMIN",
      );
      expect(result.status).toBe("SELECTION");
    });

    it("should throw 404 if film is not found", async () => {
      prismaMock.film.findUnique.mockResolvedValue(null);

      await expect(
        filmService.changeFilmStatus("bad_id", "IN_REVIEW", "ADMIN"),
      ).rejects.toThrow("Film introuvable");
    });
  });
});
