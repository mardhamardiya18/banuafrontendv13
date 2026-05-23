import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig(async () => {
  // Array rute statis yang ingin di-index
  let dynamicRoutes = [
    '/',
    '/katalog',
    '/login',
    '/register'
  ]

  // Ambil data produk dinamis dari API untuk ditambahkan ke sitemap
  try {
    const res = await fetch('https://api.banuatumpeng.com/api/catalog/products')
    if (res.ok) {
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
      Sitemap({
        hostname: 'https://banuatumpeng.com',
        dynamicRoutes,
        // Opsi ini akan menggantikan static sitemap.xml di folder public dengan yang di-generate
        generateRobotsTxt: true
      })
    ],
    build: {
      // Menggunakan pengaturan default untuk menghindari konflik esbuild di Vite v8
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) {
              return 'vendor-vue'
            }
          }
        }
      }
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    }
  }
})
