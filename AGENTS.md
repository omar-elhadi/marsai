# AGENTS.md

## Project Overview

**marsai-festival** is a full-stack JavaScript/TypeScript monorepo for a film festival submission and voting platform. It consists of three main workspaces:

- **server**: Express.js REST API with Prisma ORM and MySQL database
- **client**: React 19 + Vite frontend with Tailwind CSS and React Router
- **packages/validators**: Shared Zod validation library (`@marsai/validators`)

The project implements:

- User authentication (JWT-based with argon2 hashing)
- Film submission management
- Voting system
- S3-compatible storage integration (Scaleway)
- Email notifications (SMTP via nodemailer)
- Video processing (FFmpeg support)
- Admin dashboard
- Internationalization (i18n) support
- Rate limiting and security middleware

## Setup Commands

### Prerequisites

- Node.js 18+ (supports ES modules)
- MySQL 8.4+
- Docker & Docker Compose (for containerized development)
- FFmpeg (for video processing in server)

### Installation

```bash
# Install all workspace dependencies
npm install

# Install Prisma CLI globally (optional, useful for migrations)
npm install -g prisma
```

### Environment Setup

1. Copy environment files:

   ```bash
   cp .env.example .env
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

2. Configure `.env` with your actual values:
   - `DATABASE_URL`: MySQL connection string (default: `mysql://root:root@localhost:3307/marsai`)
   - `JWT_SECRET`: At least 32 characters, unique per environment
   - `SCALEWAY_*`: S3-compatible storage credentials
   - `MAIL_*`: Email configuration (SMTP)

3. Database setup:

   ```bash
   npm run prisma:migrate --workspace=server
   npm run prisma:generate --workspace=server
   ```

4. Create admin user:
   ```bash
   npm run create:admin --workspace=server
   ```

### Using Docker Compose

For complete containerized development environment:

```bash
# Start all services (db, server, client, optional mailhog)
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]
# service-name: db, server, client, mailhog
```

The Docker setup handles:

- MySQL database with health checks
- Server (Express API) with hot-reload via `tsx watch`
- Client (Vite dev server) with HMR
- Mailhog (optional) for email testing on port 8025

## Development Workflow

### Starting Development Servers

**Option 1: All workspaces from root**

```bash
# Run dev for all workspaces in parallel
npm run dev
```

**Option 2: Individual workspaces**

```bash
# Backend only
npm run dev --workspace=server

# Frontend only
npm run dev --workspace=client

# Validators library (TypeScript watch)
npm run dev --workspace=packages/validators
```

**Option 3: Docker Compose (recommended)**

```bash
docker-compose up
```

### Development Server Ports

- **Client**: http://localhost:5173 (Vite with HMR)
- **Server API**: http://localhost:5000
- **Server Debug**: localhost:9229 (Node.js inspector)
- **Mailhog Web**: http://localhost:8025 (email testing, optional)

### Hot Reload & File Watching

- **Client**: Vite handles automatic refresh on any file change
- **Server**: `tsx watch` monitors TypeScript files and restarts on change
- **Validators**: `tsc -w` watches and compiles on change

### Environment Variables

**Root & Server** (`.env`):

```
DATABASE_URL=mysql://root:root@localhost:3307/marsai
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev_secret_at_least_32_characters_change_in_prod
MAIL_HOST=mailhog (or your SMTP host)
MAIL_PORT=1025
SCALEWAY_ENDPOINT=s3.nl-ams.scw.cloud
SCALEWAY_BUCKET_NAME=your-bucket
SCALEWAY_ACCESS_KEY=your-key
SCALEWAY_SECRET_KEY=your-secret
```

**Client** (`.env` in client/):

```
VITE_API_URL=http://localhost:5000/api
```

## Testing Instructions

### Test Commands

**Run all tests across workspaces:**

```bash
npm run test
```

**Run tests in watch mode:**

```bash
npm run test:watch --workspace=server
npm run test:watch --workspace=client
```

**Generate coverage report:**

```bash
npm run test:coverage
```

### Test Files & Patterns

#### Server Tests

- Location: `server/src/__tests__/`
- Test framework: **Vitest**
- Setup file: `server/src/__tests__/setup.ts`
- Coverage config: `server/vitest.config.ts`

Test files include:

- `auth.service.test.ts` - Authentication logic
- `auth.routes.test.ts` - Auth endpoints
- `film.service.test.ts` - Film submission logic
- `film.routes.test.ts` - Film endpoints
- `vote.service.test.ts` - Voting logic
- `vote.routes.test.ts` - Vote endpoints

**Run specific test file:**

```bash
npm run test -- server/src/__tests__/auth.service.test.ts --workspace=server
```

**Run focused test (using `.only`):**

```bash
# Add `.only` to test case, then run:
npm run test:watch --workspace=server
```

#### Client Tests

- Location: `client/src/__tests__/`
- Test framework: **Vitest** with React Testing Library
- Key test files:
  - `SubmissionForm.test.tsx` - Form validation
  - `LoginAdmin.test.tsx` - Admin login component
  - `useFilms.test.tsx` - Films hook logic
  - `ProtectedRoute.test.tsx` - Route protection

**Run client tests:**

```bash
npm run test --workspace=client
npm run test:watch --workspace=client
```

#### Manual Testing

**Auth flow test (bash script):**

```bash
bash server/tests/auth-test.sh
```

This script tests registration, login, and JWT token validation.

### Coverage Requirements

- Server target: Exclude `src/types/**` and `src/__tests__/**`
- Coverage reporter outputs: `text`, `json`, `html`
- View HTML report: `coverage/index.html` after running `test:coverage`

## Code Style

### Language Conventions

**TypeScript:**

- Target: ES2020 modules
- Strict mode enabled
- No implicit `any`
- Use `const` by default, `let` only when needed

**JavaScript/JSX:**

- React 19 with functional components and hooks
- Use `const` for React components
- Props destructuring
- Event handlers with `handle*` prefix (e.g., `handleSubmit`)

### Linting & Formatting

**Client ESLint:**

```bash
npm run lint --workspace=client
```

Rules:

- Configured via `client/eslint.config.js`
- React Hooks: Enforces proper dependency arrays
- React Refresh: Prevents invalid Fast Refresh
- No unused vars (except UPPER_CASE constants)

**Server:**

- TypeScript compiler serves as linter
- `npm run type-check --workspace=server` for type validation

**Global linting:**

```bash
npm run lint
```

### File Organization

```
server/src/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middlewares/      # Express middleware
├── routes/           # Route definitions
├── services/         # Business logic
├── utils/            # Helper functions
├── __tests__/        # Test files
└── types/            # TypeScript types

client/src/
├── components/       # React components
├── pages/            # Page components (route-based)
├── hooks/            # Custom React hooks
├── services/         # API services
├── contexts/         # React contexts
├── layouts/          # Layout components
├── styles/           # Global styles
├── locales/          # i18n translations
├── types/            # TypeScript types
├── constants/        # App constants
└── __tests__/        # Test files
```

### Naming Conventions

**TypeScript/JavaScript:**

- Files: `camelCase.ts` or `PascalCase.tsx` for components
- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- React components: `PascalCase`
- Hook files: `useXxx.ts`

**Import patterns:**

```typescript
// Named exports for utilities
import { someFunction } from "@/utils/helpers";

// Default export for React components
import MyComponent from "@/components/MyComponent";

// Aliases (see vite.config.ts)
import Button from "@/components/Button"; // @/ points to src/
```

### Database Schema

Prisma schema location: `server/prisma/schema.prisma`

Key models:

- `User` - Authentication and profile
- `Film` - Submitted films
- `Vote` - User votes on films
- Migrations: `server/prisma/migrations/`

## Build and Deployment

### Build Commands

**Build all workspaces:**

```bash
npm run build
```

**Build specific workspace:**

```bash
npm run build --workspace=server
npm run build --workspace=client
npm run build --workspace=packages/validators
```

**Output directories:**

- Server: `server/dist/` (compiled JavaScript)
- Client: `client/dist/` (optimized HTML/CSS/JS)
- Validators: `packages/validators/dist/` (compiled declarations & JS)

### Type Checking Before Build

```bash
npm run type-check
```

Ensures all workspaces pass TypeScript compilation.

### Production Build

**Server production start:**

```bash
npm run build --workspace=server
npm start --workspace=server
```

**Client production preview (local testing):**

```bash
npm run build --workspace=client
npm run preview --workspace=client
```

### Docker Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Production Dockerfile targets:

- `builder`: Multi-stage build with dependencies
- `final`: Slim runtime container

**Environment-specific builds:**

Development (docker-compose.yml):

- Uses `target: builder` with full source mounted
- Runs `npm run dev` for hot-reload
- Includes debug port 9229

Production (docker-compose.prod.yml):

- Uses `target: final` with production dependencies only
- Runs optimized build output
- Minimal image size

## Pull Request Guidelines

### Title Format

`[<workspace>] Brief description`

Examples:

- `[server] Add film submission validation`
- `[client] Fix admin login redirect`
- `[packages/validators] Export Vote schema`

### Required Checks Before Submission

All of these must pass before opening a PR:

```bash
# 1. Run tests for modified workspace(s)
npm run test --workspace=server
npm run test --workspace=client

# 2. Type checking
npm run type-check

# 3. Linting
npm run lint --workspace=client
# (Server uses tsc for type checking)

# 4. Build verification
npm run build
```

### Commit Message Conventions

Use conventional commits within each workspace:

```
[server] feat: add film filtering by status
[client] fix: correct admin dashboard layout
[packages/validators] refactor: simplify film schema
```

### Code Review Requirements

- All tests passing
- Type checking clean
- ESLint no errors
- No console.log in production code (except structured logging)
- PR description explains what changed and why

## Security Considerations

### Authentication & Authorization

- JWT tokens stored in HTTP-only cookies (no localStorage)
- Passwords hashed with argon2
- Admin-only routes protected via middleware
- Rate limiting on auth endpoints: 5 requests/15 minutes

### Data Protection

- Helmet.js enabled for security headers
- HPP (HTTP Parameter Pollution) protection
- CORS whitelist for frontend URL only
- SQL injection prevented by Prisma (parameterized queries)
- Input validation via Zod schemas

### Secrets Management

**Never commit:**

- `.env` files (use `.env.example` template)
- API keys or credentials
- Private keys

**Environment variables required in production:**

- `JWT_SECRET` (min 32 characters)
- `SCALEWAY_ACCESS_KEY` / `SCALEWAY_SECRET_KEY`
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`
- `DATABASE_URL`

### S3/Scaleway Configuration

- Presigned URLs for secure file uploads
- CORS headers configured in Scaleway bucket
- S3 access keys stored in environment variables only
- Folder-based namespacing: `SCALEWAY_FOLDER=videos`

## Monorepo Instructions

This is an npm workspaces monorepo. All packages share root `package.json` and `node_modules`.

### Running Commands in Workspaces

```bash
# Run in specific workspace
npm run <script> --workspace=server
npm run <script> --workspace=client
npm run <script> --workspace=packages/validators

# Run in all workspaces
npm run dev --workspaces --if-present

# Jump to workspace directory (npm 10+)
cd packages/validators
npm run build
```

### Workspace Dependencies

- **client** depends on `@marsai/validators`
- **server** depends on `@marsai/validators`
- **validators** is imported by: `@marsai/validators` (package name)

Update validators and publish changes:

```bash
npm run build --workspace=packages/validators
# Then client/server automatically pick up changes after npm install
```

### Cross-Workspace Imports

In `server` and `client`:

```typescript
import { FilmSubmissionSchema, VoteSchema } from "@marsai/validators";
```

This works because:

1. `packages/validators/package.json` has `"name": "@marsai/validators"`
2. Root `package.json` includes `"packages/*"` in workspaces
3. npm links all workspaces in node_modules

## Debugging and Troubleshooting

### Common Issues & Solutions

**"Module not found" errors**

```bash
# Ensure all dependencies are installed
npm install

# Rebuild workspace dependencies
npm run build --workspace=packages/validators
```

**Database connection errors**

```bash
# Check MySQL is running (Docker)
docker-compose ps

# Verify DATABASE_URL in .env
# Format: mysql://root:password@host:port/database

# Test connection
mysql -h localhost -P 3307 -u root -p
```

**Prisma migration issues**

```bash
# Reset database (development only!)
npm run prisma:migrate -- --name init --workspace=server

# Generate client types
npm run prisma:generate --workspace=server
```

**Port conflicts**

- Client (5173): `lsof -i :5173` to find process
- Server (5000): `lsof -i :5000`
- MySQL (3307): `lsof -i :3307`

Kill with: `kill -9 <PID>`

**FFmpeg not found**

```bash
# Install system FFmpeg
apt-get install ffmpeg  # Linux
brew install ffmpeg    # macOS

# Or use npm package (already included)
npm install @ffmpeg-installer/ffmpeg --workspace=server
```

### Logging & Debug Configuration

**Server logging:**

Uses `pino` structured logger:

```typescript
import { logger } from "@/config/logger";
logger.info({ userId }, "User logged in");
logger.error({ err }, "Film upload failed");
```

View logs in Docker:

```bash
docker-compose logs -f server
```

**Client debugging:**

React DevTools browser extension recommended.

Vite debug mode:

```bash
npm run dev --workspace=client
# Open http://localhost:5173, check Network tab in DevTools
```

**Node.js Inspector**

Attach debugger to running server:

```bash
# Server already exposes port 9229 in docker-compose.yml
# VS Code: Create .vscode/launch.json with:
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Server",
  "port": 9229,
  "restart": true
}
```

### Performance Considerations

**Database queries:**

- Prisma selects fields explicitly to avoid over-fetching
- Indexes on `userId`, `filmId` for joins
- Pagination implemented on film list routes

**Client bundle:**

- Vite code-splitting for routes
- Tailwind CSS v4 purges unused styles
- GSAP animations trigger on viewport (Lenis scroll)

**Video processing:**

- FFmpeg operations queued via `p-queue`
- Prevent resource exhaustion
- Consider background job queue for large files

**API caching:**

- Client caches films list in React Context
- Invalidation on vote/submit
- No aggressive caching (films update frequently)

## Additional Notes

### Project Structure

```
marsai-festival/
├── .github/          # GitHub Actions workflows
├── docs/             # Documentation
├── server/           # Express API (port 5000)
├── client/           # React frontend (port 5173)
├── packages/         # Shared libraries
│   └── validators/   # Zod validation schemas
├── docker-compose.yml        # Dev environment
├── docker-compose.prod.yml   # Production environment
├── package.json      # Root workspace config
└── .env.example      # Environment template
```

### Git Workflow

- Main branch: `main` (stable, production-ready)
- Development: Feature branches from `main`
- Commit convention: `[workspace] type: description`
- PR reviews required before merge

### Frontend Internationalization (i18n)

- Configuration: `client/src/i18n.ts`
- Translations: `client/src/locales/[lang].json`
- Supported languages: Detected from browser, fallback to English
- Add new language: Create locale file + register in i18n.ts

### Known Gotchas

1. **MySQL 8.4 UPPER_CASE in identifiers**: Queries use backticks for reserved words
2. **Prisma type generation**: Run `prisma generate` after schema changes
3. **Vite HTTPS certs**: Built for local dev only (certs in `/home/kaneki_ken/bin/certs/`)
4. **FFmpeg path**: Uses `@ffmpeg-installer/ffmpeg` which may need PATH setup on CI
5. **Docker volumes**: Node_modules mounted separately to avoid conflicts with host

## References

- **Express.js**: https://expressjs.com/
- **Prisma**: https://www.prisma.io/docs/
- **React 19**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Zod**: https://zod.dev/
- **Vitest**: https://vitest.dev/
- **Tailwind CSS v4**: https://tailwindcss.com/
- **Agents.md Spec**: https://agents.md/
