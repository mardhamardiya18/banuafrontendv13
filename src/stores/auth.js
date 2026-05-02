import { defineStore } from 'pinia'
import api from '../utils/axios'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    token: Cookies.get('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.is_admin
  },

  actions: {
    async fetchUser() {
      if (!this.token) return
      this.loading = true
      try {
        const response = await api.get('/user')
        // Mendukung response.data atau response.data.data
        this.user = response.data.data || response.data
      } catch (error) {
        console.error('Fetch User Error:', error)
        this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        console.log('Login Response:', response.data) // Debugging

        // Berdasarkan screenshot:
        // data.access_token
        // data.user
        const data = response.data.data || response.data
        const token = data.access_token || data.token
        const user = data.user || response.data.user
        
        if (!token) {
          throw new Error('Token tidak ditemukan dalam response API')
        }

        this.token = token
        this.user = user
        
        Cookies.set('token', token, { expires: 7, sameSite: 'lax' })
        return response
      } catch (error) {
        console.error('Store Login Error:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/register', userData)
        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        // Panggil endpoint logout di server jika ada
        await api.post('/logout').catch(() => {})
      } finally {
        this.token = null
        this.user = null
        Cookies.remove('token')
        window.location.href = '/login'
      }
    }
  }
})
