<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Produk</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">Kelola produk catering (API Contract v2 - Simple Mode).</p>
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
        <img :src="value" alt="" class="w-12 h-10 rounded-xl object-cover" style="border: 1px solid rgba(255,255,255,0.08);" />
      </template>
      <template #cell-name_full="{ value }"><span class="font-semibold" style="color: rgba(230,230,250,0.97);">{{ value }}</span></template>
      <template #cell-category_name="{ value, row }">
        <span class="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style="background: rgba(139,92,246,0.12); color: rgba(167,139,250,0.9); border: 1px solid rgba(139,92,246,0.2);">
          {{ value || row.category?.name || '-' }}
        </span>
      </template>
      <template #cell-price="{ value }"><span class="font-semibold" style="color: rgba(230,230,250,0.97);">Rp {{ value.toLocaleString('id-ID') }}</span></template>
      <template #cell-is_recommended="{ value }">
        <span v-if="value" class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
              style="background: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25);">Star</span>
        <span v-else style="color: rgba(160,160,192,0.3);">-</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style="color: rgba(160,160,192,0.6);"
                  onmouseenter="this.style.background='rgba(96,165,250,0.12)'; this.style.color='#60a5fa';"
                  onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
          ><i class="bx bx-edit-alt text-base"></i></button>
          <button @click="confirmDel(row)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style="color: rgba(160,160,192,0.6);"
                  onmouseenter="this.style.background='rgba(248,113,113,0.12)'; this.style.color='#f87171';"
                  onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
          ><i class="bx bx-trash text-base"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Produk' : 'Tambah Produk'" size="lg">
      <form @submit.prevent="save" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-5">
          <div class="col-span-full">
            <label class="dark-label">Nama Produk</label>
            <input v-model="form.name" type="text" required class="dark-input" placeholder="Masukkan nama produk" />
          </div>
          <div>
            <label class="dark-label">Kategori</label>
            <select v-model="form.category_id" required class="dark-select">
              <option value="" disabled style="background:#1a1a2e; color:rgba(160,160,192,0.5);">Pilih</option>
              <option v-for="c in cats" :key="c.id" :value="c.id" style="background:#1a1a2e;">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="dark-label">Induk Produk (Opsional)</label>
            <select v-model="form.parent_id" class="dark-select">
              <option :value="null" style="background:#1a1a2e;">-- Produk Utama --</option>
              <option v-for="p in parentProducts" :key="p.id" :value="p.id" style="background:#1a1a2e;">{{ p.name }}</option>
            </select>
          </div>
          <div>
            <label class="dark-label">Min. Order (Porsi)</label>
            <input v-model.number="form.min_order" type="number" required class="dark-input" />
          </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-5">
          <div>
            <label class="dark-label">Harga Jual</label>
            <input v-model="formattedPrice" type="text" required class="dark-input" />
          </div>
          <div>
            <label class="dark-label">Harga Modal (Cost)</label>
            <input v-model="formattedCost" type="text" required class="dark-input" />
          </div>
          <div>
            <label class="dark-label">Diskon (%)</label>
            <input v-model.number="form.discount" type="number" class="dark-input" />
          </div>
        </div>

        <div>
          <label class="dark-label">Deskripsi Produk</label>
          <div class="quill-container">
            <QuillEditor
              v-model:content="form.description"
              contentType="html"
              theme="snow"
              toolbar="essential"
              placeholder="Jelaskan isi menu di sini (Nasi, Lauk, Sayur, dll)..."
              class="min-h-[200px]"
            />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer" style="color: rgba(190,190,220,0.75);">
            <input v-model="form.is_recommended" type="checkbox" class="w-4 h-4 accent-purple-500 border-0 rounded" />
            <span class="text-sm font-medium">Tampilkan sebagai Rekomendasi</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer" style="color: rgba(190,190,220,0.75);">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 accent-purple-500 border-0 rounded" />
            <span class="text-sm font-medium">Aktif</span>
          </label>
        </div>

        <!-- Thumbnail Upload Area -->
        <div class="col-span-full">
          <label class="dark-label">Gambar Produk (Thumbnail)</label>
          <div @click="$refs.fileInput.click()" class="dark-upload-zone">
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
            <div v-if="previewUrl" class="relative">
              <img :src="previewUrl" alt="preview" class="w-full h-48 object-cover rounded-xl" style="border: 1px solid rgba(255,255,255,0.08);" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span class="text-white text-xs font-bold flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-md">
                  <i class="bx bx-camera text-base"></i> Ganti Gambar
                </span>
              </div>
            </div>
            <div v-else class="py-8 flex flex-col items-center justify-center text-center">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors"
                   style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);">
                <i class="bx bx-cloud-upload text-3xl" style="color: rgba(160,160,192,0.5);"></i>
              </div>
              <p class="text-sm font-bold" style="color: rgba(200,200,230,0.8);">Klik untuk Unggah Gambar Produk</p>
              <p class="text-xs mt-1" style="color: rgba(160,160,192,0.5);">Saran ukuran: 800x600px (Maks. 2MB)</p>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="dark-btn-cancel">Batal</button>
          <button @click="save" :disabled="saving" class="dark-btn-primary">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>{{ editItem ? 'Simpan' : 'Tambah' }}
          </button>
        </div>
      </template>
    </BaseModal>
    <ConfirmDialog v-model="showDel" title="Hapus Produk?" :message="`'${delTarget?.name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
  name: '', category_id: '', parent_id: null, price: 0, cost: 0, description: '', 
  min_order: 15, is_active: true, is_recommended: false, discount: 0, thumbnail: null 
})

const formattedPrice = computed({
  get() { return form.value.price ? form.value.price.toLocaleString('id-ID') : '' },
  set(val) {
    const rawValue = val.toString().replace(/\D/g, '')
    form.value.price = rawValue ? parseInt(rawValue, 10) : 0
  }
})

const formattedCost = computed({
  get() { return form.value.cost ? form.value.cost.toLocaleString('id-ID') : '' },
  set(val) {
    const rawValue = val.toString().replace(/\D/g, '')
    form.value.cost = rawValue ? parseInt(rawValue, 10) : 0
  }
})

const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const columns = [
  { key: 'thumbnail', label: 'Gambar' },
  { key: 'name_full', label: 'Nama Produk' },
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

const parentProducts = computed(() => {
  // Hanya tampilkan produk yang bukan turunan (parent_id null) 
  // Dan sembunyikan diri sendiri saat edit untuk menghindari circular dependency
  return store.products.filter(p => !p.parent_id && (!editItem.value || p.id !== editItem.value.id))
})

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
      name: '', category_id: '', parent_id: null, price: 0, cost: 0, description: '', 
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

onMounted(async () => { 
  await store.fetchCategories(); 
  cats.value = store.categories; 
  await store.fetchProducts(); // Ambil data untuk dropdown parent
  await fetchData() 
})
</script>

<style scoped>
:deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  border-color: rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04);
}
:deep(.ql-toolbar.ql-snow .ql-stroke) { stroke: rgba(180,180,220,0.7); }
:deep(.ql-toolbar.ql-snow .ql-fill) { fill: rgba(180,180,220,0.7); }
:deep(.ql-toolbar.ql-snow button:hover .ql-stroke) { stroke: #a78bfa; }
:deep(.ql-toolbar.ql-snow button:hover .ql-fill) { fill: #a78bfa; }
:deep(.ql-toolbar.ql-snow .ql-picker-label) { color: rgba(180,180,220,0.7); }
:deep(.ql-toolbar.ql-snow .ql-picker-options) {
  background: #1a1a2e;
  border-color: rgba(255,255,255,0.09);
  color: rgba(220,220,245,0.9);
}
:deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  border-color: rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.03);
  font-family: inherit;
}
:deep(.ql-editor) {
  min-height: 200px;
  font-size: 0.875rem;
  color: rgba(220,220,245,0.9);
}
:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: rgba(160,160,192,0.4);
}
</style>
