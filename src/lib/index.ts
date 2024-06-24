import LightboxImage from '@/components/LightboxImage.astro'
export { getFormattedDate } from './date.ts'
export { generateToc, type TocItem } from './generateToc.ts'
export { getWebmentionsForUrl } from './webmentions.ts'
export { LightboxImage as Lightbox }

export const ogImageHeaders = {
  headers: {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
}
