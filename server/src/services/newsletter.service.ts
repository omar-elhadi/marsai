import prisma from "../utils/prisma.js";

export const subscribe = async (email: string) => {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    return existing;
  }

  return prisma.newsletterSubscriber.create({ data: { email } });
};

export const unsubscribe = async (token: string) => {
  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: token },
  });

  if (!subscriber) {
    throw Object.assign(new Error("Lien invalide ou déjà désabonné"), {
      statusCode: 404,
    });
  }

  await prisma.newsletterSubscriber.delete({
    where: { id: subscriber.id },
  });

  return { success: true };
};
