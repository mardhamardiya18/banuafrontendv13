<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sub Produk</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola varian / paket dari setiap produk.</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Sub Produk
      </button>
    </div>

    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari sub produk..."
      @page-change="fetchData" @search="onSearch">
      <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
      <template #cell-product_name="{ value }">
        <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">{{ value }}</span>
      </template>
      <template #cell-price="{ value }"><span class="font-semibold">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #cell-cost="{ value }"><span class="text-gray-500">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #cell-is_active="{ value }">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="value ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'">{{ value ? 'Aktif' : 'Nonaktif' }}</span>
      </template>
      <template #cell-is_recommended="{ value }">
        <i v-if="value" class="bx bxs-star text-amber-400"></i>
        <span v-else class="text-gray-300">—</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><i class="bx bx-edit-alt"></i></button>
          <button @click="confirmDel(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><i class="bx bx-trash"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Sub Produk' : 'Tambah Sub Produk'" size="lg">
      <form @submit.prevent="save" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Produk Induk</label>
            <select v-model="form.product_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-maroon">
              <option value="" disabled>Pilih</option>
              <option v-for="p in prods" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga Jual</label>
            <input v-model.number="form.price" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">HPP Modal</label>
            <input v-model.number="form.cost" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Min. Order</label>
            <input v-model.number="form.min_order" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Diskon (%)</label>
            <input v-model.number="form.discount" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Urutan Tampil</label>
            <input v-model.number="form.display_order" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea v-model="form.description" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon resize-none"></textarea>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.is_active" class="w-4 h-4 rounded accent-brand-maroon" />
            <span class="text-sm text-gray-700">Aktif</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="form.is_recommended" class="w-4 h-4 rounded accent-amber-500" />
            <span class="text-sm text-gray-700">Rekomendasi</span>
          </label>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>{{ editItem ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </template>
    </BaseModal>
    <ConfirmDialog v-model="showDel" title="Hapus Sub Produk?" :message="`'${delTarget?.name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { subProductApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null), prods = ref([])
const search = ref(''), perPage = ref(10)
const showForm = ref(false), editItem = ref(null), saving = ref(false)
const emptyForm = { product_id: '', name: '', price: 0, cost: 0, min_order: 1, description: '', is_recommended: false, is_active: true, discount: 0, display_order: 1 }
const form = ref({ ...emptyForm })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'product_name', label: 'Produk' },
  { key: 'price', label: 'Harga' },
  { key: 'cost', label: 'HPP' },
  { key: 'is_active', label: 'Status' },
  { key: 'is_recommended', label: '⭐' }
]

const fetchData = async (p = 1) => {
  loading.value = true
  try { const r = await subProductApi.getAll(p, perPage.value, search.value); if (r.status === 'success') { data.value = r.data; meta.value = r.meta } }
  finally { loading.value = false }
}
const onSearch = () => fetchData(1)
const openForm = (item = null) => { editItem.value = item; form.value = item ? { ...item } : { ...emptyForm }; showForm.value = true }
const save = async () => {
  saving.value = true
  try {
    if (editItem.value) { await subProductApi.update(editItem.value.id, form.value); store.showToast('Sub Produk diperbarui') }
    else { await subProductApi.create(form.value); store.showToast('Sub Produk ditambahkan') }
    showForm.value = false; await fetchData()
  } finally { saving.value = false }
}
const confirmDel = (r) => { delTarget.value = r; showDel.value = true }
const handleDel = async () => {
  deleting.value = true
  try { await subProductApi.delete(delTarget.value.id); store.showToast('Sub Produk dihapus'); showDel.value = false; await fetchData() }
  finally { deleting.value = false }
}
onMounted(async () => { await store.fetchProducts(); prods.value = store.products; await fetchData() })
</script>
