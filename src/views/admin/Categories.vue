<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kategori</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola kategori produk catering Anda.</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
        <i class="bx bx-plus text-lg"></i>
        Tambah Kategori
      </button>
    </div>

    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari kategori..."
      @page-change="fetchData" @search="onSearch">
      <template #cell-thumbnail="{ value }">
        <img :src="value" alt="" class="w-10 h-10 rounded-xl object-cover border border-gray-100" />
      </template>
      <template #cell-name="{ value }">
        <span class="font-semibold text-gray-800">{{ value }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
            <i class="bx bx-edit-alt"></i>
          </button>
          <button @click="confirmDelete(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <i class="bx bx-trash"></i>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Form Modal -->
    <BaseModal v-model="showForm" :title="editItem ? 'Edit Kategori' : 'Tambah Kategori'">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Kategori</label>
          <input v-model="form.name" type="text" required
                 class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 outline-none transition-all"
                 placeholder="Masukkan nama kategori" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
          <input v-model="form.thumbnail" type="text"
                 class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 outline-none transition-all"
                 placeholder="https://..." />
        </div>
        <div v-if="form.thumbnail" class="flex items-center gap-3">
          <img :src="form.thumbnail" alt="preview" class="w-16 h-16 rounded-xl object-cover border border-gray-100" />
          <span class="text-xs text-gray-400">Preview thumbnail</span>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm = false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
          <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl hover:bg-brand-maroon/90 transition-colors disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>
            {{ editItem ? 'Simpan Perubahan' : 'Tambah' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDelete" title="Hapus Kategori?" :message="`Kategori '${deleteTarget?.name}' akan dihapus permanen.`" :loading="deleting" @confirm="handleDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { categoryApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false)
const data = ref([])
const meta = ref(null)
const search = ref('')
const perPage = ref(10)

const showForm = ref(false)
const editItem = ref(null)
const form = ref({ name: '', thumbnail: '' })
const saving = ref(false)

const showDelete = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const columns = [
  { key: 'thumbnail', label: 'Gambar' },
  { key: 'name', label: 'Nama Kategori' },
  { key: 'id', label: 'ID', tdClass: 'text-gray-400 font-mono text-xs' }
]

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const res = await categoryApi.getAll(page, perPage.value, search.value)
    if (res.status === 'success') {
      data.value = res.data
      meta.value = res.meta
    }
  } finally {
    loading.value = false
  }
}

const onSearch = () => fetchData(1)

const openForm = (item = null) => {
  editItem.value = item
  form.value = item ? { ...item } : { name: '', thumbnail: '' }
  showForm.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editItem.value) {
      await categoryApi.update(editItem.value.id, form.value)
      store.showToast('Kategori berhasil diperbarui')
    } else {
      await categoryApi.create(form.value)
      store.showToast('Kategori berhasil ditambahkan')
    }
    showForm.value = false
    await fetchData()
    await store.refreshCategories()
  } finally {
    saving.value = false
  }
}

const confirmDelete = (row) => {
  deleteTarget.value = row
  showDelete.value = true
}

const handleDelete = async () => {
  deleting.value = true
  try {
    await categoryApi.delete(deleteTarget.value.id)
    store.showToast('Kategori berhasil dihapus', 'success')
    showDelete.value = false
    await fetchData()
    await store.refreshCategories()
  } finally {
    deleting.value = false
  }
}

onMounted(() => fetchData())
</script>
