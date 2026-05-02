<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Produk</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola produk catering.</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Produk
      </button>
    </div>

    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari produk atau kategori..."
      @page-change="fetchData" @search="onSearch">
      <template #cell-thumbnail="{ value }">
        <img :src="value" alt="" class="w-12 h-10 rounded-xl object-cover border border-gray-100" />
      </template>
      <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
      <template #cell-category_name="{ value }">
        <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">{{ value }}</span>
      </template>
      <template #cell-start_price="{ value }"><span class="font-semibold text-gray-800">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"><i class="bx bx-edit-alt"></i></button>
          <button @click="confirmDel(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><i class="bx bx-trash"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Produk' : 'Tambah Produk'" size="lg">
      <form @submit.prevent="save" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select v-model="form.category_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none bg-white">
              <option value="" disabled>Pilih</option>
              <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga Mulai</label>
            <input v-model.number="form.start_price" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
            <input v-model="form.thumbnail" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
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
    <ConfirmDialog v-model="showDel" title="Hapus Produk?" :message="`'${delTarget?.name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { productApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null), cats = ref([])
const search = ref(''), perPage = ref(10)
const showForm = ref(false), editItem = ref(null), saving = ref(false)
const form = ref({ name: '', category_id: '', start_price: 0, thumbnail: '' })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const columns = [
  { key: 'thumbnail', label: 'Gambar' },
  { key: 'name', label: 'Nama Produk' },
  { key: 'category_name', label: 'Kategori' },
  { key: 'start_price', label: 'Harga Mulai' }
]

const fetchData = async (p = 1) => {
  loading.value = true
  try {
    const r = await productApi.getAll(p, perPage.value, search.value)
    if (r.status === 'success') { data.value = r.data; meta.value = r.meta }
  } finally { loading.value = false }
}
const onSearch = () => fetchData(1)

const openForm = (item = null) => {
  editItem.value = item
  form.value = item ? { ...item } : { name: '', category_id: '', start_price: 0, thumbnail: '' }
  showForm.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editItem.value) { await productApi.update(editItem.value.id, form.value); store.showToast('Produk diperbarui') }
    else { await productApi.create(form.value); store.showToast('Produk ditambahkan') }
    showForm.value = false; await fetchData(); await store.refreshProducts()
  } finally { saving.value = false }
}

const confirmDel = (r) => { delTarget.value = r; showDel.value = true }
const handleDel = async () => {
  deleting.value = true
  try { await productApi.delete(delTarget.value.id); store.showToast('Produk dihapus'); showDel.value = false; await fetchData() }
  finally { deleting.value = false }
}

onMounted(async () => { await store.fetchCategories(); cats.value = store.categories; await fetchData() })
</script>
