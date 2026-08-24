export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024

export type PhotoReadError = 'invalid' | 'tooLarge'

export const readProfilePhoto = (file: File): Promise<{ dataUrl: string } | { error: PhotoReadError }> =>
  new Promise((resolve) => {
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type as (typeof ACCEPTED_PHOTO_TYPES)[number])) {
      resolve({ error: 'invalid' })
      return
    }

    if (file.size > MAX_PHOTO_BYTES) {
      resolve({ error: 'tooLarge' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        resolve({ error: 'invalid' })
        return
      }
      resolve({ dataUrl: result })
    }
    reader.onerror = () => resolve({ error: 'invalid' })
    reader.readAsDataURL(file)
  })
