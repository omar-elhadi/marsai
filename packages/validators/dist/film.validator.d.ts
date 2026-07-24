import { z } from "zod";
export declare const submitFilmSchema: z.ZodObject<
  {
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    instagram: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    country: z.ZodString;
    language: z.ZodOptional<z.ZodString>;
    aiToolsUsed: z.ZodString;
    youtubeUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    description: string;
    firstName: string;
    lastName: string;
    title: string;
    country: string;
    aiToolsUsed: string;
    bio?: string | undefined;
    instagram?: string | undefined;
    language?: string | undefined;
    youtubeUrl?: string | undefined;
  },
  {
    email: string;
    description: string;
    firstName: string;
    lastName: string;
    title: string;
    country: string;
    aiToolsUsed: string;
    bio?: string | undefined;
    instagram?: string | undefined;
    language?: string | undefined;
    youtubeUrl?: string | undefined;
  }
>;
export declare const updateStatusSchema: z.ZodObject<
  {
    status: z.ZodEnum<
      [
        "SUBMITTED",
        "IN_REVIEW",
        "APPROVED",
        "REJECTED",
        "TO_MODIFY",
        "SELECTION",
        "FINALIST",
        "AWARD",
      ]
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    status:
      | "SUBMITTED"
      | "IN_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "TO_MODIFY"
      | "SELECTION"
      | "FINALIST"
      | "AWARD";
  },
  {
    status:
      | "SUBMITTED"
      | "IN_REVIEW"
      | "APPROVED"
      | "REJECTED"
      | "TO_MODIFY"
      | "SELECTION"
      | "FINALIST"
      | "AWARD";
  }
>;
export declare const assignSchema: z.ZodObject<
  {
    userIds: z.ZodArray<z.ZodNumber, "many">;
  },
  "strip",
  z.ZodTypeAny,
  {
    userIds: number[];
  },
  {
    userIds: number[];
  }
>;
export declare const requestModificationSchema: z.ZodObject<
  {
    message: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    message: string;
  },
  {
    message: string;
  }
>;
export declare const applyEditSchema: z.ZodObject<
  {
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    youtubeUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    aiToolsUsed: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    description?: string | undefined;
    title?: string | undefined;
    aiToolsUsed?: string | undefined;
    youtubeUrl?: string | undefined;
  },
  {
    description?: string | undefined;
    title?: string | undefined;
    aiToolsUsed?: string | undefined;
    youtubeUrl?: string | undefined;
  }
>;
