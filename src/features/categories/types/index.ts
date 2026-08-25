export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  sortOrder: number
  image: string | null
  productsCount: number
}
