import { defineStore } from 'pinia'
import { referenceApi } from '../api/apiService'

/**
 * Admin Reference Store
 * Stores frequently used reference data (categories, products, etc.)
 * to avoid re-fetching on every page visit.
 */
export const useAdminStore = defineStore('admin', {
  state: () => ({
    categories: [],
    products: [],
    subProducts: [],
    menus: [],
    sidebarOpen: true,
    sidebarMobileOpen: false,
    toasts: []
  }),

  actions: {
    async fetchCategories() {
      if (this.categories.length) return
      const res = await referenceApi.getCategories()
      if (res.status === 'success') this.categories = res.data
    },
    async fetchProducts() {
      if (this.products.length) return
      const res = await referenceApi.getProducts()
      if (res.status === 'success') this.products = res.data
    },
    async fetchSubProducts() {
      if (this.subProducts.length) return
      const res = await referenceApi.getSubProducts()
      if (res.status === 'success') this.subProducts = res.data
    },
    async fetchMenus() {
      if (this.menus.length) return
      const res = await referenceApi.getMenus()
      if (res.status === 'success') this.menus = res.data
    },
    /** Force refresh reference data (e.g. after CRUD) */
    async refreshCategories() {
      this.categories = []
      await this.fetchCategories()
    },
    async refreshProducts() {
      this.products = []
      await this.fetchProducts()
    },
    async refreshSubProducts() {
      this.subProducts = []
      await this.fetchSubProducts()
    },
    async refreshMenus() {
      this.menus = []
      await this.fetchMenus()
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },
    /** Toast notification system */
    showToast(message, type = 'success', duration = 3000) {
      const id = Date.now()
      this.toasts.push({ id, message, type })
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id)
      }, duration)
    }
  }
})
