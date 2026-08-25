export const contactKeys = {
  all: ['contact'] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
}
