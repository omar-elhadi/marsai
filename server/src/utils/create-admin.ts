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
  console.log("✅ Admin créé avec succès:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
