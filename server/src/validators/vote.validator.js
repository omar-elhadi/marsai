import { z } from "zod";

export const castVoteSchema = z.object({
  filmId:             z.number().int().positive("filmId requis"),
  sentiment:          z.enum(["LIKE", "DISLIKE"], { message: "Sentiment invalide (LIKE ou DISLIKE)" }),
  rating:             z.number().int().min(0).max(10, "Note entre 0 et 10"),
  suggestModification: z.boolean().optional().default(false),
  comment:            z.string().optional(),
}).refine(
  (data) => !data.suggestModification || (data.comment && data.comment.trim().length > 0),
  { message: "Commentaire obligatoire si suggestModification est true", path: ["comment"] }
);

export const addCommentSchema = z.object({
  comment: z.string().min(1, "Commentaire requis"),
});
