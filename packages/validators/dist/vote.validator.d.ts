import { z } from "zod";
export declare const castVoteSchema: z.ZodEffects<
  z.ZodObject<
    {
      filmId: z.ZodNumber;
      sentiment: z.ZodEnum<["LIKE", "DISLIKE"]>;
      rating: z.ZodNumber;
      suggestModification: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
      comment: z.ZodOptional<z.ZodString>;
    },
    "strip",
    z.ZodTypeAny,
    {
      filmId: number;
      sentiment: "LIKE" | "DISLIKE";
      rating: number;
      suggestModification: boolean;
      comment?: string | undefined;
    },
    {
      filmId: number;
      sentiment: "LIKE" | "DISLIKE";
      rating: number;
      suggestModification?: boolean | undefined;
      comment?: string | undefined;
    }
  >,
  {
    filmId: number;
    sentiment: "LIKE" | "DISLIKE";
    rating: number;
    suggestModification: boolean;
    comment?: string | undefined;
  },
  {
    filmId: number;
    sentiment: "LIKE" | "DISLIKE";
    rating: number;
    suggestModification?: boolean | undefined;
    comment?: string | undefined;
  }
>;
export declare const addCommentSchema: z.ZodObject<
  {
    content: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    content: string;
  },
  {
    content: string;
  }
>;
