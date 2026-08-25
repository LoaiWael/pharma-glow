---
name: api-wiring
description: >-
  Wires Pure storefront features to the Laravel catalog/auth API using the shared
  fetch client, feature api/ modules, React Query keys/hooks, response types,
  mock removal, and loading/empty UI. Use when connecting Postman endpoints,
  replacing mocks with HTTP, adding feature APIs, or wiring products, categories,
  product-types, auth, cart, or account.
---

# Pure API Wiring

Follow this skill whenever replacing mocks with real HTTP or adding a new API-backed feature. Keep the same stack and folder rules as [AGENTS.md](../../../AGENTS.md).

---

## 1. Shared HTTP client (mandatory)

**Always** use [`src/lib/http.ts`](../../../src/lib/http.ts). Do **not** add axios, ky, or a second client.

- Base URL: `import.meta.env.VITE_API_BASE_URL` (already in `.env` / `.env.example`)
- Paths: `/api/v1/...`
- Helpers: `api.get/post/put/patch/delete`, `ApiError`, `ApiEnvelope<T>`, `apiData<T>()`
- JSON + `Accept` / `Content-Type`; optional `token` → `Authorization: Bearer …`
- Guest catalog calls: no token

```ts
import { api, type ApiEnvelope } from '@/lib/http'

const envelope = await api.get<ApiEnvelope<MyType[]>>('/api/v1/resource', {
  query: { per_page: 24 },
})
return envelope.data
```

---

## 2. Feature layout

Place API code in the owning feature (or create one):

```
src/features/<feature>/
  api/
    <resource>.ts      # fetch + normalize (pure functions)
    query-keys.ts      # typed key factory
    use-<resource>.ts  # useQuery / useMutation
  types/               # match API JSON (camelCase as returned)
  components/          # empty + skeleton UI when wiring lists
  index.ts             # public barrel only
```

External imports **only** from `@/features/<feature>` via `index.ts`.

---

## 3. Types from the real payload

Copy shapes from Postman / live JSON. Prefer exact field names the API returns (`sortOrder`, `productsCount`, `productType`).

- Nullable media: `image: string | null`
- Dashboard-managed lists (categories, product-types): keep types open (`slug: string`) so admin changes do not require code edits
- App UI types may extend API types (e.g. `Product.slug`, normalized `image` fallback)

Example catalog types:

```ts
// categories
{ id, name, slug, description, sortOrder, image, productsCount }

// product-types
{ id, name, slug, sortOrder }

// products (list/detail) — Pure-shaped camelCase fields from API
```

---

## 4. Query keys + hooks

```ts
export const thingKeys = {
  all: ['things'] as const,
  lists: () => [...thingKeys.all, 'list'] as const,
  list: (filters: object) => [...thingKeys.lists(), filters] as const,
  details: () => [...thingKeys.all, 'detail'] as const,
  detail: (id: string) => [...thingKeys.details(), id] as const,
}
```

```ts
export const useThings = (filters = {}) =>
  useQuery({
    queryKey: thingKeys.list(filters),
    queryFn: () => fetchThings(filters),
    placeholderData: (prev) => prev,
  })
```

- Map UI filters → API query params (`product_type`, `min_price`, `min_rating`, `badge`, `category`, `q`, `sort`, `per_page`)
- Detail by **slug** when the route/API uses slugs
- No dedicated “related” endpoint → list by `category` and exclude current client-side

---

## 5. Normalize + remove mocks

1. `normalizeX(raw)` → app model (fallback images, optional arrays)
2. Swap mock `queryFn`s for HTTP
3. **Delete** unused mock data files and barrel re-exports
4. Update dependents (home grids, enrichers) to call the new fetchers/hooks
5. Prefer brand logo (`@/assets/logo.webp`) for null category images; mark logo fallbacks for rounded UI

---

## 6. Loading + empty UI

When wiring list/detail screens:

| State | Pattern |
|-------|---------|
| `isPending` | Layout-matching skeletons (`ProductGridSkeleton`, tile grids); brand pulse `bg-primary-100` |
| Transitions | `AnimatePresence` + `motion` enter/exit (`mode="wait"` when swapping skeleton ↔ content ↔ empty) |
| Empty success | Cart-style empty state (kicker, headline, body, secondary CTA) — see `ProductEmptyState` / `CartEmptyState` |

Do **not** leave bare text-only empty boxes when wiring catalog surfaces.

---

## 7. Hybrid curated + API (home categories)

When API data overlaps dedicated routes:

- Keep curated tiles for fixed pages (`/skincare`, `/bodycare`, `/offers`, `/reviews`, new arrivals → `/products?badge=new`)
- Skip API slugs that already have dedicated pages (`skin_care`, `body_care`)
- Append remaining API categories → `/products?category={slug}`
- Labels: i18n `titleKey` for curated; API `name` for dynamic tiles

---

## 8. Dynamic filters

Filters driven by dashboard APIs (e.g. `GET /api/v1/product-types`):

- Fetch via feature hook (`useProductTypes`)
- Render API `name` / `slug` (sorted by `sortOrder`)
- Avoid hardcoding type chip lists; optional page allowlists may filter API slugs
- Show small chip skeletons while types load

---

## 9. Checklist

```
- [ ] Uses src/lib/http.ts + VITE_API_BASE_URL
- [ ] Types match live/Postman payload
- [ ] api/*.ts fetch + normalize; query-keys; use* hooks
- [ ] Exported from feature index.ts
- [ ] Mocks removed; consumers updated
- [ ] Skeletons + empty states with motion where lists load
- [ ] npm run build / tsc clean
```

## Reference implementations

- HTTP: `src/lib/http.ts`
- Categories: `src/features/categories/`
- Products + types: `src/features/products/api/`
- Home merge: `src/features/home/api/use-home-categories.ts`
- Empty/skeleton: `ProductEmptyState`, `ProductSkeletons`, `CartEmptyState`
