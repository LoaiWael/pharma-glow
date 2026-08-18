export const homeKeys = {
  all: ['home'] as const,
  banners: () => [...homeKeys.all, 'banners'] as const,
  categories: () => [...homeKeys.all, 'categories'] as const,
}
