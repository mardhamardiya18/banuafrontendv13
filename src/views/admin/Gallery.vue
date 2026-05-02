<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gallery</h1>
        <p class="text-sm text-gray-500 mt-1">Galeri foto produk — Create, Read, Delete.</p>
      </div>
      <button @click="showForm=true" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Foto
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="aspect-4/3 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="!data.length" class="py-20 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="bx bx-image text-3xl text-gray-300"></i>
      </div>
      <p class="text-gray-400 font-medium">Belum ada foto</p>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <div v-for="item in data" :key="item.id" class="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <img :src="item.image_url" alt="" class="w-full aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p class="text-white text-xs font-medium truncate">{{ item.sub_product_name }}</p>
        </div>
        <button @click="confirmDel(item)" class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm">
          <i class="bx bx-trash text-sm"></i>
        </button>
      </div>
    </div>

    <BaseModal v-model="showForm" title="Tambah Foto" size="md">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Sub Produk</label>
          <select v-model="form.sub_product_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-maroon">
            <option value="" disabled>Pilih</option>
            <option v-for="sp in subs" :key="sp.id" :value="sp.id">{{ sp.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input v-model="form.image_url" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" placeholder="https://..." />
        </div>
        <img v-if="form.image_url" :src="form.image_url" alt="preview" class="w-full rounded-xl object-cover max-h-48" />
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Tambah
          </button>
        </div>
      </template>
    </BaseModal>
    <ConfirmDialog v-model="showDel" title="Hapus Foto?" message="Foto ini akan dihapus permanen." :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { galleryApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), subs = ref([])
const showForm = ref(false), saving = ref(false)
const form = ref({ sub_product_id: '', image_url: '' })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const fetchData = async () => {
  loading.value = true
  try { const r = await galleryApi.getAll(1, 50); if (r.status === 'success') data.value = r.data }
  finally { loading.value = false }
}
const save = async () => {
  saving.value = true
  try { await galleryApi.create(form.value); store.showToast('Foto ditambahkan'); showForm.value = false; form.value = { sub_product_id: '', image_url: '' }; await fetchData() }
  finally { saving.value = false }
}
const confirmDel = (item) => { delTarget.value = item; showDel.value = true }
const handleDel = async () => {
  deleting.value = true
  try { await galleryApi.delete(delTarget.value.id); store.showToast('Foto dihapus'); showDel.value = false; await fetchData() }
  finally { deleting.value = false }
}
onMounted(async () => { await store.fetchSubProducts(); subs.value = store.subProducts; await fetchData() })
</script>
