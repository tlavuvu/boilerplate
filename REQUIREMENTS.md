### Boilerplate Package — Requirements Document

#### 1) Overview
- **Goal**: Create an npm package/CLI that scaffolds a production-ready Next.js boilerplate with basic authentication, role-based access control (RBAC), and MySQL support.
- **CLI Name**: `boilerplate`
- **Primary Command**: `boilerplate create <app-name>`
- **Branch Strategy**: Versioned on `main` branch; semantic versioning for package releases.

#### 2) Scope
- **In scope**
  - CLI to generate a Next.js app named from user input.
  - Basic auth module (email/password), sessions, and RBAC (e.g., `ADMIN`, `USER`).
  - MySQL database integration with migrations.
  - Config scaffolding for `.env`, linting, formatting, and strict TypeScript.
  - Minimal example pages and APIs for auth.
  - CI template and Git hooks.
  - `.cursor/` developer-assistant context folder scaffolding (hidden).
- **Out of scope (initial)**
  - OAuth/social login, SSO.
  - Multi-tenant support.
  - Advanced domain modules (billing, notifications).
  - Non-MySQL DBs (may be pluggable later).

#### 3) CLI Design
- **Command**: `boilerplate create <app-name> [options]`
- **Options**
  - `--pkg-manager <npm|pnpm|yarn|bun>` default autodetect.
  - `--skip-install` to skip dependency install.
  - `--no-git` to skip git init.
  - `--db-url <mysql-connection-string>` (optional; otherwise instructed in README).
  - `--use-app-router` default true (Next.js App Router).
  - `--with-example` default true (seed users/pages).
- **Behavior**
  - Creates directory `<app-name>` and initializes Next.js app.
  - Sets project name/metadata.
  - Copies template files; runs `npm i` unless skipped.
  - Initializes git repo on first commit; pushes to `main` optional.

#### 4) Generated Project Structure
- `app/` (App Router): `layout.tsx`, `page.tsx`, `(auth)/login/page.tsx`, `(dashboard)/page.tsx`
- `components/`: UI primitives, `AuthProvider`, `Navbar`, `ProtectedRoute`
- `lib/`: `auth/` (RBAC utilities, session), `db/` (Prisma client), `validators/`
- `app/api/` routes: `auth/login`, `auth/logout`, `auth/register`, `auth/me`
- `prisma/`: `schema.prisma`, `migrations/`
- `scripts/`: `postinstall`, `seed.ts`
- `tests/`: unit/integration stubs
- `.cursor/`: hidden folder with `context.json` and `rules/` pre-populated
- `.env.example`, `.eslintrc`, `.prettierrc`, `tsconfig.json`, `next.config.js`, `README.md`

#### 5) Authentication & RBAC
- **Auth type**: Email/password with salted hashing (bcrypt).
- **Sessions**: JWT stored in HTTP-only cookies.
- **RBAC**:
  - Roles: `ADMIN`, `USER`.
  - Middleware/guard helpers to protect routes and APIs.
  - Example: Admin-only dashboard section and API guard.
- **APIs**
  - `POST /api/auth/register`: create user; enforce email uniqueness.
  - `POST /api/auth/login`: authenticate, set cookie.
  - `POST /api/auth/logout`: clear cookie.
  - `GET /api/auth/me`: return current user and roles.
- **Client**
  - `useAuth()` hook.
  - `ProtectedRoute` component.
  - Example login/register pages.

#### 6) Database & Models (MySQL)
- **Engine**: MySQL
- **ORM**: Prisma
- **Models**
  - `User`: id, email (unique), passwordHash, createdAt, updatedAt
  - `Role`: id, name (enum or table), createdAt
  - `UserRole`: userId, roleId (many-to-many)
  - `Session` (optional if storing JWT blacklist/refresh)
- **Migrations**: Auto-generated via Prisma.
- **Seeding**: Creates an admin user and basic roles.

#### 7) Security & Best Practices
- Password hashing with bcrypt (cost tuned).
- HTTP-only, Secure cookies; `SameSite=Lax`.
- Rate limiting on auth endpoints.
- Input validation with Zod for all auth forms/APIs.
- Environment variable validation at startup.
- Security headers via Next middleware.

#### 8) Configuration & DX
- **TypeScript**: Strict mode enabled.
- **ESLint/Prettier**: Standardized config.
- **Husky + lint-staged**: Pre-commit checks.
- **Testing**: Vitest/Jest + Testing Library; minimal auth tests scaffolded.
- **Env**
  - `.env.example` includes `DATABASE_URL`, `JWT_SECRET`.
  - README documents setup:
    - `cp .env.example .env`
    - Set `DATABASE_URL` to MySQL instance
    - `npx prisma migrate dev` then `npm run dev`
- **Assistant Context**
  - Scaffold `.cursor/context.json` and `.cursor/rules/` with sensible defaults; allow override via CLI flag `--no-cursor` to skip.

#### 9) Versioning & Branching
- **Repo**: Default branch `main`.
- **Package versioning**: Semantic Versioning (SemVer).
- **Release**: Git tag from `main`, changelog generated (Conventional Commits).
- **Templates**: Keep template version aligned to package version; include `BOILERPLATE_VERSION` in scaffolded README.

#### 10) CI/CD Templates
- **GitHub Actions**:
  - `ci.yml`: install, typecheck, lint, test, build.
  - `release.yml`: on tag push, publish package.
- **Pre-commit**: lint + typecheck.

#### 11) Telemetry & Analytics (optional, disabled by default)
- Anonymous usage ping with `--telemetry` opt-in flag.
- Config file `.boilerplaterc` to store preferences.

#### 12) Non-Functional Requirements
- **Performance**: Scaffold completes in <60s on typical broadband.
- **Compatibility**: Node 18+.
- **Maintainability**: Clear module boundaries; minimal coupling.
- **Documentation**: Generated app README + inline docs.

#### 13) Trade-offs
- **Prisma + MySQL**: Fast to ship and maintain; ties to Prisma schema. Alternative is Knex or Drizzle for more SQL-first control.
- **JWT cookies vs. server sessions**: Cookies are simple, scalable; server sessions (e.g., Redis) add revocation but more infra.
- **App Router**: Modern Next features but some ecosystem lag vs. Pages Router.

#### 14) Acceptance Criteria
- Running `boilerplate create test-app` creates a new Next.js app named `test-app`.
- Database models and migrations run successfully against MySQL.
- Register/login/logout endpoints work; cookies set/cleared correctly.
- RBAC guards prevent `USER` from accessing admin route/API.
- The generated project contains `.cursor/context.json` and `.cursor/rules/`.
- Lint, typecheck, tests, and build succeed out of the box.
- Version tags created from `main` and reflected in generated README.

#### 15) Milestones
- M1: CLI skeleton + template copying + options parsing.
- M2: Next.js template with TypeScript, linting, prettier, husky.
- M3: Prisma schema, MySQL integration, migrations, seed.
- M4: Auth APIs, client hooks/components, RBAC guards, tests.
- M5: CI templates, README, release flow, versioning from `main`.
