import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Démarrage du Seed ---");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // On nettoie la base pour être sûr de ce qu'on fait
  await prisma.user.deleteMany({});
  console.log("Base nettoyée.");

  const admin = await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: hashedPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Admin créé :", admin.email);

  const jury = await prisma.user.create({
    data: {
      email: "sophie@marsai.local",
      password: hashedPassword,
      firstName: "Sophie",
      lastName: "Lumiere",
      role: "JURY",
    },
  });
  console.log("Jury créé :", jury.email);
}

main()
  .catch((e) => {
    console.error("❌ ERREUR DURANT LE SEED :");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("--- Seed Terminé ---");
  });
