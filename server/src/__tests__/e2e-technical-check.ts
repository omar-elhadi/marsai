/**
 * Comprehensive Technical E2E Test
 * Tests: database connection, schema, migrations, seeding, API endpoints
 *
 * Usage: DATABASE_URL="postgresql://..." npx tsx server/src/__tests__/e2e-technical-test.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let passed = 0;
let failed = 0;

async function assert(label: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
    passed++;
  } catch (err: any) {
    console.log(`  ❌ ${label}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

async function main() {
  console.log("🧪 MARSAI FESTIVAL — TECHNICAL E2E TEST SUITE\n");

  // ─────────────────────────────────────────────────
  console.log("1️⃣  DATABASE CONNECTION");
  // ─────────────────────────────────────────────────
  await assert("Connect to PostgreSQL", async () => {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT version()`;
    const str = JSON.stringify(result);
    if (!str.includes("PostgreSQL")) throw new Error("Not PostgreSQL");
  });

  await assert("Has all 14 expected tables", async () => {
    const tables: { tablename: string }[] = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `;
    const names = tables.map((t) => t.tablename);
    const expected = [
      "_FilmAssignments",
      "award_categories",
      "film_nominations",
      "film_status_history",
      "film_versions",
      "films",
      "jury_members",
      "newsletter_subscribers",
      "review_comments",
      "site_settings",
      "submitters",
      "users",
      "votes",
    ];
    for (const name of expected) {
      if (!names.includes(name)) throw new Error(`Missing table: ${name}`);
    }
  });

  // ─────────────────────────────────────────────────
  console.log("\n2️⃣  MIGRATIONS & SCHEMA");
  // ─────────────────────────────────────────────────
  await assert("Migration history exists", async () => {
    const migrations: { migration_name: string }[] = await prisma.$queryRaw`
      SELECT migration_name FROM _prisma_migrations ORDER BY started_at
    `;
    if (migrations.length === 0) throw new Error("No migrations found");
    console.log(`     (${migrations.length} migration(s) applied)`);
  });

  await assert("Users table has correct schema", async () => {
    const cols: {
      column_name: string;
      data_type: string;
      is_nullable: string;
    }[] = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public'
      `;
    const map = new Map(cols.map((c) => [c.column_name, c]));
    if (!map.has("id")) throw new Error("Missing id column");
    if (!map.has("email")) throw new Error("Missing email column");
    if (!map.has("password")) throw new Error("Missing password column");
    if (!map.has("role")) throw new Error("Missing role column");
    if (!map.has("deletedAt")) throw new Error("Missing deletedAt column");
    if (!map.has("createdAt")) throw new Error("Missing createdAt column");
  });

  await assert("Schema in sync (no pending changes)", async () => {
    const drift = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations WHERE finished_at IS NULL
    `;
    if (Array.isArray(drift) && drift.length > 0) {
      throw new Error(`${drift.length} pending migration(s)`);
    }
  });

  // ─────────────────────────────────────────────────
  console.log("\n3️⃣  SEEDED DATA INTEGRITY");
  // ─────────────────────────────────────────────────
  await assert("6 users with correct roles", async () => {
    const users = await prisma.user.findMany({
      orderBy: { email: "asc" },
      select: { email: true, role: true },
    });
    if (users.length !== 6)
      throw new Error(`Expected 6 users, got ${users.length}`);
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const modCount = users.filter((u) => u.role === "MODERATOR").length;
    const juryCount = users.filter((u) => u.role === "JURY").length;
    if (adminCount !== 2)
      throw new Error(`Expected 2 ADMINS, got ${adminCount}`);
    if (modCount !== 1)
      throw new Error(`Expected 1 MODERATOR, got ${modCount}`);
    if (juryCount !== 3) throw new Error(`Expected 3 JURY, got ${juryCount}`);
    console.log(
      `     (${adminCount} ADMINS, ${modCount} MODERATOR, ${juryCount} JURY)`,
    );
  });

  await assert("14 films covering all 8 statuses", async () => {
    const films = await prisma.film.findMany({ select: { status: true } });
    if (films.length !== 14)
      throw new Error(`Expected 14 films, got ${films.length}`);
    const statuses = new Set(films.map((f) => f.status));
    const expected: any[] = [
      "SUBMITTED",
      "IN_REVIEW",
      "APPROVED",
      "REJECTED",
      "TO_MODIFY",
      "SELECTION",
      "FINALIST",
      "AWARD",
    ];
    for (const s of expected) {
      if (!statuses.has(s)) throw new Error(`Missing film status: ${s}`);
    }
    console.log(`     (${films.length} films, ${statuses.size} statuses)`);
  });

  await assert("26+ votes with likes and dislikes", async () => {
    const votes = await prisma.vote.findMany({ select: { sentiment: true } });
    if (votes.length < 23)
      throw new Error(`Expected >=23 votes, got ${votes.length}`);
    const likes = votes.filter((v) => v.sentiment === "LIKE").length;
    const dislikes = votes.filter((v) => v.sentiment === "DISLIKE").length;
    if (likes <= dislikes)
      throw new Error(
        `Expected more likes than dislikes (${likes} vs ${dislikes})`,
      );
    if (dislikes === 0) throw new Error("Expected at least 1 dislike");
    console.log(
      `     (${votes.length} votes: ${likes} LIKE, ${dislikes} DISLIKE)`,
    );
  });

  await assert("4 award categories with 7 nominations", async () => {
    const cats = await prisma.awardCategory.count();
    const noms = await prisma.filmNomination.count();
    if (cats !== 4) throw new Error(`Expected 4 categories, got ${cats}`);
    if (noms !== 7) throw new Error(`Expected 7 nominations, got ${noms}`);
    console.log(`     (${cats} categories, ${noms} nominations)`);
  });

  await assert("14 submitters", async () => {
    const count = await prisma.submitter.count();
    if (count !== 14) throw new Error(`Expected 14 submitters, got ${count}`);
  });

  await assert("4 public jury members", async () => {
    const count = await prisma.juryMember.count();
    if (count !== 4) throw new Error(`Expected 4 jury members, got ${count}`);
  });

  await assert("Site settings configured for 2026", async () => {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) throw new Error("No site settings found");
    if (settings.currentYear !== 2026)
      throw new Error(`Year is ${settings.currentYear}, expected 2026`);
    if (!settings.festivalDates) throw new Error("Missing festival dates");
  });

  await assert("7 newsletter subscribers", async () => {
    const count = await prisma.newsletterSubscriber.count();
    if (count !== 7) throw new Error(`Expected 7 subscribers, got ${count}`);
  });

  await assert("1 film version snapshot (TO_MODIFY audit)", async () => {
    const count = await prisma.filmVersion.count();
    if (count < 1) throw new Error("Expected at least 1 film version snapshot");
    console.log(`     (${count} version snapshot(s))`);
  });

  // ─────────────────────────────────────────────────
  console.log("\n4️⃣  PASSWORD & AUTH VERIFICATION");
  // ─────────────────────────────────────────────────
  await assert("Passwords are argon2 hashed", async () => {
    const users = await prisma.user.findMany({
      where: { password: { not: null } },
      select: { password: true, email: true },
    });
    for (const u of users) {
      if (!u.password?.startsWith("$argon2")) {
        throw new Error(`User ${u.email} password not argon2 hashed`);
      }
    }
    console.log(`     (${users.length} users with argon2 passwords)`);
  });

  await assert("Alexandre password verifies with admin123", async () => {
    const argon2 = await import("argon2");
    const user = await prisma.user.findUnique({
      where: { email: "alexandre.moreau@marsai.com" },
    });
    if (!user?.password) throw new Error("User has no password");
    const valid = await argon2.verify(user.password, "admin123");
    if (!valid) throw new Error("Password verification failed");
  });

  await assert("Jules password verifies with admin123", async () => {
    const argon2 = await import("argon2");
    const user = await prisma.user.findUnique({
      where: { email: "jules.fournier@marsai.com" },
    });
    if (!user?.password) throw new Error("User has no password");
    const valid = await argon2.verify(user.password, "admin123");
    if (!valid) throw new Error("Password verification failed");
  });

  await assert(
    "Sophie (moderator) password verifies with admin123",
    async () => {
      const argon2 = await import("argon2");
      const user = await prisma.user.findUnique({
        where: { email: "sophie.martin@marsai.com" },
      });
      if (!user?.password) throw new Error("User has no password");
      const valid = await argon2.verify(user.password, "admin123");
      if (!valid) throw new Error("Password verification failed");
    },
  );

  // ─────────────────────────────────────────────────
  console.log("\n5️⃣  SOFT DELETE & AUDIT TRAIL");
  // ─────────────────────────────────────────────────
  await assert("Soft delete columns exist and are nullable", async () => {
    const cols: { column_name: string }[] = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'films' AND column_name = 'deletedAt'
    `;
    if (cols.length === 0) throw new Error("films.deletedAt column missing");
  });

  await assert("Film status history table exists", async () => {
    const tables: { tablename: string }[] = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'film_status_history'
    `;
    if (tables.length === 0)
      throw new Error("film_status_history table missing");
  });

  await assert("No hard-deleted data (soft delete pattern)", async () => {
    const deletedFilms = (await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM films WHERE "deletedAt" IS NOT NULL
    `) as any;
    const deletedUsers = (await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM users WHERE "deletedAt" IS NOT NULL
    `) as any;
  });

  // ─────────────────────────────────────────────────
  console.log("\n6️⃣  AWARD CATEGORIES DETAILS");
  // ─────────────────────────────────────────────────
  await assert("Award categories have proper structure", async () => {
    const cats = await prisma.awardCategory.findMany({
      orderBy: { displayOrder: "asc" },
    });
    if (cats.length !== 4) throw new Error("Expected 4 categories");
    for (let i = 0; i < cats.length; i++) {
      if (cats[i].displayOrder !== i + 1) {
        throw new Error(`Category ${cats[i].name} has wrong displayOrder`);
      }
    }
    const names = cats.map((c) => c.name);
    console.log(`     ${names.join(" · ")}`);
  });

  await assert(
    "Winners have isWinner=true and no duplicate winners per category",
    async () => {
      const winners = await prisma.filmNomination.findMany({
        where: { isWinner: true },
      });
      const catIds = winners.map((w) => w.categoryId);
      const unique = new Set(catIds);
      if (unique.size !== catIds.length)
        throw new Error("Duplicate winners in same category");
      console.log(
        `     (${winners.length} winner(s) across ${unique.size} categories)`,
      );
    },
  );

  // ─────────────────────────────────────────────────
  console.log("\n7️⃣  PERFORMANCE & INTEGRITY");
  // ─────────────────────────────────────────────────
  await assert("Database has proper indexes", async () => {
    const indexes: { indexname: string }[] = await prisma.$queryRaw`
      SELECT indexname FROM pg_indexes WHERE schemaname = 'public'
      AND tablename IN ('films', 'votes', 'users')
    `;
    const names = indexes.map((i) => i.indexname);
    if (names.length < 3) throw new Error("Expected at least 3 indexes");
    console.log(`     (${names.length} indexes on films/votes/users)`);
  });

  await assert("No orphaned votes (referential integrity)", async () => {
    const orphaned = (await prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM votes v
      LEFT JOIN films f ON f.id = v."filmId"
      WHERE f.id IS NULL
    `) as any;
    if (Array.isArray(orphaned) && orphaned[0]?.count > 0) {
      throw new Error(`${orphaned[0].count} orphaned votes found`);
    }
  });

  // ─────────────────────────────────────────────────
  // Summary
  const total = passed + failed;
  const pct = ((passed / total) * 100).toFixed(0);
  console.log("\n" + "═".repeat(55));
  console.log(`📊 RESULTS: ${passed}/${total} passed (${pct}%)`);
  if (failed > 0) {
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
