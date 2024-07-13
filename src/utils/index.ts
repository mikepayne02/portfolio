import LightboxImage from '@/components/blog/LightboxImage.astro'
export { getFormattedDate } from './date.ts'
export { generateToc, type TocItem } from './generateToc.ts'
export { LightboxImage as Lightbox }

export const truncate = (str: string, len: number) =>
  str.length > len ? str.slice(0, len) + '...' : str
