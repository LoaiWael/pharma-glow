# AI Agent Guidelines & Architecture Rules

This document outlines the architecture, coding standards, component patterns, and feature module structure for **Pure**. All AI agents working on this codebase must adhere strictly to these rules.

---

## 1. Project Stack & Core Overview

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Class Variance Authority (`cva`) + `clsx` + `tailwind-merge`
- **Routing**: `react-router-dom` v7
- **Internationalization**: `react-intl`
- **State Management & Data Fetching**: TanStack React Query (`@tanstack/react-query`)
- **UI Components & Icons**: Base UI, Lucide React, React Icons, Shadcn patterns
- **Animations**: Motion, GSAP, OGL

---

## 2. Feature-Based Architecture Guidelines

The codebase uses a strict **feature-driven layout** located under `src/features/`. Each feature module represents a cohesive domain or capability of the application.

```
src/
├── assets/          # Static assets (images, icons, fonts)
├── components/      # Shared/Global UI components (Buttons, Inputs, Modals, etc.)
├── layout/          # Application shell layout (Header, Sidebar, Footer, Containers)
├── lib/             # Global configuration, helper utilities, clients (e.g., utils.ts)
├── i18n/            # Translations and internationalization configuration
├── pages/           # Page containers/routes importing feature components
├── router/          # Application routing definitions
└── features/        # Feature modules (Domain-driven)
    └── <feature-name>/
        ├── api/          # Feature-specific API calls, hooks, data fetching (React Query queries & mutations)
        ├── components/   # UI components used exclusively within this feature
        ├── hooks/        # Custom React hooks scoped to this feature
        ├── types/        # TypeScript types & interfaces specific to this feature
        ├── utils/        # Helper functions specific to this feature
        └── index.ts      # Public API barrel export for the feature
```

---

## 3. Data Fetching & State Management Rules (React Query)

1. **Feature-Scoped Query Hooks & Keys**:
   - Store all query options, custom `useQuery`, and `useMutation` hooks inside `src/features/<feature-name>/api/` or `src/features/<feature-name>/hooks/`.
   - Define structured, strongly-typed **Query Keys** factory objects per feature to maintain consistency and ease invalidation:
     ```ts
     // src/features/products/api/query-keys.ts
     export const productKeys = {
       all: ['products'] as const,
       lists: () => [...productKeys.all, 'list'] as const,
       list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
       details: () => [...productKeys.all, 'detail'] as const,
       detail: (id: string) => [...productKeys.details(), id] as const,
     };
     ```

2. **Global QueryClient**:
   - Instantiate and configure the global `QueryClient` inside `src/lib/react-query.ts` (or `src/lib/query-client.ts`).
   - Wrap the application tree with `QueryClientProvider` at the top level (e.g. in `src/main.tsx` or `src/App.tsx`).

3. **Server vs Local State**:
   - Use **React Query** (`useQuery`, `useMutation`, `useQueryClient`) for server state, caching, refetching, and asynchronous data operations.
   - Use React local state (`useState`, `useReducer`, Context) only for strictly UI-only transient state (e.g. modal open states, form tab selections).

---

## 4. Module Boundaries & Export Rules

1. **Feature Public API (`index.ts`)**:
   - Every feature under `src/features/<feature-name>` must expose a clean public API via its `index.ts`.
   - External code (pages, other features) **must only import from `src/features/<feature-name>`**, never from internal paths like `src/features/<feature-name>/components/InternalComponent`.

2. **Feature Interdependence**:
   - Features should remain decoupled whenever possible.
   - If Feature A requires functionality from Feature B, it must consume it through Feature B's public `index.ts`.
   - Shared concepts (such as generic components or global utility types) belong in `src/components/`, `src/lib/`, or `src/types/`.

3. **Page Layer (`src/pages/`)**:
   - Pages serve as lightweight route targets and orchestrators.
   - Pages map routes to feature containers and layout components.
   - Avoid implementing complex business or UI logic directly inside `src/pages/`.

---

## 5. Coding & Syntax Conventions

- **TypeScript**:
  - Enforce strict typing. Avoid using `any`.
  - Prefer interfaces or explicit type definitions co-located in `types/` folders.
- **Component Design**:
  - Use functional components written with arrow functions or standard `function` declarations consistently.
  - Separate state management, hooks, and UI presentation where appropriate.
  - Utilize `cn()` (from `src/lib/utils.ts`) for conditional CSS class merging.
- **Styling & Brand Colors**:
  - Use Tailwind CSS utility classes aligned with design tokens in `src/index.css`.
  - Mandatory: Always use brand color tokens (`bg-primary`, `bg-secondary`, `text-tertiary`, `bg-neutral`, etc.) for UI components. Never use hardcoded arbitrary hex colors.
- **Animations**:
  - Mandatory: Always use the `motion` package (`motion/react` or `framer-motion`) for UI animations, transitions, and micro-interactions.

---

## 6. Agent Instructions Checklist

When assigned a task:
1. **Check Latest Documentation & Package Updates**: Before implementing new features or introducing/modifying third-party dependencies, perform a web search or check for the latest updates, breaking changes, and best practices for the packages or technologies used (e.g. React 19, Tailwind CSS v4, React Router v7, Base UI, TanStack Query).
2. **Analyze Target Domain**: Determine if the change belongs to a global scope (`components/`, `lib/`) or a specific feature module (`features/<feature-name>/`).
3. **Co-locate Code**: Place new API utilities, hooks, components, and types inside the target feature directory.
4. **Export Cleanly**: Update `src/features/<feature-name>/index.ts` to export any newly created components or functions needed outside the feature.
5. **Verification**: Run `npm run build` or `npm run lint` to verify TypeScript types and lint checks after making modifications.
