import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(async ({ command, isSsrBuild }) => {
  // Array rute statis yang ingin di-index
  let dynamicRoutes = [
    '/',
    '/katalog',
    '/login',
    '/register'
  ]

  // Ambil data produk dinamis dari API untuk ditambahkan ke sitemap
  try {
    const res = command === 'build' && !isSsrBuild
      ? await fetch('https://api.banuatumpeng.com/api/catalog/products', { signal: AbortSignal.timeout(10000) })
      : null
    if (res?.ok) {
      const responseData = await res.json()
      const products = responseData.data || responseData // Tergantung format respon API
      if (Array.isArray(products)) {
        products.forEach(product => {
          if (product.slug) {
            dynamicRoutes.push(`/produk/${product.slug}`)
          }
        })
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data produk untuk sitemap:', error)
  }

  return {
    plugins: [
      vue(),
      tailwindcss(),
      {
        name: 'public-prerender-preview',
        configurePreviewServer(server) {
          server.middlewares.use((request, response, next) => {
            const url = new URL(request.url, 'http://localhost')
            const slug = url.pathname.match(/^\/produk\/([a-z0-9-]+)\/?$/)?.[1]
            if (/^\/katalog\/?$/.test(url.pathname)) request.url = `/katalog.html${url.search}`
            else if (slug && existsSync(resolve(server.config.root, server.config.build.outDir, `product-${slug}.html`))) request.url = `/product-${slug}.html${url.search}`
            else if (url.pathname !== '/' && !/\.[a-z0-9]+$/i.test(url.pathname)) request.url = `/spa.html${url.search}`
            next()
          })
        }
      },
      !isSsrBuild && Sitemap({
        hostname: 'https://banuatumpeng.com',
        dynamicRoutes,
        // Opsi ini akan menggantikan static sitemap.xml di folder public dengan yang di-generate
        generateRobotsTxt: true
      })
    ],
    build: {
      manifest: !isSsrBuild,
      // Menggunakan pengaturan default untuk menghindari konflik esbuild di Vite v8
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    }
  }
})
