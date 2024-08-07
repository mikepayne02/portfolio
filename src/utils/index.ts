export { getFormattedDate } from './date.ts'
export { generateToc, type TocItem } from './generateToc.ts'

export const truncate = (str: string, len: number) =>
  str.length > len ? str.slice(0, len) + '...' : str