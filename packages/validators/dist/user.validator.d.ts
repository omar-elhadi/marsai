import { z } from "zod";
export declare const createUserSchema: z.ZodObject<
  {
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["ADMIN", "MODERATOR", "JURY"]>>;
    password: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "MODERATOR" | "JURY";
    password?: string | undefined;
  },
  {
    email: string;
    firstName: string;
    lastName: string;
    password?: string | undefined;
    role?: "ADMIN" | "MODERATOR" | "JURY" | undefined;
  }
>;
export declare const updateUserSchema: z.ZodObject<
  {
    email: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "MODERATOR", "JURY"]>>;
    password: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "ADMIN" | "MODERATOR" | "JURY" | undefined;
  },
  {
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    role?: "ADMIN" | "MODERATOR" | "JURY" | undefined;
  }
>;
