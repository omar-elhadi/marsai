import { logger } from "../utils/logger.js";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).optional().default("5000"),
  JWT_SECRET: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

export const validateEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    logger.error(
      "❌ ERREUR DE CONFIGURATION : Variables d'environnement manquantes ou invalides",
    );
    logger.error(result.error.issues);
    process.exit(1); // Arrête le processus
  }
};
