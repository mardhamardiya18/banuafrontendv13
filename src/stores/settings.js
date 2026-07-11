import { defineStore } from 'pinia'
import { catalogApi } from '../api/catalogApi'
import { storeStatusApi } from '../api/apiService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isStoreClosed: JSON.parse(localStorage.getItem('isStoreClosed') || 'false'),
    isLoading: false
  }),
  actions: {
    async fetchStoreStatus() {
      try {
        const res = await catalogApi.getStoreStatus()
        if (res && (res.success || res.status === 'success') && res.data) {
          const status = Boolean(res.data.is_store_closed)
          this.isStoreClosed = status
          localStorage.setItem('isStoreClosed', JSON.stringify(status))
        }
      } catch (e) {
        console.error('Failed to fetch store status:', e)
      }
    },
    async toggleStoreStatus() {
      if (this.isLoading) return
      this.isLoading = true
      const newStatus = !this.isStoreClosed
      try {
        const res = await storeStatusApi.updateStatus(newStatus)
        if (res && res.status === 'success') {
          this.isStoreClosed = Boolean(res.data?.is_store_closed ?? newStatus)
          localStorage.setItem('isStoreClosed', JSON.stringify(this.isStoreClosed))
        } else {
          alert(res.message || 'Gagal mengubah status toko di server.')
        }
      } catch (e) {
        console.error('Failed to update store status:', e)
        alert('Terjadi kesalahan saat mengubah status toko.')
      } finally {
        this.isLoading = false
      }
    },
    setStoreClosed(status) {
      this.isStoreClosed = Boolean(status)
      localStorage.setItem('isStoreClosed', JSON.stringify(this.isStoreClosed))
    }
  }
})
