import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🎬 [SEED] Début du peuplement de la base...");

  // 1. Nettoyage (Optionnel, à utiliser avec prudence)
  await prisma.user.deleteMany({});

  // 2. Création de l'Administrateur
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@marsai.local",
      password: adminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin créé (admin@marsai.local / admin123)");

  // 3. Création des Jurys (Sans mot de passe pour Magic Link)
  const jurys = [
    { email: "agnes.v@festival.fr", firstName: "Agnès", lastName: "Varda" },
    {
      email: "francois.t@cinema.com",
      firstName: "François",
      lastName: "Truffaut",
    },
    { email: "alice.g@pionniere.org", firstName: "Alice", lastName: "Guy" },
  ];

  for (const jury of jurys) {
    await prisma.user.create({
      data: {
        ...jury,
        role: "JURY",
        // password reste null par défaut
      },
    });
  }
  console.log(`✅ ${jurys.length} Jurys créés sans mot de passe.`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
