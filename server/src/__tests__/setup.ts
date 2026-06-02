import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";
import prisma from "../utils/prisma.js";
import { beforeEach, vi } from "vitest";

process.env.JWT_SECRET = "test-secret-key-for-testing-purposes-only";

vi.mock("../utils/prisma.js", () => ({
  default: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
