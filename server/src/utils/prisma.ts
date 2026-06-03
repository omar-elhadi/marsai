import { PrismaClient } from "@prisma/client";

type QueryParams = {
  model: string;
  operation: string;
  args: any;
  query: (args: any) => any;
};

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      $allModels: {
        async findMany({ model, operation, args, query }: QueryParams) {
          if (["User", "Submitter", "Film"].includes(model)) {
            args.where = { deletedAt: null, ...args.where } as any;
          }
          return query(args);
        },
        async findFirst({ model, operation, args, query }: QueryParams) {
          if (["User", "Submitter", "Film"].includes(model)) {
            args.where = { deletedAt: null, ...args.where } as any;
          }
          return query(args);
        },
        async count({ model, operation, args, query }: QueryParams) {
          if (["User", "Submitter", "Film"].includes(model)) {
            args.where = { deletedAt: null, ...args.where } as any;
          }
          return query(args);
        },
      },
    },
  });
};

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton>;
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
