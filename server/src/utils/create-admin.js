// create-admin.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
// Importe ton système de hashage si tu en as un (ex: bcrypt)
// import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: "admin123", // Mets le hash ici si nécessaire
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
