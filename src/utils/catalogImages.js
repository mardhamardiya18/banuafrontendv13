import mobileImages from '../assets/catalog-media.json'

// The live API remains the source of truth. Unknown/new images use the original.
export const mobileImageSrcset = url => mobileImages[url] || undefined
