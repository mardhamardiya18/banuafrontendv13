/**
 * Mock Service — simulates REST API calls with realistic latency.
 * Every response follows: { status: 'success' | 'error', data: ..., meta?: ... }
 */

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ─── Helpers ────────────────────────────────────────────
let _id = 1000
const nextId = () => ++_id

/**
 * Filters array by search string across specified keys (case-insensitive).
 */
const filterBySearch = (arr, search = '', keys = ['name']) => {
  if (!search || !search.trim()) return arr
  const q = search.toLowerCase().trim()
  return arr.filter(item =>
    keys.some(k => String(item[k] || '').toLowerCase().includes(q))
  )
}

const paginate = (arr, page = 1, perPage = 10) => {
  const start = (page - 1) * perPage
  return {
    data: arr.slice(start, start + perPage),
    meta: {
      current_page: page,
      per_page: perPage,
      total: arr.length,
      last_page: Math.ceil(arr.length / perPage) || 1
    }
  }
}

// ─── Dummy Data Stores ──────────────────────────────────
let categories = [
  { id: 1, name: 'Nasi Kotak', thumbnail: 'https://placehold.co/120x120/E07A5F/fff?text=NK' },
  { id: 2, name: 'Tumpeng', thumbnail: 'https://placehold.co/120x120/690B22/fff?text=TP' },
  { id: 3, name: 'Prasmanan', thumbnail: 'https://placehold.co/120x120/1B4D3E/fff?text=PR' },
  { id: 4, name: 'Snack Box', thumbnail: 'https://placehold.co/120x120/E07A5F/fff?text=SB' }
]

let products = [
  { id: 1, category_id: 1, name: 'Nasi Kotak Ayam Bakar', start_price: 25000, thumbnail: 'https://placehold.co/300x200/E07A5F/fff?text=Ayam+Bakar' },
  { id: 2, category_id: 1, name: 'Nasi Kotak Rendang', start_price: 30000, thumbnail: 'https://placehold.co/300x200/690B22/fff?text=Rendang' },
  { id: 3, category_id: 2, name: 'Tumpeng Nasi Kuning Besar', start_price: 350000, thumbnail: 'https://placehold.co/300x200/1B4D3E/fff?text=Tumpeng+Besar' },
  { id: 4, category_id: 2, name: 'Tumpeng Mini', start_price: 150000, thumbnail: 'https://placehold.co/300x200/E07A5F/fff?text=Mini' },
  { id: 5, category_id: 3, name: 'Prasmanan Wedding', start_price: 75000, thumbnail: 'https://placehold.co/300x200/690B22/fff?text=Wedding' },
  { id: 6, category_id: 3, name: 'Prasmanan Kantoran', start_price: 55000, thumbnail: 'https://placehold.co/300x200/1B4D3E/fff?text=Kantor' },
  { id: 7, category_id: 4, name: 'Snack Box Premium', start_price: 20000, thumbnail: 'https://placehold.co/300x200/E07A5F/fff?text=Snack' },
  { id: 8, category_id: 4, name: 'Snack Box Ekonomis', start_price: 12000, thumbnail: 'https://placehold.co/300x200/690B22/fff?text=Ekonomis' }
]

let subProducts = [
  { id: 1, product_id: 1, name: 'Paket A - Ayam Bakar Standar', price: 25000, cost: 18000, min_order: 20, description: 'Nasi kotak ayam bakar dengan lauk standar', is_recommended: true, is_active: true, discount: 0, display_order: 1 },
  { id: 2, product_id: 1, name: 'Paket B - Ayam Bakar Premium', price: 35000, cost: 24000, min_order: 15, description: 'Nasi kotak ayam bakar premium dengan lauk tambahan', is_recommended: false, is_active: true, discount: 5, display_order: 2 },
  { id: 3, product_id: 2, name: 'Paket Rendang Padang', price: 30000, cost: 21000, min_order: 20, description: 'Nasi kotak dengan rendang daging sapi', is_recommended: true, is_active: true, discount: 0, display_order: 1 },
  { id: 4, product_id: 3, name: 'Tumpeng Besar Lengkap', price: 450000, cost: 280000, min_order: 1, description: 'Tumpeng nasi kuning besar dengan aneka lauk lengkap', is_recommended: true, is_active: true, discount: 10, display_order: 1 },
  { id: 5, product_id: 5, name: 'Prasmanan Paket Gold', price: 85000, cost: 55000, min_order: 50, description: 'Paket prasmanan premium per pax', is_recommended: true, is_active: true, discount: 0, display_order: 1 },
  { id: 6, product_id: 7, name: 'Snack Box 3 Items', price: 20000, cost: 12000, min_order: 30, description: 'Snack box berisi 3 jenis kue', is_recommended: false, is_active: true, discount: 0, display_order: 1 }
]

let menus = [
  { id: 1, name: 'Menu Utama' },
  { id: 2, name: 'Menu Sayur' },
  { id: 3, name: 'Menu Sambal' },
  { id: 4, name: 'Menu Pendamping' },
  { id: 5, name: 'Menu Dessert' }
]

let menuItems = [
  { id: 1, menu_id: 1, name: 'Ayam Bakar', type: 'protein', is_active: true, description: 'Ayam bakar bumbu kecap', thumbnail: 'https://placehold.co/120/E07A5F/fff?text=AB', display_order: 1 },
  { id: 2, menu_id: 1, name: 'Rendang Sapi', type: 'protein', is_active: true, description: 'Rendang daging sapi empuk', thumbnail: 'https://placehold.co/120/690B22/fff?text=RS', display_order: 2 },
  { id: 3, menu_id: 1, name: 'Ikan Patin Bakar', type: 'protein', is_active: true, description: 'Ikan patin bakar bumbu padang', thumbnail: 'https://placehold.co/120/1B4D3E/fff?text=IP', display_order: 3 },
  { id: 4, menu_id: 2, name: 'Sayur Lodeh', type: 'vegetable', is_active: true, description: 'Sayur lodeh santan gurih', thumbnail: 'https://placehold.co/120/E07A5F/fff?text=SL', display_order: 1 },
  { id: 5, menu_id: 2, name: 'Tumis Kangkung', type: 'vegetable', is_active: true, description: 'Tumis kangkung bawang putih', thumbnail: 'https://placehold.co/120/690B22/fff?text=TK', display_order: 2 },
  { id: 6, menu_id: 3, name: 'Sambal Terasi', type: 'condiment', is_active: true, description: 'Sambal terasi pedas', thumbnail: 'https://placehold.co/120/E07A5F/fff?text=ST', display_order: 1 },
  { id: 7, menu_id: 4, name: 'Kerupuk Udang', type: 'side', is_active: true, description: 'Kerupuk udang renyah', thumbnail: 'https://placehold.co/120/690B22/fff?text=KU', display_order: 1 },
  { id: 8, menu_id: 5, name: 'Puding Coklat', type: 'dessert', is_active: true, description: 'Puding coklat dengan vla', thumbnail: 'https://placehold.co/120/1B4D3E/fff?text=PC', display_order: 1 }
]

let addons = [
  { id: 1, sub_product_id: 1, name: 'Extra Nasi', price: 5000, is_active: true },
  { id: 2, sub_product_id: 1, name: 'Extra Ayam', price: 10000, is_active: true },
  { id: 3, sub_product_id: 1, name: 'Minum Teh Botol', price: 5000, is_active: true },
  { id: 4, sub_product_id: 4, name: 'Tambah Lauk Ikan', price: 30000, is_active: true },
  { id: 5, sub_product_id: 5, name: 'Extra Buah Potong', price: 15000, is_active: true },
  { id: 6, sub_product_id: 5, name: 'Extra Es Teh Manis', price: 5000, is_active: false }
]

let gallery = [
  { id: 1, sub_product_id: 1, image_url: 'https://placehold.co/400x300/E07A5F/fff?text=Gallery+1' },
  { id: 2, sub_product_id: 1, image_url: 'https://placehold.co/400x300/690B22/fff?text=Gallery+2' },
  { id: 3, sub_product_id: 4, image_url: 'https://placehold.co/400x300/1B4D3E/fff?text=Gallery+3' },
  { id: 4, sub_product_id: 5, image_url: 'https://placehold.co/400x300/E07A5F/fff?text=Gallery+4' },
  { id: 5, sub_product_id: 5, image_url: 'https://placehold.co/400x300/690B22/fff?text=Gallery+5' },
  { id: 6, sub_product_id: 3, image_url: 'https://placehold.co/400x300/1B4D3E/fff?text=Gallery+6' }
]

let bankAccounts = [
  { id: 1, bank_name: 'BCA', account_number: '1234567890', account_name: 'DMI Catering', logo_url: 'https://placehold.co/80x40/003399/fff?text=BCA', is_active: true },
  { id: 2, bank_name: 'BRI', account_number: '0987654321', account_name: 'DMI Catering', logo_url: 'https://placehold.co/80x40/003399/fff?text=BRI', is_active: true },
  { id: 3, bank_name: 'Mandiri', account_number: '1122334455', account_name: 'DMI Catering', logo_url: 'https://placehold.co/80x40/003366/fff?text=Mandiri', is_active: false }
]

let orders = [
  {
    id: 1, invoice_number: 'INV-20260401-001', customer_id: 1, customer_name: 'Ibu Sari', customer_phone: '081234567890',
    delivery_address: 'Jl. A. Yani Km 6, Banjarmasin', delivery_date: '2026-04-10', delivery_notes: 'Antar sebelum jam 10 pagi',
    delivery_type: 'delivery', total_amount: 1750000, paid_amount: 1750000, total_cost: 1120000,
    payment_status: 'paid', order_status: 'completed',
    items: [
      { id: 1, sub_product_id: 1, sub_product_name: 'Paket A - Ayam Bakar Standar', quantity: 50, snapshot_price: 25000, snapshot_cost: 18000, under_min_order_fee: 0, sub_total: 1250000, notes: 'Tidak pedas',
        addons: [{ id: 1, name: 'Minum Teh Botol', quantity: 50, snapshot_price: 5000, sub_total: 250000 }],
        menu_selections: [{ menu_name: 'Ayam Bakar' }, { menu_name: 'Sayur Lodeh' }, { menu_name: 'Sambal Terasi' }]
      },
      { id: 2, sub_product_id: 6, sub_product_name: 'Snack Box 3 Items', quantity: 50, snapshot_price: 20000, snapshot_cost: 12000, under_min_order_fee: 0, sub_total: 250000, notes: '',
        addons: [],
        menu_selections: [{ menu_name: 'Puding Coklat' }]
      }
    ]
  },
  {
    id: 2, invoice_number: 'INV-20260405-002', customer_id: 2, customer_name: 'Pak Ahmad', customer_phone: '081298765432',
    delivery_address: 'Jl. Pramuka No. 15, Banjarbaru', delivery_date: '2026-04-15', delivery_notes: 'Setup prasmanan di Aula',
    delivery_type: 'setup', total_amount: 4250000, paid_amount: 2000000, total_cost: 2750000,
    payment_status: 'partial', order_status: 'processing',
    items: [
      { id: 3, sub_product_id: 5, sub_product_name: 'Prasmanan Paket Gold', quantity: 50, snapshot_price: 85000, snapshot_cost: 55000, under_min_order_fee: 0, sub_total: 4250000, notes: 'Termasuk dekorasi meja',
        addons: [{ id: 2, name: 'Extra Buah Potong', quantity: 50, snapshot_price: 15000, sub_total: 750000 }],
        menu_selections: [{ menu_name: 'Rendang Sapi' }, { menu_name: 'Ikan Patin Bakar' }, { menu_name: 'Sayur Lodeh' }, { menu_name: 'Tumis Kangkung' }]
      }
    ]
  },
  {
    id: 3, invoice_number: 'INV-20260410-003', customer_id: 3, customer_name: 'Bella & Rizky', customer_phone: '082112345678',
    delivery_address: 'Gedung Serbaguna, Martapura', delivery_date: '2026-04-20', delivery_notes: 'Wedding party 200 pax',
    delivery_type: 'setup', total_amount: 17000000, paid_amount: 0, total_cost: 11000000,
    payment_status: 'unpaid', order_status: 'pending',
    items: [
      { id: 4, sub_product_id: 5, sub_product_name: 'Prasmanan Paket Gold', quantity: 200, snapshot_price: 85000, snapshot_cost: 55000, under_min_order_fee: 0, sub_total: 17000000, notes: 'Tema warna pink & gold',
        addons: [],
        menu_selections: [{ menu_name: 'Ayam Bakar' }, { menu_name: 'Rendang Sapi' }, { menu_name: 'Sayur Lodeh' }, { menu_name: 'Tumis Kangkung' }, { menu_name: 'Sambal Terasi' }, { menu_name: 'Kerupuk Udang' }]
      }
    ]
  },
  {
    id: 4, invoice_number: 'INV-20260412-004', customer_id: 4, customer_name: 'Hj. Fatimah', customer_phone: '085367891234',
    delivery_address: 'Musholla RT 05, Banjarmasin', delivery_date: '2026-04-25', delivery_notes: 'Pengajian rutin',
    delivery_type: 'delivery', total_amount: 600000, paid_amount: 600000, total_cost: 432000,
    payment_status: 'paid', order_status: 'completed',
    items: [
      { id: 5, sub_product_id: 3, sub_product_name: 'Paket Rendang Padang', quantity: 20, snapshot_price: 30000, snapshot_cost: 21000, under_min_order_fee: 0, sub_total: 600000, notes: '',
        addons: [],
        menu_selections: [{ menu_name: 'Rendang Sapi' }, { menu_name: 'Sayur Lodeh' }]
      }
    ]
  },
  {
    id: 5, invoice_number: 'INV-20260415-005', customer_id: 5, customer_name: 'David Chen', customer_phone: '081345678901',
    delivery_address: 'Co-working Space Borneo, Banjarbaru', delivery_date: '2026-04-28', delivery_notes: 'Milestone celebration',
    delivery_type: 'delivery', total_amount: 900000, paid_amount: 900000, total_cost: 540000,
    payment_status: 'paid', order_status: 'delivered',
    items: [
      { id: 6, sub_product_id: 4, sub_product_name: 'Tumpeng Besar Lengkap', quantity: 2, snapshot_price: 450000, snapshot_cost: 280000, under_min_order_fee: 0, sub_total: 900000, notes: 'Tulisan Happy Anniversary',
        addons: [],
        menu_selections: [{ menu_name: 'Ayam Bakar' }, { menu_name: 'Rendang Sapi' }, { menu_name: 'Sayur Lodeh' }, { menu_name: 'Kerupuk Udang' }, { menu_name: 'Puding Coklat' }]
      }
    ]
  }
]

// ─── Dashboard Stats ────────────────────────────────────
const dashboardStats = {
  totalOrders: 156,
  totalOrdersChange: 12,
  totalRevenue: 48500000,
  revenueChange: 8.5,
  totalCustomers: 89,
  customersChange: 15,
  averageRating: 4.9,
  ratingChange: 0.2
}

const salesChart = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    { label: 'Penjualan 2026', data: [3200000, 4100000, 3800000, 5200000, 4800000, 6100000, 5500000, 7200000, 6800000, 8100000, 7500000, 9200000] },
    { label: 'Penjualan 2025', data: [2800000, 3500000, 3200000, 4100000, 3900000, 4800000, 4200000, 5500000, 5100000, 6200000, 5800000, 7100000] }
  ]
}

// ─── Generic CRUD Factory ───────────────────────────────
function createCrud(store, searchKeys = ['name']) {
  return {
    async getAll(page = 1, perPage = 10, search = '') {
      await delay()
      const filtered = filterBySearch(store, search, searchKeys)
      const result = paginate(filtered, page, perPage)
      return { status: 'success', ...result }
    },
    async getById(id) {
      await delay(300)
      const item = store.find(i => i.id === id)
      if (!item) return { status: 'error', message: 'Not found' }
      return { status: 'success', data: item }
    },
    async create(payload) {
      await delay(500)
      const newItem = { id: nextId(), ...payload }
      store.unshift(newItem)
      return { status: 'success', data: newItem }
    },
    async update(id, payload) {
      await delay(500)
      const idx = store.findIndex(i => i.id === id)
      if (idx === -1) return { status: 'error', message: 'Not found' }
      store[idx] = { ...store[idx], ...payload }
      return { status: 'success', data: store[idx] }
    },
    async delete(id) {
      await delay(300)
      const idx = store.findIndex(i => i.id === id)
      if (idx === -1) return { status: 'error', message: 'Not found' }
      store.splice(idx, 1)
      return { status: 'success', message: 'Deleted' }
    }
  }
}

// ─── Exported API ───────────────────────────────────────
export const dashboardApi = {
  async getStats() {
    await delay()
    return { status: 'success', data: dashboardStats }
  },
  async getSalesChart() {
    await delay(300)
    return { status: 'success', data: salesChart }
  }
}

export const categoryApi = createCrud(categories)
export const productApi = {
  ...createCrud(products, ['name']),
  async getAll(page = 1, perPage = 10, search = '') {
    await delay()
    const enriched = products.map(p => ({
      ...p,
      category_name: categories.find(c => c.id === p.category_id)?.name || '-'
    }))
    const filtered = filterBySearch(enriched, search, ['name', 'category_name'])
    const result = paginate(filtered, page, perPage)
    return { status: 'success', ...result }
  }
}

export const subProductApi = {
  ...createCrud(subProducts, ['name']),
  async getAll(page = 1, perPage = 10, search = '') {
    await delay()
    const enriched = subProducts.map(sp => ({
      ...sp,
      product_name: products.find(p => p.id === sp.product_id)?.name || '-'
    }))
    const filtered = filterBySearch(enriched, search, ['name', 'product_name'])
    const result = paginate(filtered, page, perPage)
    return { status: 'success', ...result }
  },
  async getMenuItems(subProductId) {
    await delay(300)
    // Return menu items that could be synced to this subProduct
    return { status: 'success', data: menuItems.filter(mi => mi.is_active) }
  }
}

export const galleryApi = {
  async getAll(page = 1, perPage = 20) {
    await delay()
    const enriched = gallery.map(g => ({
      ...g,
      sub_product_name: subProducts.find(sp => sp.id === g.sub_product_id)?.name || '-'
    }))
    const result = paginate(enriched, page, perPage)
    return { status: 'success', ...result }
  },
  async create(payload) {
    await delay(500)
    const newItem = { id: nextId(), ...payload }
    gallery.unshift(newItem)
    return { status: 'success', data: newItem }
  },
  async delete(id) {
    await delay(300)
    const idx = gallery.findIndex(i => i.id === id)
    if (idx === -1) return { status: 'error', message: 'Not found' }
    gallery.splice(idx, 1)
    return { status: 'success', message: 'Deleted' }
  }
}

export const menuApi = createCrud(menus)
export const menuItemApi = {
  ...createCrud(menuItems, ['name']),
  async getAll(page = 1, perPage = 20, search = '') {
    await delay()
    const enriched = menuItems.map(mi => ({
      ...mi,
      menu_name: menus.find(m => m.id === mi.menu_id)?.name || '-'
    }))
    const filtered = filterBySearch(enriched, search, ['name', 'menu_name', 'type'])
    const result = paginate(filtered, page, perPage)
    return { status: 'success', ...result }
  }
}

export const addonApi = {
  ...createCrud(addons, ['name']),
  async getAll(page = 1, perPage = 20, search = '') {
    await delay()
    const enriched = addons.map(a => ({
      ...a,
      sub_product_name: subProducts.find(sp => sp.id === a.sub_product_id)?.name || '-'
    }))
    const filtered = filterBySearch(enriched, search, ['name', 'sub_product_name'])
    const result = paginate(filtered, page, perPage)
    return { status: 'success', ...result }
  }
}

export const orderApi = {
  async getAll(page = 1, perPage = 10, search = '') {
    await delay()
    const lite = orders.map(({ items, ...rest }) => rest)
    const filtered = filterBySearch(lite, search, ['invoice_number', 'customer_name', 'order_status', 'payment_status'])
    const result = paginate(filtered, page, perPage)
    return { status: 'success', ...result }
  },
  async getById(id) {
    await delay(300)
    const order = orders.find(o => o.id === id)
    if (!order) return { status: 'error', message: 'Not found' }
    return { status: 'success', data: order }
  },
  async update(id, payload) {
    await delay(500)
    const idx = orders.findIndex(o => o.id === id)
    if (idx === -1) return { status: 'error', message: 'Not found' }
    orders[idx] = { ...orders[idx], ...payload }
    return { status: 'success', data: orders[idx] }
  },
  async create(payload) {
    await delay(500)
    const newOrder = { id: nextId(), ...payload, items: payload.items || [] }
    orders.unshift(newOrder)
    return { status: 'success', data: newOrder }
  },
  async delete(id) {
    await delay(300)
    const idx = orders.findIndex(o => o.id === id)
    if (idx === -1) return { status: 'error', message: 'Not found' }
    orders.splice(idx, 1)
    return { status: 'success', message: 'Deleted' }
  }
}

export const bankAccountApi = createCrud(bankAccounts, ['bank_name', 'account_name', 'account_number'])

// ─── Reference Data (for dropdowns) ────────────────────
export const referenceApi = {
  async getCategories() {
    await delay(200)
    return { status: 'success', data: [...categories] }
  },
  async getProducts() {
    await delay(200)
    return { status: 'success', data: [...products] }
  },
  async getSubProducts() {
    await delay(200)
    return { status: 'success', data: [...subProducts] }
  },
  async getMenus() {
    await delay(200)
    return { status: 'success', data: [...menus] }
  },
  async getAddons() {
    await delay(200)
    return { status: 'success', data: addons.filter(a => a.is_active).map(a => ({ ...a })) }
  },
  async getMenuItems() {
    await delay(200)
    return { status: 'success', data: menuItems.filter(mi => mi.is_active).map(mi => ({ ...mi, menu_name: menus.find(m => m.id === mi.menu_id)?.name || '-' })) }
  }
}
