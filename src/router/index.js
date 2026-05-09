import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/katalog',
    name: 'Catalog',
    component: () => import('../views/CatalogView.vue'),
    meta: { title: 'Katalog Produk' }
  },
  {
    path: '/produk/:slug',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'Detail Produk' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      title: 'Login',
      requiredGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: {
      title: 'Register',
      requiredGuest: true
    }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('../views/admin/Categories.vue'),
        meta: { title: 'Kategori' }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('../views/admin/Products.vue'),
        meta: { title: 'Produk' }
      },
      {
        path: 'sub-products',
        name: 'AdminSubProducts',
        component: () => import('../views/admin/SubProducts.vue'),
        meta: { title: 'Sub Produk' }
      },
      {
        path: 'sub-products/:id/config',
        name: 'AdminSubProductConfig',
        component: () => import('../views/admin/SubProductConfig.vue'),
        meta: { title: 'Konfigurasi Paket' }
      },
      {
        path: 'gallery',
        name: 'AdminGallery',
        component: () => import('../views/admin/Gallery.vue'),
        meta: { title: 'Gallery' }
      },
      {
        path: 'menus',
        name: 'AdminMenus',
        component: () => import('../views/admin/Menus.vue'),
        meta: { title: 'Kelola Menu' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/Orders.vue'),
        meta: { title: 'Order' }
      },
      {
        path: 'orders/create',
        name: 'AdminCreateOrder',
        component: () => import('../views/admin/CreateOrder.vue'),
        meta: { title: 'Buat Order' }
      },
      {
        path: 'bank-accounts',
        name: 'AdminBankAccounts',
        component: () => import('../views/admin/BankAccounts.vue'),
        meta: { title: 'Bank Account' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes
})

/**
 * BEST PRACTICE: 
 * 1. Gunakan async/await agar fetchUser selesai sebelum route dirender (mencegah kedipan UI).
 * 2. Hindari redirect loop dengan mengecek 'to.name'.
 * 3. Simpan state user di Pinia untuk akses cepat di seluruh komponen.
 */
router.beforeEach(async (to, from, next) => {
  // 1. SET TITLE
  const siteTitle = 'Banua Frontend'
  document.title = to.meta.title ? `${to.meta.title} - ${siteTitle}` : siteTitle

  const authStore = useAuthStore()
  const token = Cookies.get('token')

  // 2. RE-HYDRATION (Ambil data user jika token ada tapi state di Pinia kosong)
  if (token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      // Jika token expired atau invalid (401), bersihkan dan lempar ke login
      Cookies.remove('token')
      if (to.meta.requiresAuth) {
        return next({ name: 'Login' })
      }
    }
  }

  const isAuthenticated = !!authStore.user
  const userRole = authStore.user?.role

  // 3. LOGIC HALAMAN TAMU (Guest Only: Login/Register)
  if (to.meta.requiredGuest && isAuthenticated) {
    if (userRole === 'admin') {
      return next({ name: 'AdminDashboard' })
    }
    return next({ name: 'Home' })
  }

  // 4. LOGIC PROTEKSI ROUTE
  // A. Cek Login (Halaman yang butuh auth)
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  // B. Cek Role Admin
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    // Jika bukan admin tapi coba akses halaman admin, lempar ke Home atau Error 403
    return next({ name: 'Home' })
  }

  // 5. LOLOS SEMUA PENGECEKAN
  next()
})

export default router
