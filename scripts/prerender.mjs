import { readFile, writeFile } from 'node:fs/promises'
import { render } from '../dist-ssr/entry-server.js'

const template = await readFile('dist/index.html', 'utf8')
const media = JSON.parse(await readFile('src/assets/catalog-media.json', 'utf8'))
const hints = JSON.parse(await readFile('src/assets/product-image-hints.json', 'utf8'))
const mobileHints = Object.fromEntries(Object.entries(hints).filter(([, src]) => media[src]).map(([slug, src]) => [slug, media[src]]))
// Product data stays live. This small mobile-only hint lets the browser discover
// the first photo before downloading Vue, the route chunk and the API response.
const imageHintScript = `<script>(()=>{if(!location.pathname.startsWith('/produk/')||!matchMedia('(max-width: 767px)').matches)return;let slug;try{slug=decodeURIComponent(location.pathname.split('/')[2])}catch{return}const images=${JSON.stringify(mobileHints).replace(/</g, '\\u003c')}[slug];if(!images)return;const link=document.createElement('link');link.rel='preload';link.as='image';link.imageSrcset=images;link.imageSizes='calc(100vw - 44px)';link.fetchPriority='high';document.head.append(link)})()</script>`
await writeFile('dist/spa.html', template.replace('<!-- Primary Meta Tags -->', imageHintScript + '\n    <!-- Primary Meta Tags -->'))
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
const productSlugs = Object.keys(mobileHints).filter(slug => /^[a-z0-9-]+$/.test(slug))
const pages = [
  ['/', 'HomeView', 'index.html', 'Pesan Tumpeng'],
  ['/katalog', 'CatalogView', 'katalog.html', 'Temukan Menu Favoritmu'],
  ...productSlugs.map(slug => [`/produk/${slug}`, 'ProductDetailView', `product-${slug}.html`, 'gallery-stage'])
]
for (const [url, view, output, expected] of pages) {
  const markup = await render(url)
  if (!markup.includes(expected)) throw new Error(`Prerender failed: ${url}`)
  const assets = new Set()
  const visited = new Set()
  function collect(key) {
    if (visited.has(key)) return
    visited.add(key)
    const chunk = manifest[key]
    if (!chunk) return
    for (const css of chunk.css || []) assets.add(css)
    for (const dependency of chunk.imports || []) collect(dependency)
  }
  const key = `src/views/${view}.vue`
  collect(key)
  let html = template
  // Discover the route's CSS and JavaScript from HTML, not after router execution.
  const links = [...assets].filter(css => !html.includes(`/${css}`)).map(css => `<link rel="stylesheet" href="/${css}" crossorigin>`).join('')
  html = html.replace('</head>', `${links}<link rel="modulepreload" href="/${manifest[key].file}" crossorigin></head>`)
  html = html.replace('<script type="module"', '<script fetchpriority="low" type="module"')
  await writeFile(`dist/${output}`, html.replace('<div id="app"></div>', `<div id="app" data-prerendered="${url}">${markup}</div>`))
}
// Exact routes preserve the SPA fallback for newly created/unknown product slugs.
const vercel = JSON.parse(await readFile('vercel.json', 'utf8'))
vercel.rewrites = [
  ...productSlugs.map(slug => ({ source: `/produk/${slug}`, destination: `/product-${slug}.html` })),
  ...vercel.rewrites.filter(rule => !rule.source.startsWith('/produk/'))
]
for (const path of ['vercel.json', 'public/vercel.json', 'dist/vercel.json']) await writeFile(path, JSON.stringify(vercel, null, 2) + '\n')
console.log(`Prerendered home, catalog and ${productSlugs.length} product shells; live prices are never embedded.`)
