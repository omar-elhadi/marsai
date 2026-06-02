## Plan: Full Production Upgrade — Marsai Film Festival

This transforms a beginner hobby project into a real-world production application. Approach: close security holes first → migrate to TypeScript → rebuild architecture on top → add quality layers. All 8 phases are independently verifiable.

**Decisions recorded:** Full TS migration at once (strict), React Context for auth state, in-process p-queue for emails, full FR/EN i18n, cloud-platform Dockerfiles (no compose in prod), argon2 hard cut (dev DB), shared Zod validators via monorepo package, runtime mock data removal (test-only fixtures allowed).

---

### Phase 1 — Security Critical Fixes _(independent, do first)_

1. **Delete** `server/src/middlewares/auth.js` — consolidate everything into `auth.middleware.js`
2. **Fix magic link vulnerability** in `auth.controller.js` — after `verifyToken`, set `loginToken: null, tokenExpires: null` in the DB (currently the token is never cleared → reusable indefinitely)
3. **Replace `bcrypt`** with `argon2` (argon2id variant) in `auth.service.js` + `create-admin.js` using a **hard cut** (no backward bcrypt compatibility path)
4. **Add `helmet`** middleware in `server/src/index.js` (X-Frame-Options, CSP, HSTS, etc.)
5. **Add `hpp`** (HTTP Parameter Pollution) middleware
6. **Fix body parser limits** — `express.json({ limit: '5mb' })` instead of unbounded default
7. **Sanitize email templates** in `mail.service.js` — user-controlled `message` is injected directly into HTML; add entity encoding
8. **Fix S3 ACL** — change `public-read` → `private` + use presigned URLs for all video playback
9. **Validate `parseInt(req.params.id)`** in all controllers — return 400 if `NaN`
10. **Create `server/src/utils/validateEnv.js`** — throw on startup if `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` are missing

---

### Phase 2 — TypeScript Migration _(blocks Phases 3 + 4)_

**Monorepo baseline (required before client/server TS refactor):**

1. Add root `package.json` workspaces for `client`, `server`, and `packages/*`
2. Create `packages/validators/` shared package (TypeScript + Zod schemas)
3. Add exports map and path aliases so client and server both import from `@marsai/validators`

**Backend:**

1. Add `server/tsconfig.json` (strict, ESNext, moduleResolution node16)
2. Add `tsx`, `@types/node`, `@types/express`, `@types/cookie-parser`, `@types/cors`; update `dev`/`build`/`start` scripts
3. Create `server/src/types/express.d.ts` — augment `Request` with `user?: { id: number; role: Role }`
4. Create `server/src/types/index.ts` — shared interfaces and imports from `@marsai/validators`
5. Rename all `.js` → `.ts`; add types to params, return values, Prisma results

**Frontend:**

1. Add `client/tsconfig.json` + `client/tsconfig.node.json`, rename `vite.config.js` → `vite.config.ts`
2. Create `client/src/types/index.ts` — `Film`, `User`, `Vote`, `AuthUser`, `ApiResponse<T>`, etc.
3. Rename all `.jsx` → `.tsx`, `.js` → `.ts`
4. **Remove `prop-types`** dependency entirely (replaced by TS interfaces)

**Shared validators (monorepo pattern):**

1. Move auth/film/vote/user Zod schemas into `packages/validators/src/`
2. Import schemas in server routes/middlewares from `@marsai/validators`
3. Reuse schemas and inferred types in client forms through `zodResolver`

---

### Phase 3 — Backend Architecture _(after Phase 2, parallel with Phase 4)_

**3a — Error Handling**

1. Create `server/src/utils/AppError.ts` — class with `statusCode`, `isOperational`
2. Create `server/src/utils/catchAsync.ts` — wraps async controllers to propagate errors
3. Create `server/src/middlewares/error.middleware.ts` — global Express error handler differentiating `AppError`, Prisma errors, Zod errors, and unknown errors
4. Refactor all controllers to use `catchAsync()` — remove scattered `try/catch`

**3b — Structured Logging**

1. Add `pino` + `pino-http`; create `server/src/utils/logger.ts`
2. Replace all `console.log/error` with `logger.info/error/warn`
3. Add `pino-http` middleware in `index.ts` for automatic request logging

**3c — Prisma Transactions**

1. Wrap `requestModification`, `updateFilmStatus`, `submitFilm` in `prisma.$transaction()`
2. Use atomic `increment` for vote stats updates to prevent race conditions
3. Enforce `VALID_TRANSITIONS` on every `updateFilmStatus` call in the service layer

**3d — Schema Additions** _(new migration)_

- Add `deletedAt DateTime?` to `Film`, `User`, `Submitter` (soft deletes)
- Add `approvedBy Int?`, `approvedAt DateTime?`, `rejectedBy Int?`, `rejectedAt DateTime?` to `Film`
- Add new model `FilmStatusHistory` — `filmId`, `fromStatus`, `toStatus`, `changedBy`, `changedAt`, `comment?`
- Filter all queries with `where: { deletedAt: null }` by default

**3e — In-Process Email Queue**

1. Add `p-queue`; create `server/src/utils/emailQueue.ts` — PQueue (concurrency 5, 3 retries)
2. Wrap all `mailService.*` calls with `emailQueue.add()` — email failure no longer blocks HTTP response

---

### Phase 4 — Frontend Architecture _(after Phase 2, parallel with Phase 3)_

**4a — AuthContext** _(replaces all localStorage reads)_

1. Create `client/src/contexts/AuthContext.tsx` — provides `user`, `login()`, `logout()`, `isAuthenticated`, `hasRole()`
2. On app init: call `GET /auth/me` to rehydrate from httpOnly cookie (no localStorage)
3. Create `client/src/hooks/useAuth.ts` consumer hook
4. Refactor `ProtectedRoute.tsx` to use `useAuth()` — remove all `localStorage.getItem("marsai_user")`

**4b — Centralized API Client**

1. Create `client/src/services/api/apiClient.ts` — Axios instance with `withCredentials: true`, 401 interceptor (clear auth + redirect to login), error normalization
2. Create resource modules: `films.ts`, `auth.ts`, `votes.ts`, `users.ts`, `awards.ts` — typed methods using `ApiResponse<T>`
3. Replace all inline `fetch()` calls with apiClient methods

**4c — Custom Hooks**

- `useFilms.ts` — paginated + filtered list
- `useFilm.ts` — single film + status management
- `useVote.ts` — vote submission with optimistic update
- `useGallery.ts` — gallery with infinite scroll

**4d — Error Boundaries**

1. Create `client/src/components/ErrorBoundary/ErrorBoundary.tsx` + `ErrorFallback/ErrorFallback.tsx`
2. Wrap `<App>` in global ErrorBoundary; add per-route boundaries in `App.tsx`

**4e — Form Handling**

1. Install `react-hook-form` + `@hookform/resolvers`
2. Refactor `SubmissionForm.tsx` and `LoginAdmin.tsx` with `useForm + zodResolver`
3. Replace local client validators with imports from `@marsai/validators` (single source of truth)
4. Remove all inline `style={{}}` from `LoginAdmin.tsx` and elsewhere → pure Tailwind

**4f — UI Consistency**

1. Create `client/src/components/ui/Skeleton/Skeleton.tsx` — reusable loading placeholder
2. Add consistent loading + error states to all data-fetching pages
3. Move `formatDate`, `formatDuration` to `client/src/utils/format.ts` (deduplicate from 3+ files)

---

### Phase 5 — i18n FR/EN _(after Phase 4)_

1. Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`
2. Create `client/src/i18n.ts` — detect browser language, fallback `fr`
3. Create `client/locales/fr/` + `client/locales/en/` — `common.json`, `films.json`, `jury.json`, `admin.json`, `errors.json`
4. Replace all hardcoded UI strings with `useTranslation()` hook
5. Add `LanguageSwitcher.tsx` in `Header` — persists in localStorage, updates `<html lang>`

---

### Phase 6 — Testing with Vitest _(after Phase 2)_

**Backend:**

1. Add `vitest`, `supertest`, `@types/supertest`; create `server/vitest.config.ts`
2. Create `server/src/__tests__/setup.ts` — Prisma mock using `vitest-mock-extended`
3. Unit tests: `auth.service.test.ts` (login, argon2, magic link invalidation), `film.service.test.ts` (transitions, soft delete), `vote.service.test.ts` (upsert, race guard)
4. Route integration tests with Supertest: `auth.routes.test.ts`, `film.routes.test.ts`, `vote.routes.test.ts`

**Frontend:**

1. Add `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`; create `client/vitest.config.ts`
2. Create `client/src/__tests__/setup.ts` — jest-dom matchers
3. Component tests: `ProtectedRoute.test.tsx`, `ErrorBoundary.test.tsx`, `SubmissionForm.test.tsx`, `LoginAdmin.test.tsx`
4. Hook tests: `useAuth.test.ts`, `useFilms.test.ts`

**Mock policy (testing only):**

1. Keep minimal mocks only under `client/src/__tests__/__fixtures__/` and `server/src/__tests__/__fixtures__/`
2. Runtime app code must not import from `client/src/data/mockData.js`, `movies.js`, or `newsData.js`

---

### Phase 7 — Containerization + CI/CD _(after Phase 2, parallel with others)_

1. `server/Dockerfile` — multi-stage: `builder` (tsc) → `production` (node:alpine + dist)
2. `client/Dockerfile` — multi-stage: `builder` (vite build) → `production` (nginx:alpine + SPA nginx.conf)
3. `docker-compose.yml` — **dev only**: MySQL 8.4 + server (tsx watch) + client (vite dev)
4. Update both `.env.example` files to be fully exhaustive (S3, YouTube API, Mail, JWT, MySQL)
5. `.github/workflows/ci.yml` — on PR: `lint`, `test-server`, `test-client`, `build-server`, `build-client` jobs

---

### Phase 8 — Quality & Polish _(final pass)_

1. **Accessibility**: ARIA roles on Header nav, `VideoModal`, Gallery cards, all form fields (labels, descriptions)
2. **Code splitting**: `React.lazy()` + `<Suspense>` for Admin routes and Jury routes
3. **SEO**: `<meta>` tags for Film detail pages + public Gallery
4. **Server-side pagination**: cursor-based on `GET /films` and `GET /gallery` with `limit`/`cursor` params
5. **Delete runtime mock sources** in `client/src/data/` (`mockData.js`, `movies.js`, `newsData.js`) after replacing imports with real API calls
6. **Update all docs** to reflect TypeScript, Docker commands, new folder structure
7. Add API-backed endpoints for News/Events/Gallery content and wire pages to real-time or near-real-time data flow

---

### Relevant Files

**Critical security fixes now:**

- `server/src/middlewares/auth.js` — **delete**
- `server/src/middlewares/auth.middleware.js` — consolidate into this
- `server/src/controllers/auth.controller.js` — magic link token invalidation
- `server/src/services/auth.service.js` — argon2id swap
- `server/src/services/mail.service.js` — HTML injection fix
- `server/src/services/s3.service.js` — ACL fix
- `server/src/index.js` — helmet, hpp, body limits

**Architecture core:**

- `server/src/services/film.service.js` — transactions, soft delete, audit trail
- `server/src/services/vote.service.js` — atomic stats, race condition guard
- `client/src/App.jsx` — ErrorBoundary, AuthContext provider
- `client/src/components/ProtectedRoute.jsx` — refactor to useAuth()
- `client/src/pages/LoginAdmin.jsx` — react-hook-form, remove inline styles
- `client/src/pages/Submission/SubmissionForm.jsx` — react-hook-form + zod
- `server/prisma/schema.prisma` — soft delete + audit trail additions

---

### New Files to Create

**Server:**

- `package.json` (root workspaces integration)
- `server/tsconfig.json`
- `server/src/types/express.d.ts`, `server/src/types/index.ts`
- `server/src/utils/AppError.ts`, `catchAsync.ts`, `logger.ts`, `validateEnv.ts`, `emailQueue.ts`
- `server/src/middlewares/error.middleware.ts`
- `server/vitest.config.ts`
- `server/src/__tests__/setup.ts`, `auth.service.test.ts`, `film.service.test.ts`, `vote.service.test.ts`
- `server/src/__tests__/routes/auth.routes.test.ts`, `film.routes.test.ts`, `vote.routes.test.ts`
- `server/Dockerfile`, `server/.dockerignore`

**Client:**

- `client/tsconfig.json`, `client/tsconfig.node.json`
- `client/src/types/index.ts`
- `client/src/contexts/AuthContext.tsx`
- `client/src/hooks/useAuth.ts`, `useFilms.ts`, `useFilm.ts`, `useVote.ts`, `useGallery.ts`
- `client/src/services/api/apiClient.ts`, `films.ts`, `auth.ts`, `votes.ts`, `users.ts`, `awards.ts`
- `client/src/components/ErrorBoundary/ErrorBoundary.tsx`
- `client/src/components/ui/Skeleton/Skeleton.tsx`, `ErrorFallback/ErrorFallback.tsx`
- `client/src/components/common/LanguageSwitcher/LanguageSwitcher.tsx`
- `client/src/utils/format.ts`, `client/src/i18n.ts`
- `client/locales/fr/common.json`, `films.json`, `jury.json`, `admin.json`, `errors.json`
- `client/locales/en/common.json`, `films.json`, `jury.json`, `admin.json`, `errors.json`
- `client/vitest.config.ts`, `client/src/__tests__/setup.ts`
- `client/src/__tests__/ProtectedRoute.test.tsx`, `ErrorBoundary.test.tsx`, `SubmissionForm.test.tsx`, `LoginAdmin.test.tsx`
- `client/src/__tests__/hooks/useAuth.test.ts`, `useFilms.test.ts`
- `client/src/__tests__/__fixtures__/` (minimal test fixtures only)
- `client/Dockerfile`, `client/.dockerignore`, `client/nginx.conf`

**Packages:**

- `packages/validators/package.json`
- `packages/validators/tsconfig.json`
- `packages/validators/src/auth.validator.ts`, `film.validator.ts`, `user.validator.ts`, `vote.validator.ts`, `index.ts`

**Root:**

- `package.json` (workspaces + shared scripts)
- `tsconfig.base.json`

- `docker-compose.yml`
- `.github/workflows/ci.yml`

---

### Files to Delete

- `server/src/middlewares/auth.js` (duplicate auth middleware)
- `client/src/data/mockData.js` (replace with real API calls)
- `client/src/data/movies.js` (replace with real API calls)
- `client/src/data/newsData.js` (replace with real API calls)

---

### Resolved Decisions

1. **Argon2 migration path:** hard cut is accepted (project in dev mode with low migration cost)
2. **Shared validators strategy:** monorepo shared package `packages/validators` is required
3. **Mock data policy:** remove runtime mock data and keep only minimal test fixtures

---

### Verification Checklist

- [ ] `npm run -ws build` — root workspace build passes (`client`, `server`, `packages/validators`)
- [ ] `cd server && npx tsc --noEmit` — zero TS errors
- [ ] `cd client && npx tsc --noEmit` — zero TS errors
- [ ] `cd packages/validators && npx tsc --noEmit` — shared schemas/types compile cleanly
- [ ] `cd server && npx vitest run --coverage` — all tests pass, >80% coverage on services
- [ ] `cd client && npx vitest run --coverage` — all tests pass
- [ ] `docker compose up` — full stack boots, seed runs, login works
- [ ] Magic link used twice → second use returns 401
- [ ] Argon2: `create:admin` script produces working logins after migration
- [ ] `rg "@/data/mockData|@/data/movies|@/data/newsData" client/src --glob '!**/__tests__/**'` returns no runtime matches
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on Homepage + Submission page
- [ ] OWASP ZAP quick scan on `http://localhost:5001` — no high-severity findings
- [ ] GitHub Actions CI passes green on a test PR

---

### Scope Boundaries

**In scope:** TypeScript, argon2id, AuthContext, Axios client, custom hooks, ErrorBoundary, react-hook-form, Vitest, Dockerfiles, CI workflow, i18n FR/EN, Pino logging, soft deletes, audit trail, email queue, Helmet+HPP

**Out of scope:** Redis/BullMQ, full OpenAPI spec, monitoring/APM, database backups, YouTube integration changes, Suno AI integration, production cloud-specific deployment config
