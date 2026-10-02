import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const apiBase = process.env.CATALOG_API_URL || 'https://api.banuatumpeng.com/api/catalog'
const manifestPath = 'src/assets/catalog-media.json'
const previousManifest = JSON.parse(await readFile(manifestPath, 'utf8').catch(() => '{}'))
const manifest = {}
const getJSON = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  return response.json()
}
try {
  const response = await getJSON(`${apiBase}/products`)
  const products = response.data || response
  const urls = new Set(products.filter(p => p.is_active === true).map(p => p.thumbnail).filter(Boolean))
  const productHints = {}
  // Product galleries are public media too; no price/availability is persisted.
  for (const product of products.filter(p => p.is_active === true)) {
    try {
      const detail = await getJSON(`${apiBase}/products/${encodeURIComponent(product.slug)}`)
      for (const image of detail.data?.galleries || []) if (image.image_url) urls.add(image.image_url)
      const firstImage = detail.data?.galleries?.[0]?.image_url || product.thumbnail
      if (firstImage) productHints[product.slug] = firstImage
    } catch (error) { console.warn(`Gallery skipped: ${error.message}`) }
  }
  await mkdir('public/catalog-media', { recursive: true })
  let generated = 0
  for (const url of urls) {
    try {
      // An entry is keyed by its original URL, so new API uploads automatically
      // fall back to the original until the next assets:catalog run.
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const input = Buffer.from(await response.arrayBuffer())
      const hash = createHash('sha256').update(input).digest('hex').slice(0, 16)
      const { width } = await sharp(input).metadata()
      // Two mobile candidates cover cards and full-width photos without shipping
      // four copies of every catalog image. Desktop keeps the original API URL.
      const widths = [...new Set([320, 768].map(size => Math.min(size, width)))]
      const sources = []
      for (const size of widths) {
        const name = `${hash}-q75-${size}.webp`
        await sharp(input).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: 75, effort: 6 }).toFile(`public/catalog-media/${name}`)
        sources.push(`/catalog-media/${name} ${size}w`)
      }
      manifest[url] = sources.join(', ')
      generated++
    } catch (error) {
      if (previousManifest[url]) manifest[url] = previousManifest[url]
      console.warn(`Image retained/skipped (${url}): ${error.message}`)
    }
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  await writeFile('src/assets/product-image-hints.json', JSON.stringify(productHints, null, 2) + '\n')
  // Only remove generated files absent from the committed manifest. Preserve
  // previous entries if a download failed, and never touch unrelated files.
  const used = new Set(Object.values(manifest).flatMap(srcset => srcset.split(',').map(source => source.trim().split(' ')[0].split('/').pop())))
  for (const name of await readdir('public/catalog-media')) {
    if (/^[a-f0-9]{16}-(?:q75-)?\d+\.webp$/.test(name) && !used.has(name)) await unlink(`public/catalog-media/${name}`)
  }
  console.log(`Prepared responsive copies of ${generated} public catalog images.`)
} catch (error) {
  // A transient API failure must not break builds or delete existing variants.
  console.warn(`Catalog media retained: ${error.message}`)
}
