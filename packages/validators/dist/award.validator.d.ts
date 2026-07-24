import { z } from "zod";
export declare const categorySchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    edition: z.ZodString;
    displayOrder: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: string;
    edition: string;
    displayOrder: number;
    description?: string | undefined;
  },
  {
    name: string;
    edition: string;
    description?: string | undefined;
    displayOrder?: number | undefined;
  }
>;
export declare const nominationSchema: z.ZodObject<
  {
    filmId: z.ZodNumber;
    categoryId: z.ZodNumber;
  },
  "strip",
  z.ZodTypeAny,
  {
    filmId: number;
    categoryId: number;
  },
  {
    filmId: number;
    categoryId: number;
  }
>;
