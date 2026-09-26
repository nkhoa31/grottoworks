# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: GrottoWorks — Parish Christmas Coordination SPA

Vietnamese-first SPA for 4 web roles: `PARISH` (`/parish/*`), `COMMUNITY` (`/community/*`), `LEADER` (`/leader/*`), `MATERIAL_OFFICER` (`/material-officer/*`). Volunteer mobile app is out of scope. Active season is the spine; history stays queryable. `PRODUCT.md` is the product source of truth; `ORCHESTRATION.md` defines multi-agent workflow when active.

## Commands

```bash
npm run dev        # Vite dev server (MSW auto-enabled in DEV)
npm run build      # tsc -b + vite build
npm run preview    # Serve production build
npm run test       # Vitest run once (28 suites / ~83 tests, timeout 15s)
npx vitest run src/features/season/pages/SeasonListPage.test.tsx  # Single file
npx vitest src/features/tasks/api.test.ts                         # Watch mode single file
npx tsc --noEmit   # Typecheck only (no script alias; use before commit)
```

No `lint`, `format`, `coverage`, or E2E script in `package.json` — do not invent one.

## Git Workflow — nhánh `khoa` / `dev` / `main`

- **Tạo nhánh**: `dev` và `khoa` đều tách từ `main` (`git checkout main && git checkout -b dev && git push -u origin dev`).
- **Luồng đẩy**: code mới chỉ push lên `khoa`. Mở PR `khoa → dev`, CI/test pass trên `dev` mới merge `dev → main`. Không push trực tiếp lên `dev` hay `main`.
- Nhánh làm việc hằng ngày là `khoa`; `dev` là nhánh tích hợp kiểm lỗi; `main` chỉ nhận merge từ `dev` khi đã ổn định.

## Git & Push Attribution

- Author/committer: `nkhoa31 <276342518+nkhoa31@users.noreply.github.com>`.
- **Do NOT add `Co-Authored-By: Claude …` or any Claude attribution** to commit messages or PR descriptions when pushing. User explicitly forbids it. Keep commits as plain `nkhoa31` authorship.

## Architecture

```
src/main.tsx  → MSW worker (DEV || VITE_ENABLE_MSW !== 'off') → React mount
src/App.tsx   → QueryClient + ToastProvider + AuthProvider + BrowserRouter
              → lazy PAGES registry + DYNAMIC param routes + roleRoutes()
              → shared NAV drives both sidebar and static routes
src/features/<domain>/api.ts → api<T>() → MSW handlers → localStorage mock DB
```

- **MSW + localStorage mock DB**: `src/lib/db.ts` (`grotto-db-v1`, fallback `src/mocks/seed.ts`). Handlers in `src/mocks/handlers.ts` do CRUD + persistence + derived fields + `activityLogs`. `public/mockServiceWorker.js` is generated — do not edit.
- **Routing**: `src/App.tsx` owns `QueryClient`, providers, `PAGES` (static paths from `nav-config.ts`) and `DYNAMIC` (param routes per role). `RequireRole` (`src/routes/RequireRole.tsx`) guards; MSW CRUD handlers do NOT enforce RBAC. `SessionWatch` listens for `grotto:unauthorized` from `src/lib/api.ts` (401 + token → logout → `/login`).
- **Nav source of truth**: `src/components/shared/nav-config.ts` — adding a page requires `NAV` entry + lazy import + `PAGES` entry (+ `DYNAMIC` if parameterized). Placeholder routes render `Placeholder` intentionally.
- **State**: React Query for server/mock state (tuple keys, `invalidateQueries` on mutate, cross-resource invalidation e.g. purchases → requests+records+materials). Local React state for UI; `useMemo` for joins/filters. `PATCH` is shallow — read-modify-write in mutation for array/related updates. Material `received`/`status` derived server-side, not sent from client.

## Conventions

- Alias `@/` → `src/` (Vite + tsconfig). Strict TS, PascalCase components, `useX` hooks, colocated `*.test.tsx`.
- Forms: `react-hook-form` + `zod` + `zodResolver`; validation messages are i18n keys. Dialogs conditionally mounted so defaults reset on reopen.
- i18n: flat keys in `src/locales/{vi,en}.json` (no separator), `useTranslation()`. Add both `vi` + `en` entries; pages toast via `useToast()` after `mutateAsync`.
- Styling: Tailwind with `grotto` tokens (`tailwind.config.ts`, `src/index.css` — Hang Đá & Rơm: `#EFE4CC`/`#FBF6E9`/`#3E2F23`/`#B96A3B` etc). Use `cn()` (`src/lib/utils.ts`), `rounded-grotto`, reduced-motion CSS.
- Types: shared domain in `src/types/index.ts` (`Role`, `Season`, `WorkArea`, `SKILLS`, …); type every API call `api<T>()`.

## Key Paths

`src/main.tsx`, `src/App.tsx`, `src/lib/auth.tsx` (`grotto-token`), `src/lib/api.ts` (`ApiError`), `src/lib/db.ts`, `src/mocks/handlers.ts`, `src/components/shared/nav-config.ts`, `src/types/index.ts`, `vite.config.ts`/`tailwind.config.ts`.

## Tooling

npm (lockfile v3), ESM, Vite 6, React 19, TS 5.7, Tailwind 3, MSW 2, React Router 7, React Query 5, Node 20+.

## Testing

Vitest + jsdom + Testing Library + `msw/node`. Config in `vite.config.ts` (`passWithNoTests: true`, `testTimeout: 15_000`). `src/test-setup.ts` imports i18n, RTL cleanup, `ResizeObserver` shim, forced reduced-motion `matchMedia`. `resetDb()` clears `localStorage['grotto-db-v1']`; auth tests must set `grotto-token` explicitly. Use `location.origin + '/api/…'` for raw-fetch MSW tests. No coverage/E2E runner configured — run affected module + `npm run test` before done.
