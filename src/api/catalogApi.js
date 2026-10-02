/**
 * Catalog API — Public-facing endpoints (Aligned with API Contract v2).
 * 
 * Sistem kini murni e-commerce sederhana: Hanya menjual Produk dengan opsi Add-ons.
 * Seluruh kompleksitas Sistem Menu (Rules, Inclusions, Set Menu) telah DIHAPUS.
 */

// Public GETs need neither the admin Axios bundle nor authentication/CSRF headers.
// A simple CORS request also avoids an extra OPTIONS round trip on mobile.
const api = {
  async get(path, { params = {} } = {}) {
    const base = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/`
    const url = new URL(path.replace(/^\//, ''), base)
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      signal: AbortSignal.timeout(15000)
    })
    if (!response.ok) throw new Error(`Katalog gagal dimuat (${response.status})`)
    return { data: await response.json() }
  }
}

// A one-navigation request handoff: start detail data while its route chunk is
// downloading, then consume the same request in the view (no persistent cache).
let pendingDetail

// ─── Helper: normalize response ─────────────────────────
function normalizeResponse(response) {
  const res = response.data
  return {
    success: res.status === 'success' || res.success === true,
    message: res.message || '',
    data: res.data || res,
    meta: res.meta || null
  }
}

export const catalogApi = {

  prefetchProductDetail(slug) {
    const request = api.get(`/catalog/products/${encodeURIComponent(slug)}`)
    request.catch(() => {}) // The view handles and reports any failed request.
    pendingDetail = { slug, request, createdAt: Date.now() }
  },

  /**
   * Mendapatkan daftar kategori aktif.
   * GET /api/catalog/categories
   */
  async getCategories() {
    try {
      const response = await api.get('/catalog/categories')
      return normalizeResponse(response)
    } catch (error) {
      console.error('catalogApi.getCategories error:', error)
      return { success: false, data: [], message: error.message }
    }
  },

  /**
   * Mendapatkan daftar produk (Katalog).
   * GET /api/catalog/products
   * Params: category (slug)
   */
  async getProducts(categorySlug = null) {
    try {
      const params = categorySlug ? { category: categorySlug } : {}
      const response = await api.get('/catalog/products', { params })
      const result = normalizeResponse(response)
      // Visibilitas hanya untuk katalog publik; referensi produk admin tetap lengkap.
      result.data = result.data.filter(product => product.is_active === true)
      return result
    } catch (error) {
      console.error('catalogApi.getProducts error:', error)
      return { success: false, data: [], message: error.message }
    }
  },

  /**
   * Mendapatkan detail produk tunggal (Agregasi Baru).
   * GET /api/catalog/products/{slug}
   * Includes: galleries dan related_products; field internal/admin tidak dikirim.
   */
  async getProductDetail(slug) {
    try {
      const prefetched = pendingDetail?.slug === slug && Date.now() - pendingDetail.createdAt < 15000 ? pendingDetail.request : null
      pendingDetail = null
      const response = await (prefetched || api.get(`/catalog/products/${encodeURIComponent(slug)}`))
      const result = normalizeResponse(response)
      if (result.data?.related_products) {
        result.data.related_products = result.data.related_products.filter(product => product.is_active === true)
      }
      return result
    } catch (error) {
      console.error('catalogApi.getProductDetail error:', error)
      return { success: false, data: null, message: error.message }
    }
  },

  /**
   * Mendapatkan status toko (buka / tutup).
   * GET /api/catalog/store-status
   */
  async getStoreStatus() {
    try {
      const response = await api.get('/catalog/store-status')
      return normalizeResponse(response)
    } catch (error) {
      console.error('catalogApi.getStoreStatus error:', error)
      return { success: false, data: { is_store_closed: false }, message: error.message }
    }
  }
}

export default catalogApi
