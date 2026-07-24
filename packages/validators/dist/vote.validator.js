"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommentSchema = exports.castVoteSchema = void 0;
const zod_1 = require("zod");
exports.castVoteSchema = zod_1.z
  .object({
    filmId: zod_1.z.number().int().positive("filmId requis"),
    sentiment: zod_1.z.enum(["LIKE", "DISLIKE"], {
      message: "Sentiment invalide (LIKE ou DISLIKE)",
    }),
    rating: zod_1.z.number().int().min(0).max(10, "Note entre 0 et 10"),
    suggestModification: zod_1.z.boolean().optional().default(false),
    comment: zod_1.z.string().optional(),
  })
  .refine(
    (data) =>
      !data.suggestModification ||
      (data.comment && data.comment.trim().length > 0),
    {
      message: "Commentaire obligatoire si suggestModification est true",
      path: ["comment"],
    },
  );
exports.addCommentSchema = zod_1.z.object({
  content: zod_1.z.string().min(1, "Commentaire requis"),
});
