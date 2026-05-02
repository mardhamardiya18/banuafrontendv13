import axios from 'axios'
import Cookies from 'js-cookie'

/**
 * BEST PRACTICE: 
 * 1. Gunakan axios.create() untuk membuat instance agar tidak mengganggu konfigurasi axios global.
 * 2. Gunakan environment variables (VITE_API_URL) agar mudah dikelola saat produksi.
 * 3. Interceptors digunakan untuk inject token secara dinamis dan menangani error secara terpusat.
 */

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.banuatumpeng.com/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request Interceptor: Menambahkan token sebelum request dikirim
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Menangani error global (seperti 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Jika token tidak valid atau expired (401), bisa diarahkan ke login atau hapus cookie
    if (error.response && error.response.status === 401) {
      Cookies.remove('token')
      // window.location.href = '/login' // Contoh redirect
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
