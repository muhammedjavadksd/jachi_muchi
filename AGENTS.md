# AGENTS.md

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4 (uses `@tailwindcss/postcss` plugin, not the classic config)
- React Router v7

## Path Aliases
`@/*` maps to `src/*`. Sub-paths: `@/components/*`, `@/hooks/*`, `@/lib/*`, `@/types/*`

## Project Structure
- `src/App.tsx` — Homepage (assembles lazy-loaded sections)
- `src/main.tsx` — Router + context providers (LoginModal, SignupModal, Wishlist, etc.)
- `src/pages/` — One folder per route/page
- `src/components/` — One folder per component; all exports via `components/index.ts`
- `src/lib/constants.ts` — All literal values (strings, arrays, objects)
- `src/types/index.ts` — All TypeScript interfaces

## Code Conventions (from `.cursor/rules/react-project-standards.mdc`)
- Each component in its own folder: `src/components/ComponentName/ComponentName.tsx`
- All literal values → `lib/constants.ts`
- All interfaces → `types/index.ts`
- Props interfaces named `ComponentNameProps`
- Wrap components with `React.memo()` + `useMemo`/`useCallback` for performance
- Use `React.lazy()` + `Suspense` for below-the-fold components
- Lazy components in App.tsx use: `lazy(() => import(...).then(m => ({ default: m.ComponentName })))`

## Key Architecture Notes
- Modal state (Login, Signup, ForgotPassword, WishlistCanvas) lives in `main.tsx` as fixed overlays, controlled by context providers
- Home page uses heavy lazy loading with `LoadingSkeleton` fallback
- Routes are defined in `main.tsx`; `*` catches all unmatched routes with `NotFoundPage`
