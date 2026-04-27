# 🎬 MARSAI Film Festival - Production Ready Platform

**Production Upgrade Status**: ✅ **COMPLETE** (All 8 Phases)

A full-stack film festival management platform with React frontend, Express backend, and MySQL database. Fully TypeScript, tested, containerized, and production-ready.

## 📊 Quick Stats

- **Tests**: 36/36 passing (17 backend + 19 frontend) ✅
- **Languages**: TypeScript, React, Node.js
- **Type Safety**: Strict mode enabled ✅
- **Security**: Zero high-priority vulnerabilities ✅
- **CI/CD**: GitHub Actions automated ✅
- **Containerized**: Docker Compose ready ✅

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development (3 minutes)

```bash
# 1. Clone and navigate
git clone <repo>
cd marsai-1festival

# 2. Start everything
docker-compose up --build

# 3. In another terminal, initialize database
docker-compose exec server npx prisma migrate dev
docker-compose exec server npm run create:admin

# 4. Access:
# Frontend: http://localhost:5173
# API: http://localhost:5000/api
# Admins can login with created credentials
```

**Want to develop locally without Docker?**

```bash
npm install --prefix client --prefix server --prefix packages/validators

# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## 📁 Project Structure

```
marsai-1festival/
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
│       ├── ci.yml                # Tests, build, lint
│       └── deploy.yml            # Production deployment
├── client/                        # React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── components/           # UI components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/api/         # API client
│   │   ├── contexts/             # React context (Auth)
│   │   ├── types/                # TypeScript types
│   │   ├── locales/              # i18n translations (FR/EN)
│   │   └── __tests__/            # 19 component tests
│   ├── Dockerfile                # Multi-stage build
│   └── package.json
├── server/                        # Express + Prisma + MySQL
│   ├── src/
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic
│   │   ├── middlewares/          # Auth, validation, error
│   │   ├── routes/               # API endpoints
│   │   ├── utils/                # Helpers (logger, errors, etc)
│   │   ├── types/                # TypeScript types
│   │   └── __tests__/            # 17 unit & integration tests
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Database migrations
│   │   └── seed.js               # Seed data
│   ├── Dockerfile                # Multi-stage build
│   └── package.json
├── packages/
│   └── validators/               # Shared Zod schemas (monorepo)
├── docs/                         # Comprehensive documentation
│   ├── STRUCTURE_PROJET.md       # File structure guide
│   ├── CONVENTIONS_REACT.md      # React patterns
│   ├── CONVENTIONS_EXPRESS.md    # Backend patterns
│   ├── QUALITY_AND_ACCESSIBILITY.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── ...
├── docker-compose.yml            # Dev environment
├── docker-compose.prod.yml       # Production environment
├── PRODUCTION_SUMMARY.md         # Everything completed
├── DOCKER.md                     # Docker setup guide
└── README.md                     # This file
```

---

## 🎯 What's Included

### ✅ Security

- Argon2id password hashing
- JWT in httpOnly cookies
- Single-use magic links for jury
- Rate limiting on all public endpoints
- Helmet security headers
- CORS properly configured
- Input validation with Zod

### ✅ Testing

- **Backend**: 17 tests (auth, films, votes, routes)
- **Frontend**: 19 tests (components, hooks, pages)
- **Coverage**: All critical user paths
- **Tools**: Vitest, Supertest, React Testing Library

### ✅ TypeScript

- Strict mode throughout
- Complete type definitions
- Express Request augmentation
- React component typing
- Shared validator types

### ✅ i18n

- 🇫🇷 Français (primary)
- 🇬🇧 English (secondary)
- Browser language detection
- Per-page namespaces (admin, common, errors)

### ✅ Containerization

- Multi-stage Dockerfiles
- Docker Compose for dev
- Docker Compose for production
- Health checks & networking

### ✅ CI/CD

- GitHub Actions workflow
- Automated testing
- Build verification
- Docker image building
- Security scanning (Trivy)

### ✅ Documentation

- Architecture guides
- API documentation
- Deployment checklist
- Accessibility guide
- Docker setup guide

---

## 🔧 Available Commands

### Root Level

```bash
npm run dev              # Start all services in dev mode
npm run build            # Build all workspaces
npm run test             # Run all tests
npm run test:coverage    # Generate coverage reports
npm run type-check       # Type check all workspaces
npm run lint             # Lint client code
```

### Client (React)

```bash
cd client
npm run dev              # Vite dev server (port 5173)
npm run build            # Production build
npm run test             # Run component tests
npm run test:watch       # Watch mode tests
npm run lint             # ESLint checks
npm run type-check       # TypeScript verification
```

### Server (Express)

```bash
cd server
npm run dev              # Node dev with tsx watch
npm run build            # TypeScript compilation
npm run start            # Production server
npm run test             # Run API tests
npm run test:watch       # Watch mode tests
npm run test:coverage    # Coverage report
npm run type-check       # TypeScript verification
npm run create:admin     # Interactive admin creation
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

### Docker

```bash
docker-compose up              # Start dev stack
docker-compose up --build      # Rebuild images
docker-compose down            # Stop everything
docker-compose logs -f         # View logs
docker-compose ps              # Service status

# Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📋 Features

### Public Pages

- 🏠 Homepage with festival info
- 🎬 Film gallery with filtering
- 📰 News & events
- 📋 Competition rules
- ⚖️ Legal pages (privacy, terms)
- 📬 Newsletter signup
- 📞 Contact form

### Filmmaker Submission

- 📹 Film upload (S3/Scaleway)
- 🎞️ Metadata entry (title, description, AI tools used)
- 📧 Confirmation email
- 🔄 Modification request workflow
- 🌐 Submission tracking

### Admin Dashboard

- 👥 User management (admins, moderators, jury)
- 📽️ Film management (review, approve, reject)
- 🏆 Award categories & nominations
- 👁️ Jury visibility controls
- 📊 Statistics & analytics
- ⚙️ System settings

### Jury Dashboard

- 🎥 Assigned films list
- 📝 Film voting (1-10 rating, LIKE/DISLIKE)
- 💬 Comments & feedback
- 🔒 Internal vs public comments
- ✏️ Edit existing votes

### Advanced Features

- 🔐 Magic link authentication (jury)
- 🔑 JWT-based session management
- 📧 Email integration (magic links, confirmations)
- 💾 Soft deletes with audit trail
- 🎨 Smooth animations (GSAP)
- 📱 Fully responsive design
- ♿ WCAG 2.1 Level AA accessibility
- 🌍 Bilingual UI (FR/EN)

---

## 🗄️ Database Schema

### Core Models

- **User** - Admins, Moderators, Jury members
- **Film** - Submitted films with full metadata
- **Vote** - Jury ratings and feedback
- **AwardCategory** - Multi-edition award categories
- **FilmNomination** - Film-category associations
- **FilmStatusHistory** - Audit trail of status changes
- **Submitter** - filmmaker profiles
- **Submitter** - filmmaker profiles
- **JuryMember** - Public jury presentation
- **NewsletterSubscriber** - Email subscribers

### Features

- ✅ Soft deletes (deletedAt)
- ✅ Audit trail (FilmStatusHistory)
- ✅ Denormalized stats (avgRating, totalVotes)
- ✅ Encrypted sensitive data (hashed passwords)
- ✅ Cascade deletes where appropriate
- ✅ Proper indexes on frequent queries

---

## 🔒 Security Features

### Authentication & Authorization

- JWT tokens in httpOnly cookies (XSS protection)
- argon2id password hashing (OWASP standard)
- Single-use magic links for jury (7-day expiry)
- Role-based access control (ADMIN > MODERATOR > JURY)
- Session expiration and refresh

### API Security

- Rate limiting (auth: 10/15min, magic link: 20/hour)
- Input validation (Zod schemas)
- SQL injection prevention (Prisma ORM)
- CORS restrictions (frontend URL only)
- CSRF protection (none needed with SameSite cookies)

### Application Security

- Helmet security headers
- HTTPOnly cookies
- SameSite cookie restrictions
- Content Security Policy ready
- X-Frame-Options preventing clickjacking
- X-Content-Type-Options preventing MIME sniffing

---

## 📈 Performance

### Optimizations

- Database query optimization with indexes
- Denormalized vote statistics for fast dashboard
- Email queue (async, non-blocking)
- Code splitting ready (React.lazy)
- Bundle analysis tools configured
- Gzip compression enabled

### Monitoring

- Structured logging with Pino
- Error tracking with Sentry (configurable)
- Performance metrics logging
- Database query timing
- API response time tracking

---

## 🧪 Testing

### Backend Testing

```bash
cd server && npm run test

# Results:
# ✓ auth.service.test.ts (3 tests)
# ✓ film.service.test.ts (5 tests)
# ✓ vote.service.test.ts (3 tests)
# ✓ auth.routes.test.ts (2 tests)
# ✓ film.routes.test.ts (2 tests)
# ✓ vote.routes.test.ts (2 tests)
# Total: 17 passing
```

### Frontend Testing

```bash
cd client && npm run test

# Results:
# ✓ ErrorBoundary.test.tsx (2 tests)
# ✓ useAuth.test.tsx (2 tests)
# ✓ ProtectedRoute.test.tsx (5 tests)
# ✓ useFilms.test.tsx (3 tests)
# ✓ SubmissionForm.test.tsx (3 tests)
# ✓ LoginAdmin.test.tsx (4 tests)
# Total: 19 passing
```

---

## 📚 Documentation

Each topic has comprehensive documentation:

- **[DOCKER.md](./DOCKER.md)** - Complete Docker setup guide
- **[PRODUCTION_SUMMARY.md](./PRODUCTION_SUMMARY.md)** - Everything that's been done
- **[docs/QUALITY_AND_ACCESSIBILITY.md](./docs/QUALITY_AND_ACCESSIBILITY.md)** - Accessibility & quality
- **[docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[docs/CONVENTIONS_REACT.md](./docs/CONVENTIONS_REACT.md)** - React patterns
- **[docs/CONVENTIONS_EXPRESS.md](./docs/CONVENTIONS_EXPRESS.md)** - Backend patterns

---

## 🚢 Deployment

### Local Development

```bash
docker-compose up --build
```

### Production

```bash
# Create tag
git tag v1.0.0
git push --tags

# GitHub Actions automatically:
# 1. Runs all tests
# 2. Builds Docker images
# 3. Pushes to registry
# 4. Awaits manual deployment approval

# Deployment requires:
# - Production environment variables in .env
# - Strong JWT_SECRET
# - Production database credentials
# - HTTPS configured
# - Monitoring/alerting setup
```

See [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) for full guide.

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit with conventional commits
git add .
git commit -m "feat: add jury voting dashboard"

# Run tests before pushing
npm run test

# Push and create PR
git push origin feature/your-feature

# GitHub Actions automatically:
# - Runs all tests
# - Type checks
# - Linting
# - Build verification
```

---

## 🐛 Troubleshooting

### Docker Issues

```bash
# Ports already in use
docker ps                     # See running containers
docker kill <container-id>    # Kill specific container

# Fresh start
docker-compose down -v
docker volume prune -f
docker-compose up --build
```

### Database Issues

```bash
# Reset database
docker-compose down -v
docker-compose up db
docker-compose exec db mysql -u root -p < dump.sql
```

### Test Failures

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Run with verbose output
npm run test -- --reporter=verbose
```

---

## 📞 Support

### Getting Help

1. Check documentation in `/docs`
2. Search existing GitHub issues
3. Review test failures: `npm run test`
4. Check Docker logs: `docker-compose logs -f`

### Reporting Issues

1. Include error message (full stack trace)
2. Describe reproduction steps
3. Include system info (OS, Node version, Docker version)
4. Attach logs from relevant service

---

## 📝 License

[To be determined - check LICENSE file]

---

## 👥 Contributors

- **Architecture & Planning**: [Name]
- **Backend Development**: [Name]
- **Frontend Development**: [Name]
- **Testing & QA**: [Name]
- **DevOps/Infrastructure**: [Name]

---

## 🎉 Latest Updates

### March 16, 2026 - Production Ready

- ✅ All 8 phases completed
- ✅ 36 tests passing (100%)
- ✅ TypeScript strict mode
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ Comprehensive documentation
- ✅ Accessibility standards met
- ✅ Security review complete

---

**Status**: ✅ **Production Ready** | **Last Updated**: March 16, 2026

For detailed information, see [PRODUCTION_SUMMARY.md](./PRODUCTION_SUMMARY.md)
