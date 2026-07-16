/**
 * API Service — connects to Laravel REST API (banuabackend-v13).
 * 
 * Every method returns the SAME interface as the old mockService:
 *   { status: 'success' | 'error', data: ..., meta?: ... }
 * This ensures zero changes needed in the Vue components.
 * 
 * Endpoint mapping based on Postman documentation:
 * https://documenter.getpostman.com/view/13942551/2sBXqKoL4F
 */

import api from '../utils/axios'

// ─── Helper: normalize Laravel paginated response ──────
function normalizePaginated(response) {
  const res = response.data
  // Laravel sering membungkus data di dalam 'data'
  const items = res.data || []
  
  // Deteksi metadata (Laravel bisa menaruhnya di root atau di dalam objek 'meta')
  const metaSource = res.meta || res

  return {
    status: 'success',
    data: Array.isArray(items) ? items : (items.data || []),
    meta: {
      current_page: metaSource.current_page || 1,
      per_page: metaSource.per_page || 10,
      total: metaSource.total || (Array.isArray(items) ? items.length : 0),
      last_page: metaSource.last_page || 1
    }
  }
}

// ─── Helper: normalize single item response ────────────
function normalizeItem(response) {
  const res = response.data
  return {
    status: 'success',
    data: res.data || res
  }
}

// ─── Helper: normalize simple list response ─────────────
function normalizeList(response) {
  const res = response.data
  return {
    status: 'success',
    data: res.data || res
  }
}

// ─── Helper: build FormData for file uploads ────────────
function toFormData(payload, method = null) {
  const fd = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    // JIKA field adalah 'thumbnail' atau 'image_url' dan isinya adalah STRING
    // MAKA jangan masukkan ke FormData (karena itu adalah URL gambar lama)
    if ((key === 'thumbnail' || key === 'image_url') && typeof value === 'string') {
      return
    }

    if (value !== null && value !== undefined) {
      // Konversi boolean ke 1/0 agar aman dikirim via FormData ke Laravel
      const finalValue = typeof value === 'boolean' ? (value ? 1 : 0) : value
      fd.append(key, finalValue)
    } else {
      // Jika null/undefined, kirim string kosong agar ditangani middleware Laravel
      fd.append(key, '')
    }
  })
  if (method) fd.append('_method', method)
  return fd
}

// ═══════════════════════════════════════════════════════
// Dashboard API
// ═══════════════════════════════════════════════════════
export const dashboardApi = {
  async getData() {
    try {
      const response = await api.get('/admin/dashboard')
      return normalizeItem(response)
    } catch (error) {
      console.error('Dashboard data error:', error)
      return { status: 'error', data: null }
    }
  }
}

// ═══════════════════════════════════════════════════════
// Store Status API — /api/admin/store-status
// ═══════════════════════════════════════════════════════
export const storeStatusApi = {
  async getStatus() {
    try {
      const response = await api.get('/admin/store-status')
      return normalizeItem(response)
    } catch (error) {
      console.error('Store status get error:', error)
      return { status: 'error', data: { is_store_closed: false } }
    }
  },
  async updateStatus(isClosed) {
    try {
      const response = await api.post('/admin/store-status', { is_store_closed: isClosed })
      return normalizeItem(response)
    } catch (error) {
      console.error('Store status update error:', error)
      return { status: 'error', message: error.response?.data?.message || 'Gagal mengubah status toko' }
    }
  }
}

// ═══════════════════════════════════════════════════════
// Category API — /api/admin/categories
// ═══════════════════════════════════════════════════════
export const categoryApi = {
  async getAll(page = 1, perPage = 10, search = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      const response = await api.get('/admin/categories/paginated', { params })
      return normalizePaginated(response)
    } catch (error) {
      console.error('Category getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/admin/categories/${id}`)
      return normalizeItem(response)
    } catch (error) {
      return { status: 'error', message: 'Not found' }
    }
  },
  async create(payload) {
    const fd = toFormData(payload)
    const response = await api.post('/admin/categories', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async update(id, payload) {
    const fd = toFormData(payload, 'PUT')
    const response = await api.post(`/admin/categories/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async delete(id) {
    await api.delete(`/admin/categories/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Product API — /api/admin/products
// ═══════════════════════════════════════════════════════
export const productApi = {
  async getAll(page = 1, perPage = 10, search = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      const response = await api.get('/admin/products/paginated', { params })
      return normalizePaginated(response)
    } catch (error) {
      console.error('Product getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/admin/products/${id}`)
      return normalizeItem(response)
    } catch (error) {
      return { status: 'error', message: 'Not found' }
    }
  },
  async create(payload) {
    const fd = toFormData(payload)
    const response = await api.post('/admin/products', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async update(id, payload) {
    const fd = toFormData(payload, 'PUT')
    const response = await api.post(`/admin/products/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async delete(id) {
    await api.delete(`/admin/products/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Add-on API — /api/admin/add-ons
// ═══════════════════════════════════════════════════════
export const addonApi = {
  async getAll(page = 1, perPage = 20, search = '', productId = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      if (productId) params.product_id = productId
      const response = await api.get('/admin/add-ons', { params })
      return normalizePaginated(response)
    } catch (error) {
      console.error('Addon getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async create(payload) {
    const fd = toFormData(payload)
    const response = await api.post('/admin/add-ons', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async update(id, payload) {
    const fd = toFormData(payload, 'PUT')
    const response = await api.post(`/admin/add-ons/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async delete(id) {
    await api.delete(`/admin/add-ons/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Gallery API — /api/admin/galleries
// ═══════════════════════════════════════════════════════
export const galleryApi = {
  async getAll(page = 1, perPage = 20, search = '', productId = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      if (productId) params.product_id = productId
      const response = await api.get('/admin/galleries/paginated', { params })
      return normalizePaginated(response)
    } catch (error) {
      console.error('Gallery getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async create(payload) {
    const fd = toFormData(payload)
    const response = await api.post('/admin/galleries', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return normalizeItem(response)
  },
  async delete(id) {
    await api.delete(`/admin/galleries/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Order API — /api/admin/orders
// ═══════════════════════════════════════════════════════
export const orderApi = {
  async getAll(page = 1, perPage = 10, search = '', filterOrderStatus = '', filterPaymentStatus = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      if (filterOrderStatus) params.order_status = filterOrderStatus
      if (filterPaymentStatus) params.payment_status = filterPaymentStatus
      const response = await api.get('/admin/orders', { params })
      return normalizePaginated(response)
    } catch (error) {
      console.error('Order getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async getById(id) {
    try {
      const response = await api.get(`/admin/orders/${id}`)
      return normalizeItem(response)
    } catch (error) {
      return { status: 'error', message: 'Not found' }
    }
  },
  async create(payload) {
    const response = await api.post('/admin/orders', payload)
    return normalizeItem(response)
  },
  async update(id, payload) {
    const response = await api.put(`/admin/orders/${id}`, payload)
    return normalizeItem(response)
  },
  async updateStatus(id, payload) {
    const response = await api.patch(`/admin/orders/${id}/status`, payload)
    return normalizeItem(response)
  },
  async downloadInvoice(id) {
    const response = await api.get(`/invoice/download/${id}`, {
      responseType: 'blob'
    })
    return response
  },
  async delete(id) {
    await api.delete(`/admin/orders/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Bank Account API — /api/admin/bank-accounts
// ═══════════════════════════════════════════════════════
export const bankAccountApi = {
  async getAll(page = 1, perPage = 10, search = '') {
    try {
      const params = { page, per_page: perPage }
      if (search) params.search = search
      const response = await api.get('/admin/bank-accounts', { params })
      const res = response.data
      const items = res.data || res
      if (Array.isArray(items)) {
        const filtered = search
          ? items.filter(i =>
              (i.bank_name || '').toLowerCase().includes(search.toLowerCase()) ||
              (i.account_name || '').toLowerCase().includes(search.toLowerCase()) ||
              (i.account_number || '').includes(search)
            )
          : items
        const start = (page - 1) * perPage
        return {
          status: 'success',
          data: filtered.slice(start, start + perPage),
          meta: {
            current_page: page,
            per_page: perPage,
            total: filtered.length,
            last_page: Math.ceil(filtered.length / perPage) || 1
          }
        }
      }
      return normalizePaginated(response)
    } catch (error) {
      console.error('BankAccount getAll error:', error)
      return { status: 'error', data: [], meta: null }
    }
  },
  async create(payload) {
    const response = await api.post('/admin/bank-accounts', payload)
    return normalizeItem(response)
  },
  async update(id, payload) {
    const response = await api.put(`/admin/bank-accounts/${id}`, payload)
    return normalizeItem(response)
  },
  async delete(id) {
    await api.delete(`/admin/bank-accounts/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

// ═══════════════════════════════════════════════════════
// Reference API — for dropdowns (re-uses admin endpoints)
// ═══════════════════════════════════════════════════════
export const referenceApi = {
  async getCategories() {
    try {
      const response = await api.get('/admin/categories')
      return normalizeList(response)
    } catch (error) {
      return { status: 'error', data: [] }
    }
  },
  async getProducts() {
    try {
      const response = await api.get('/admin/products')
      return normalizeList(response)
    } catch (error) {
      return { status: 'error', data: [] }
    }
  },
  async getAddons() {
    try {
      const response = await api.get('/admin/add-ons', { params: { per_page: 1000 } })
      const items = response.data.data || response.data
      return { status: 'success', data: Array.isArray(items) ? items : [] }
    } catch (error) {
      return { status: 'error', data: [] }
    }
  }
}

// ═══════════════════════════════════════════════════════
// Finance & Cashflow API — /api/admin/finance
// ═══════════════════════════════════════════════════════
export const financeApi = {
  async getOverview(filter = 'this_month', startDate = '', endDate = '') {
    try {
      const params = { filter }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      const response = await api.get('/admin/finance/overview', { params })
      return normalizeItem(response)
    } catch (error) {
      console.error('Finance getOverview error:', error)
      return { status: 'error', data: null }
    }
  },

  async getPnl(filter = 'this_month', startDate = '', endDate = '') {
    try {
      const params = { filter }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      const response = await api.get('/admin/finance/pnl', { params })
      return normalizeItem(response)
    } catch (error) {
      console.error('Finance getPnl error:', error)
      return { status: 'error', data: null }
    }
  },

  async exportPdf(filter = 'this_month', startDate = '', endDate = '') {
    try {
      const params = { filter }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      const response = await api.get('/admin/finance/export-pdf', { params, responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      const filterName = filter === 'custom' && startDate ? `${startDate}_${endDate}` : filter
      link.setAttribute('download', `Rekap_Keuangan_${filterName}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return { status: 'success' }
    } catch (error) {
      console.error('Finance exportPdf error:', error)
      return { status: 'error', message: 'Gagal mengunduh PDF' }
    }
  },

  async exportExcel(filter = 'this_month', startDate = '', endDate = '') {
    try {
      const params = { filter }
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      const response = await api.get('/admin/finance/export-excel', { params, responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      const filterName = filter === 'custom' && startDate ? `${startDate}_${endDate}` : filter
      link.setAttribute('download', `Rekap_Keuangan_${filterName}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      return { status: 'success' }
    } catch (error) {
      console.error('Finance exportExcel error:', error)
      return { status: 'error', message: 'Gagal mengunduh Excel (.xlsx)' }
    }
  },

  async getCategories() {
    try {
      const response = await api.get('/admin/finance/categories')
      return normalizeList(response)
    } catch (error) {
      console.error('Finance getCategories error:', error)
      return { status: 'error', data: [] }
    }
  },

  async getCashflows(page = 1, perPage = 15, filters = {}) {
    try {
      const params = { page, per_page: perPage, ...filters }
      const response = await api.get('/admin/finance/cashflows', { params })
      const res = response.data
      return {
        status: 'success',
        data: res.data || [],
        summary: res.summary || { total_in: 0, total_out: 0, net_saldo: 0 },
        meta: {
          current_page: res.meta?.current_page || page,
          per_page: res.meta?.per_page || perPage,
          total: res.meta?.total || 0,
          last_page: res.meta?.last_page || 1
        }
      }
    } catch (error) {
      console.error('Finance getCashflows error:', error)
      return { status: 'error', data: [], summary: { total_in: 0, total_out: 0, net_saldo: 0 }, meta: null }
    }
  },

  async createCashflow(payload) {
    const response = await api.post('/admin/finance/cashflows', payload)
    return normalizeItem(response)
  },

  async updateCashflow(id, payload) {
    const response = await api.put(`/admin/finance/cashflows/${id}`, payload)
    return normalizeItem(response)
  },

  async deleteCashflow(id) {
    await api.delete(`/admin/finance/cashflows/${id}`)
    return { status: 'success', message: 'Deleted' }
  }
}

