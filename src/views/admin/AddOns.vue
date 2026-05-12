<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add-Ons</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola menu tambahan berbayar.</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Add-On
      </button>
    </div>

    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari add-on..."
      @page-change="fetchData" @search="onSearch">
      <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
      <template #cell-product_name="{ row }">
        <span v-if="row.product?.name" class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
          {{ row.product.name }}
        </span>
        <span v-else class="text-xs text-gray-400 italic">Umum</span>
      </template>
      <template #cell-price="{ value }"><span class="font-semibold text-gray-800">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"><i class="bx bx-edit-alt"></i></button>
          <button @click="confirmDel(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><i class="bx bx-trash"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Add-On' : 'Tambah Add-On'" size="md">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Add-On</label>
          <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 outline-none transition-all" placeholder="Contoh: Ekstra Sambal" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Produk Terkait (Opsional)</label>
          <SearchableSelect 
            v-model="form.product_id" 
            :options="selectOptions"
            placeholder="Pilih Produk..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga Jual (Rp)</label>
          <input v-model.number="form.price" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 text-brand-maroon border-gray-300 rounded focus:ring-brand-maroon" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-brand-maroon transition-colors">Aktif</span>
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
    <ConfirmDialog v-model="showDel" title="Hapus Add-On?" :message="`'${delTarget?.name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import SearchableSelect from '../../components/admin/SearchableSelect.vue'
import { addonApi } from '../../api/apiService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null), products = ref([])
const search = ref(''), perPage = ref(10)
const showForm = ref(false), editItem = ref(null), saving = ref(false)
const form = ref({ name: '', product_id: null, price: 0, is_active: true })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const selectOptions = computed(() => {
  return [
    { id: null, name: 'Add-on Umum (Semua Produk)' },
    ...products.value
  ]
})

const columns = [
  { key: 'name', label: 'Nama Add-On' },
  { key: 'product_name', label: 'Terkait' },
  { key: 'price', label: 'Harga' },
  { key: 'is_active', label: 'Status' }
]

const fetchData = async (p = 1) => {
  loading.value = true
  try {
    const r = await addonApi.getAll(p, perPage.value, search.value)
    if (r.status === 'success') { 
      data.value = r.data; 
      meta.value = r.meta 
    }
  } finally { loading.value = false }
}

const onSearch = () => fetchData(1)

const openForm = (item = null) => {
  editItem.value = item
  if (item) {
    form.value = { ...item }
  } else {
    form.value = { name: '', product_id: null, price: 0, is_active: true }
  }
  showForm.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editItem.value) { 
      await addonApi.update(editItem.value.id, form.value)
      store.showToast('Add-On diperbarui') 
    } else { 
      await addonApi.create(form.value)
      store.showToast('Add-On ditambahkan') 
    }
    showForm.value = false; fetchData()
  } finally { saving.value = false }
}

const confirmDel = (r) => { delTarget.value = r; showDel.value = true }
const handleDel = async () => {
  deleting.value = true
  try { 
    await addonApi.delete(delTarget.value.id)
    store.showToast('Add-On dihapus'); 
    showDel.value = false; 
    fetchData() 
  } finally { deleting.value = false }
}

onMounted(async () => { 
  await store.fetchProducts(); 
  products.value = store.products; 
  fetchData() 
})
</script>
