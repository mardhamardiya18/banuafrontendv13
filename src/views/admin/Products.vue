<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Produk</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola produk catering (API Contract v2 - Simple Mode).</p>
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
      <template #cell-category_name="{ value, row }">
        <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
          {{ value || row.category?.name || '-' }}
        </span>
      </template>
      <template #cell-price="{ value }"><span class="font-semibold text-gray-800">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #cell-is_recommended="{ value }">
        <span v-if="value" class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold uppercase">Star</span>
        <span v-else class="text-gray-300">-</span>
      </template>
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
          <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Produk</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select v-model="form.category_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none bg-white">
              <option value="" disabled>Pilih</option>
              <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Min. Order (Porsi)</label>
            <input v-model.number="form.min_order" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga Jual</label>
            <input v-model.number="form.price" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga Modal (Cost)</label>
            <input v-model.number="form.cost" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Diskon (%)</label>
            <input v-model.number="form.discount" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Produk</label>
          <div class="quill-container">
            <QuillEditor 
              v-model:content="form.description" 
              contentType="html" 
              theme="snow"
              toolbar="essential"
              placeholder="Jelaskan isi menu di sini (Nasi, Lauk, Sayur, dll)..."
              class="min-h-[200px] bg-white rounded-b-xl"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input v-model="form.is_recommended" type="checkbox" class="w-4 h-4 text-brand-maroon border-gray-300 rounded focus:ring-brand-maroon" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-brand-maroon transition-colors">Tampilkan sebagai Rekomendasi</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 text-brand-maroon border-gray-300 rounded focus:ring-brand-maroon" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-brand-maroon transition-colors">Aktif</span>
          </label>
        </div>

        <!-- Thumbnail Upload Area -->
        <div class="col-span-full">
          <label class="block text-sm font-medium text-gray-700 mb-2.5">Gambar Produk (Thumbnail)</label>
          <div 
            @click="$refs.fileInput.click()"
            class="relative group cursor-pointer border-2 border-dashed border-gray-200 hover:border-brand-maroon/50 rounded-2xl p-4 transition-all bg-gray-50/50 hover:bg-brand-maroon/2"
          >
            <input 
              type="file" 
              ref="fileInput" 
              class="hidden" 
              accept="image/*"
              @change="handleFileChange"
            />
            
            <div v-if="previewUrl" class="relative">
              <img :src="previewUrl" alt="preview" class="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-100" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span class="text-white text-xs font-bold flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg backdrop-blur-md">
                  <i class="bx bx-camera text-base"></i> Ganti Gambar
                </span>
              </div>
            </div>

            <div v-else class="py-8 flex flex-col items-center justify-center text-center">
              <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand-maroon transition-colors mb-3">
                <i class="bx bx-cloud-upload text-3xl"></i>
              </div>
              <p class="text-sm font-bold text-gray-700">Klik untuk Unggah Gambar Produk</p>
              <p class="text-xs text-gray-400 mt-1">Saran ukuran: 800x600px (Maks. 2MB)</p>
            </div>
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { productApi } from '../../api/apiService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null), cats = ref([])
const search = ref(''), perPage = ref(10)
const showForm = ref(false), editItem = ref(null), saving = ref(false)
const previewUrl = ref(null)
const form = ref({ 
  name: '', category_id: '', price: 0, cost: 0, description: '', 
  min_order: 15, is_active: true, is_recommended: false, discount: 0, thumbnail: null 
})
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const columns = [
  { key: 'thumbnail', label: 'Gambar' },
  { key: 'name', label: 'Nama Produk' },
  { key: 'category_name', label: 'Kategori' },
  { key: 'price', label: 'Harga Jual' },
  { key: 'is_recommended', label: 'Reco' }
]

const fetchData = async (p = 1) => {
  loading.value = true
  try {
    const r = await productApi.getAll(p, perPage.value, search.value)
    if (r.status === 'success') { data.value = r.data; meta.value = r.meta }
  } finally { loading.value = false }
}
const onSearch = () => fetchData(1)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.thumbnail = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const openForm = (item = null) => {
  editItem.value = item
  if (item) {
    form.value = { ...item }
    previewUrl.value = item.thumbnail
  } else {
    form.value = { 
      name: '', category_id: '', price: 0, cost: 0, description: '', 
      min_order: 15, is_active: true, is_recommended: false, discount: 0, thumbnail: null 
    }
    previewUrl.value = null
  }
  showForm.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editItem.value) { 
      await productApi.update(editItem.value.id, form.value)
      store.showToast('Produk diperbarui') 
    }
    else { 
      await productApi.create(form.value)
      store.showToast('Produk ditambahkan') 
    }
    showForm.value = false; await fetchData(); await store.refreshProducts()
  } catch (error) {
    let msg = 'Terjadi kesalahan saat menyimpan data produk.'
    if (error.response?.data?.message) {
      msg = error.response.data.message
    }
    store.showToast(msg, 'error')
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

<style scoped>
:deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  border-color: #e5e7eb;
  background-color: #f9fafb;
}
:deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  border-color: #e5e7eb;
  font-family: inherit;
}
:deep(.ql-editor) {
  min-height: 200px;
  font-size: 0.875rem;
}
:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #9ca3af;
}
</style>
