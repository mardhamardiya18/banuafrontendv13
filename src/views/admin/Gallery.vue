<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Gallery</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">Galeri foto produk — Create, Read, Delete.</p>
      </div>
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div class="relative group w-full sm:w-auto">
          <i class="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-lg" style="color: rgba(160,160,192,0.5);"></i>
          <input
            v-model="searchQuery"
            @keyup.enter="onSearch"
            type="text"
            placeholder="Cari foto..."
            class="dark-input pl-11 pr-14 w-full sm:w-72"
          />
          <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd class="hidden sm:inline-block text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded shadow-sm"
                 style="background: rgba(255,255,255,0.05); color: rgba(160,160,192,0.5); border: 1px solid rgba(255,255,255,0.08);">Enter ↵</kbd>
          </div>
        </div>
        <button @click="showForm=true" class="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
          <i class="bx bx-plus text-lg"></i> Tambah Foto
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="aspect-4/3 rounded-2xl animate-pulse"
           style="background: rgba(255,255,255,0.06);"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!data.length" class="py-20 text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
           style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);">
        <i class="bx bx-image text-3xl" style="color: rgba(160,160,192,0.4);"></i>
      </div>
      <p class="font-medium" style="color: rgba(160,160,192,0.6);">Belum ada foto</p>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="item in data" :key="item.id"
           class="group relative rounded-2xl overflow-hidden"
           style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);">
        <img :src="item.image_url" alt="" class="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
        <div class="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p class="text-white text-xs font-medium truncate">{{ item.product_name }}</p>
        </div>
        <button @click="confirmDel(item)"
                class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                style="background: rgba(248,113,113,0.15); color: #f87171; border: 1px solid rgba(248,113,113,0.25);"
                onmouseenter="this.style.background='rgba(248,113,113,0.3)';"
                onmouseleave="this.style.background='rgba(248,113,113,0.15)';">
          <i class="bx bx-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.last_page > 1" class="mt-6 px-4 flex items-center justify-between">
      <p class="text-sm text-gray-500">
        Menampilkan <span class="font-semibold text-gray-700">{{ (meta.current_page - 1) * meta.per_page + 1 }}</span>
        - <span class="font-semibold text-gray-700">{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</span>
        dari <span class="font-semibold text-gray-700">{{ meta.total }}</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          @click="fetchData(meta.current_page - 1)"
          :disabled="meta.current_page <= 1"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bx bx-chevron-left text-xl"></i>
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="fetchData(p)"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors"
          :class="p === meta.current_page
            ? 'bg-brand-maroon text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100'"
        >
          {{ p }}
        </button>
        <button
          @click="fetchData(meta.current_page + 1)"
          :disabled="meta.current_page >= meta.last_page"
          class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <i class="bx bx-chevron-right text-xl"></i>
        </button>
      </div>
    </div>

    <BaseModal v-model="showForm" title="Tambah Foto" size="md">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="dark-label">Produk</label>
          <SearchableSelect
            v-model="form.product_id"
            :options="products"
            placeholder="Pilih Produk..."
          />
        </div>
        <!-- Image Upload Area -->
        <div>
          <label class="dark-label">File Foto</label>
          <div @click="$refs.fileInput.click()" class="dark-upload-zone">
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
            <div v-if="previewUrl" class="relative">
              <img :src="previewUrl" alt="preview" class="w-full aspect-4/3 object-cover rounded-xl" style="border: 1px solid rgba(255,255,255,0.08);" />
              <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span class="text-white text-xs font-bold flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-md">
                  <i class="bx bx-camera text-base"></i> Ganti Foto
                </span>
              </div>
            </div>
            <div v-else class="py-8 flex flex-col items-center justify-center text-center">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                   style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);">
                <i class="bx bx-image-add text-3xl" style="color: rgba(160,160,192,0.5);"></i>
              </div>
              <p class="text-sm font-bold" style="color: rgba(200,200,230,0.8);">Klik untuk Unggah Foto</p>
            </div>
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="dark-btn-cancel">Batal</button>
          <button @click="save" :disabled="saving" class="dark-btn-primary">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Tambah
          </button>
        </div>
      </template>
    </BaseModal>
    <ConfirmDialog v-model="showDel" title="Hapus Foto?" message="Foto ini akan dihapus permanen." :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import SearchableSelect from '../../components/admin/SearchableSelect.vue'
import { galleryApi } from '../../api/apiService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null), products = ref([])
const searchQuery = ref('')
const showForm = ref(false), saving = ref(false)
const previewUrl = ref(null)
const form = ref({ product_id: '', image: null })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const visiblePages = computed(() => {
  if (!meta.value) return []
  const { current_page, last_page } = meta.value
  const pages = []
  const start = Math.max(1, current_page - 2)
  const end = Math.min(last_page, current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const fetchData = async (p = 1) => {
  loading.value = true
  try { 
    // Memuat 12 item per halaman agar pas dengan grid yang punya 4 kolom
    const r = await galleryApi.getAll(p, 12, searchQuery.value); 
    if (r.status === 'success') {
      data.value = r.data
      meta.value = r.meta
    }
  } finally { 
    loading.value = false 
  }
}
const onSearch = () => fetchData(1)
const save = async () => {
  saving.value = true
  try { 
    await galleryApi.create(form.value)
    store.showToast('Foto ditambahkan')
    showForm.value = false
    form.value = { product_id: '', image: null }
    previewUrl.value = null
    await fetchData() 
  }
  finally { saving.value = false }
}
const confirmDel = (item) => { delTarget.value = item; showDel.value = true }
const handleDel = async () => {
  deleting.value = true
  try { await galleryApi.delete(delTarget.value.id); store.showToast('Foto dihapus'); showDel.value = false; await fetchData() }
  finally { deleting.value = false }
}
onMounted(async () => { await store.fetchProducts(); products.value = store.products; await fetchData() })
</script>
