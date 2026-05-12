/**
 * Catalog API — Public-facing endpoints (Aligned with API Contract v2).
 * 
 * Sistem kini murni e-commerce sederhana: Hanya menjual Produk dengan opsi Add-ons.
 * Seluruh kompleksitas Sistem Menu (Rules, Inclusions, Set Menu) telah DIHAPUS.
 */

import api from '../utils/axios'

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
      return normalizeResponse(response)
    } catch (error) {
      console.error('catalogApi.getProducts error:', error)
      return { success: false, data: [], message: error.message }
    }
  },

  /**
   * Mendapatkan detail produk tunggal (Agregasi Baru).
   * GET /api/catalog/products/{slug}
   * Includes: galleries, add_ons, related_products.
   */
  async getProductDetail(slug) {
    try {
      const response = await api.get(`/catalog/products/${slug}`)
      return normalizeResponse(response)
    } catch (error) {
      console.error('catalogApi.getProductDetail error:', error)
      return { success: false, data: null, message: error.message }
    }
  }
}

export default catalogApi
