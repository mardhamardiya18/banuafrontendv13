import { createServer as createHttpServer } from 'node:http'
import { createSecureServer } from 'node:http2'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import selfsigned from 'selfsigned'

export const productionOrigin = 'https://www.banuatumpeng.com'
export const localOriginArgs = ['--host-resolver-rules=MAP www.banuatumpeng.com 127.0.0.1:4173', '--ignore-certificate-errors']

// DNS is overridden only inside the disposable test browser. No hosts-file,
// certificate-store, production-server or public DNS configuration is changed.
export async function serveBuild({ directory = 'dist', https = false } = {}) {
  const root = resolve(directory)
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' }
  const cache = new Map()
  const handler = async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      let file = resolve(root, '.' + pathname)
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return }
      if (!(await stat(file).catch(() => null))?.isFile()) {
        const path = pathname.replace(/\/$/, '') || '/'
        const productSlug = path.match(/^\/produk\/([a-z0-9-]+)$/)?.[1]
        const fallback = path === '/' ? 'index.html' : path === '/katalog' ? 'katalog.html' : productSlug ? `product-${productSlug}.html` : 'spa.html'
        const spa = await stat(resolve(root, 'spa.html')).catch(() => null) ? 'spa.html' : 'index.html'
        file = resolve(root, (await stat(resolve(root, fallback)).catch(() => null)) ? fallback : spa)
      }
      if (!cache.has(file)) cache.set(file, gzipSync(await readFile(file)))
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Content-Encoding': 'gzip', 'Cache-Control': 'no-cache' })
      res.end(cache.get(file))
    } catch { res.writeHead(500).end() }
  }
  let server
  if (https) {
    const pem = await selfsigned.generate([{ name: 'commonName', value: 'www.banuatumpeng.com' }], { days: 1, keySize: 2048 })
    server = createSecureServer({ key: pem.private, cert: pem.cert, allowHTTP1: true }, handler)
  } else server = createHttpServer(handler)
  await new Promise(done => server.listen(4173, '127.0.0.1', done))
  return server
}
