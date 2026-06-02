# Marsai Film Festival - Workspace Guidelines

Marsai is a full-stack film festival management platform with React 19 + Vite frontend, Express 5 backend, and MySQL database via Prisma 6. TypeScript strict mode across the entire monorepo.

## Quick Start

```bash
# Install all workspace dependencies
npm install

# Setup database
npm run prisma:migrate --workspace=server && npm run prisma:generate --workspace=server

# Create admin user
npm run create:admin --workspace=server

# Development (all workspaces)
npm run dev
```

## Architecture

### Monorepo Structure (npm workspaces)

- `client/` - React 19 + Vite 7 + Tailwind 4 + GSAP + i18n
- `server/` - Express 5 + Prisma 6 + MySQL + argon2 + Pino
- `packages/validators/` - Shared Zod validation schemas (`@marsai/validators`)

## Code Conventions

### Frontend (client/)

**Path Aliasing:**

```typescript
import Header from "@/components/layouts/Header"; // @/ alias always
```

**Routing - Use constants:**

```typescript
import { ROUTES } from "@/constants/routes";
<Link to={ROUTES.CONTACT}>Contact</Link>;
```

**Component Structure:**

```typescript
// Functional components with TypeScript interfaces (no PropTypes)
interface MyComponentProps { title: string; onSubmit: () => void; }
const MyComponent = ({ title, onSubmit }: MyComponentProps) => { ... };
export default MyComponent;
```

**API Calls (Axios instance):**

```typescript
import { apiClient } from "@/services/api/apiClient";
const { data } = await apiClient.get("/films");
```

**Authentication (AuthContext):**

```typescript
import { useAuth } from "@/hooks/useAuth";
const { user, login, logout, isAuthenticated } = useAuth();
// JWT in httpOnly cookie — automatic with credentials: 'include'
```

**Folder Conventions:**

- Components: `PascalCase/` → `Button/Button.tsx`
- Hooks: `use` prefix → `useAuth.ts`
- Utils: `camelCase` → `formatDate.ts`
- Constants: `UPPER_SNAKE_CASE`

### Backend (server/)

**Request Flow:**

```
Route → Middleware(s) → Controller → Service → Prisma/DB
```

**Three-Layer Architecture:**

1. **Controllers** - HTTP handling, validation, response formatting (use catchAsync)
2. **Services** - Business logic, database operations, email/S3
3. **Prisma** - Database queries only

**Validation with Zod (shared package):**

```typescript
import { submitFilmSchema } from "@marsai/validators";
router.post("/submit", validate(submitFilmSchema), controller.submit);
```

## Key Patterns

- **Error handling**: Custom `AppError` class + global `errorHandler` middleware
- **Logging**: Pino structured logger (no console.log/error)
- **Email queue**: p-queue with concurrency 5 and 3 retries
- **Auth**: JWT in httpOnly cookies, argon2id password hashing
- **Magic links**: Single-use tokens (cleared after verification)
- **S3/Storage**: Private ACL with presigned URLs
- **Rate limiting**: 10/15min auth, 5/hour submit, 10/hour upload

## Testing

```bash
# All tests
npm run test

# Server tests (Vitest)
npm run test --workspace=server

# Client tests (Vitest + React Testing Library)
npm run test --workspace=client

# Type checking
npm run type-check

# Coverage
npm run test:coverage
```

## Environment Variables

**Client:**

```env
VITE_API_URL=http://localhost:5001/api
```

**Server:**

```env
DATABASE_URL="mysql://user:pass@localhost:3306/marsai"
JWT_SECRET="your-secret-key"
FRONTEND_URL="https://localhost:5173"
SCALEWAY_ENDPOINT=...
SCALEWAY_BUCKET_NAME=...
SCALEWAY_ACCESS_KEY=...
SCALEWAY_SECRET_KEY=...
MAIL_HOST=...
MAIL_PORT=...
```

## Database

- Prisma ORM with MySQL 8.4
- Models: User (ADMIN|MODERATOR|JURY), Film (8 statuses), Vote, AwardCategory, FilmNomination
- Vote stats denormalized on Film (avgRating, totalVotes)
- Soft deletes with deletedAt on Film, User, Submitter

## Security

- JWT in httpOnly cookies (XSS protection)
- Helmet.js + HPP middleware
- CORS restricted to FRONTEND_URL
- Password hashing with argon2 (argon2id)
- Magic links single-use for jury
- Rate limiting on public endpoints
- Input validation via Zod schemas (@marsai/validators)

## Testing

**Vitest** is used across all workspaces. Test files are colocated or in `__tests__/`:

- Server: `server/src/__tests__/*.test.ts`
- Client: `client/src/__tests__/*.test.tsx`
