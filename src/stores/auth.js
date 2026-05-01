import { defineStore } from 'pinia'
import api from '../utils/axios'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async fetchUser() {
      this.loading = true
      try {
        const response = await api.get('/user') // Sesuaikan endpoint API Anda
        this.user = response.data
      } catch (error) {
        this.user = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        const { token, user } = response.data
        Cookies.set('token', token, { expires: 7 }) // Simpan 7 hari
        this.user = user
        return response
      } catch (error) {
        throw error
      }
    },

    logout() {
      Cookies.remove('token')
      this.user = null
      window.location.href = '/login'
    }
  }
})
