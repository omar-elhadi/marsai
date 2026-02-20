import { PrismaClient } from "@prisma/client";

// On crée une instance unique (singleton) pour toute l'application
const prisma = new PrismaClient();

export default prisma;
