import { logger } from "../utils/logger.js";
// create-admin.js
import { PrismaClient } from "@prisma/client";
// Importe ton système de hashage si tu en as un (ex: argon2)
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await argon2.hash('admin123');

  const admin = await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "ADMIN",
    },
  });
  logger.info(admin, "✅ Admin créé avec succès:");
}

main()
  .catch((e) => logger.error(e))
  .finally(async () => await prisma.$disconnect());
