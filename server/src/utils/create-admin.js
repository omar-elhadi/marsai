import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@marsai.local";
  const password = "admin123"; // <--- Mot de passe demandé

  console.log(`🔨 Configuration du compte ${email}...`);

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert = Créer si n'existe pas, ou Mettre à jour si existe déjà
  await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword, // On force le nouveau mot de passe
      role: "ADMIN",
    },
    create: {
      email: email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Super Admin",
    },
  });

  console.log("✅ SUCCÈS ! Compte configuré.");
  console.log(`👉 Email : ${email}`);
  console.log(`👉 Pass  : ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
