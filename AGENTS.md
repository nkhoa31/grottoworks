# Repository Guidelines

## Prompt Workflow

For every prompt, prioritize locating applicable skills; if none apply, continue without one.

## Project Overview

GrottoWorks is a Vietnamese-first parish Christmas-preparation coordination SPA. It tracks seasonal work areas, tasks, volunteers, materials, purchases, donations, timesheets, approvals, and reports for four web roles: `COMMUNITY`, `LEADER`, `MATERIAL_OFFICER`, and `PARISH`. The volunteer mobile app is out of scope; this app owns the web-side approval and coordination workflows.

Use `PRODUCT.md` for product constraints: the active season is the organizing record, historical seasons stay reportable, and quantities/costs/hours must remain traceable. Mock data must be plausible Vietnamese parish data and clearly non-production.

## Architecture & Data Flow

```text
src/main.tsx
  → global CSS + i18n + MSW browser worker
  → App providers and role-guarded React Router routes
  → feature React Query hooks (src/features/<domain>/api.ts)
  → api<T>() (src/lib/api.ts)
  → MSW handlers (src/mocks/handlers.ts)
  → localStorage mock database (grotto-db-v1; seed fallback)
```

- `src/main.tsx` starts the MSW browser worker before mounting React. The current condition is `import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW !== 'off'`: development always enables MSW; non-development can disable it with `VITE_ENABLE_MSW=off`. Worker-start errors log but do not block rendering.
- `src/App.tsx` owns the module-level `QueryClient`, app providers, lazy route-page registry, root redirects, session-expiry watcher, and generated role routes. Providers are `QueryClientProvider → ToastProvider → AuthProvider → BrowserRouter`.
- `src/components/shared/nav-config.ts` is shared by sidebar navigation and generated static routes. Parameterized routes are registered separately in `DYNAMIC` in `src/App.tsx`.
- `RequireRole` (`src/routes/RequireRole.tsx`) authorizes against hydrated `useAuth().user`; it redirects anonymous users and renders `Forbidden` for a role mismatch. MSW generic CRUD handlers do **not** enforce RBAC.
- `api<T>()` adds `/api`, JSON, and bearer-token headers; its 401 event triggers `SessionWatch` to log out and redirect. It throws `ApiError` for failed responses.
- `src/lib/db.ts` is a JSON **localStorage-backed mock database**, not an in-memory or Map store. It loads `grotto-db-v1` or clones `src/mocks/seed.ts`; handlers perform CRUD, persistence, derived-field updates, and activity logging.

## Key Directories

- `src/features/` — domain implementations. Most features contain `api.ts`, `pages/`, and sometimes `components/`; this is not universal (for example, `volunteerRegs` has pages only).
- `src/components/shared/` — reusable business UI: `AppShell`, `DataTable`, `StatusTag`, `PageHeader`, `EmptyState`, `ConfirmDialog`, and role navigation.
- `src/components/ui/` — primitive shadcn-style components such as `Button`, `Dialog`, `Input`, `Card`, and `ToastProvider`.
- `src/lib/` — cross-cutting API, auth, mock DB, i18n, formatting, CSV, and class-name utilities.
- `src/mocks/` — MSW browser setup, endpoint handlers, and seed data.
- `src/types/index.ts` — shared domain interfaces and status/role unions.
- `src/locales/{vi,en}.json` — flat-key translations.
- `docs/superpowers/specs/` — approved design reference; `docs/superpowers/plans/` is planning history, not evidence of completed functionality.

## Development Commands

```bash
npm run dev       # Start Vite development server
npm run build     # TypeScript project build, then Vite production build
npm run preview   # Serve the production build
npm run test      # Run the complete Vitest suite once

# Focus a test file while iterating
npx vitest run src/features/tasks/api.test.ts
npx vitest src/features/tasks/api.test.ts
```

No `lint`, formatter, standalone typecheck, coverage, or E2E script is defined in `package.json`; do not invent one.

## Code Conventions & Common Patterns

### TypeScript, imports, and modules

- Use strict TypeScript and the `@/` alias for `src/` imports (for example, `import { api } from '@/lib/api'`).
- Keep shared domain interfaces and string unions in `src/types/index.ts`; type every feature API request with `api<T>()`.
- Name components in PascalCase, hooks as `useX`, and colocated tests as `*.test.ts` or `*.test.tsx`.

### Server state and mutations

- Treat React Query as server/mock state and use local React state for UI state; derive joins and client-side filters with `useMemo`.
- Follow the feature-hook pattern: tuple query keys, `useQuery`, `useMutation`, and invalidate every affected resource on successful mutation. Cross-resource writes must invalidate every dependent cache (for example, purchases invalidate requests, records, and materials).
- Use `select` for client-side collection filtering when appropriate, while keeping the shared resource query key.
- MSW `PATCH` is shallow. For array or related-resource updates, read-modify-write in the mutation function; see task volunteer assignment in `src/features/tasks/api.ts`.
- Material `received` and status are derived in `src/mocks/handlers.ts`; do not include them in client create/update payloads.

### UI, forms, errors, and translations

- Reuse shared components before creating feature-local replacements. `DataTable` search, filters, and pagination are client-side.
- Use React Hook Form with Zod and `zodResolver`; use translation keys as validation messages. Existing dialogs are conditionally mounted so defaults reset on reopen.
- Pages generally await `mutateAsync` in `try/catch`, show success/error with `useToast()`, and use translated text. `ApiError` supports status-aware cases, but error UI is not uniform; follow the nearest feature.
- Use `useTranslation()` and add both Vietnamese and English entries. i18n disables key separators, so translation keys are literal flat strings such as `task.create`; avoid new user-facing literals.
- Style with Tailwind and existing `grotto` theme values from `tailwind.config.ts`; reuse `cn()` from `src/lib/utils.ts`, the `rounded-grotto` shape, and reduced-motion-aware CSS in `src/index.css`.

### Routes and pages

When adding a navigable page, update the relevant `NavItem` in `src/components/shared/nav-config.ts`, add its lazy import and `PAGES` entry in `src/App.tsx`, and add a `DYNAMIC` entry for parameterized paths. Some static routes intentionally resolve to `Placeholder`; do not assume every navigation item has a real page.

## Important Files

- `src/main.tsx` — startup, i18n import, and MSW bootstrapping.
- `src/App.tsx` — providers, auth/session redirects, lazy pages, and role routes.
- `src/lib/auth.tsx` — authentication context and `grotto-token` persistence.
- `src/lib/api.ts` — the application fetch wrapper and `ApiError`.
- `src/lib/db.ts` / `src/mocks/handlers.ts` — persisted mock data and API behavior.
- `src/components/shared/nav-config.ts` — role navigation and static route source.
- `src/routes/RequireRole.tsx` — route access boundary.
- `src/types/index.ts` — domain model.
- `vite.config.ts` / `tailwind.config.ts` — tooling, alias, tests, and visual theme.
- `PRODUCT.md` — repository-readable product summary; it identifies the capstone register DOCX as the product source of truth.

## Runtime/Tooling Preferences

- Use **npm**: `package-lock.json` is present (lockfile v3); no Bun, pnpm, or Yarn configuration exists.
- Package is ESM (`"type": "module"`) and uses Vite 6, React 19, TypeScript 5.7, Tailwind 3, MSW 2, React Router 7, and React Query 5.
- `package.json` does not pin Node through `engines`. The resolved React Router version requires Node 20+, so use Node 20+ unless the project later adds an explicit engine constraint.
- The `@` alias is configured in both `vite.config.ts` and `tsconfig.app.json`.
- Do not edit generated `public/mockServiceWorker.js`.

## Testing & QA

- Tests use Vitest, jsdom, React Testing Library, and `@testing-library/user-event`; configuration is in `vite.config.ts`.
- `src/test-setup.ts` imports i18n, runs RTL cleanup, supplies a conditional `ResizeObserver`, and forces reduced-motion `matchMedia` behavior.
- Vitest has `passWithNoTests: true` and a 15-second default timeout. Do not assume the normal five-second default.
- API-backed tests commonly create a local `setupServer(...handlers)` from `msw/node`, listen with `onUnhandledRequest: 'error'`, reset the database in `beforeEach`, and close the server after the file. This is not a universal requirement for purely UI tests.
- `resetDb()` clears `localStorage['grotto-db-v1']`. Tests that need a session must set/remove `grotto-token` explicitly.
- Test observable behavior with accessible queries and async RTL helpers. Use `location.origin + '/api/…'` for deliberate raw-fetch MSW tests because the test fetch implementation does not accept relative URLs.
- No coverage threshold or browser E2E runner is currently configured. For a behavior change, run the full affected test module, then `npm run test` before reporting completion.
