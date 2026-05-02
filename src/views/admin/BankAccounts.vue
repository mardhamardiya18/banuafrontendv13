<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bank Account</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola rekening bank untuk pembayaran.</p>
      </div>
      <button @click="openForm()" class="flex items-center gap-2 bg-brand-maroon hover:bg-brand-maroon/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
        <i class="bx bx-plus text-lg"></i> Tambah Bank
      </button>
    </div>

    <DataTable :columns="columns" :data="data" :meta="meta" :loading="loading"
      v-model:search-query="search" v-model:per-page="perPage"
      search-placeholder="Cari bank atau rekening..."
      @page-change="fetchData" @search="onSearch">
      <template #cell-logo_url="{ value }">
        <img :src="value" alt="" class="h-8 rounded-lg border border-gray-100 object-contain" />
      </template>
      <template #cell-bank_name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
      <template #cell-account_number="{ value }"><span class="font-mono text-sm text-gray-600">{{ value }}</span></template>
      <template #cell-is_active="{ value }">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="value?'bg-emerald-50 text-emerald-600':'bg-gray-100 text-gray-400'">{{ value?'Aktif':'Nonaktif' }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><i class="bx bx-edit-alt"></i></button>
          <button @click="delTarget=row;showDel=true" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><i class="bx bx-trash"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Bank' : 'Tambah Bank'" size="md">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Bank</label>
          <input v-model="form.bank_name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nomor Rekening</label>
          <input v-model="form.account_number" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Pemilik</label>
          <input v-model="form.account_name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Logo URL</label>
          <input v-model="form.logo_url" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="form.is_active" class="w-4 h-4 rounded accent-brand-maroon" />
          <span class="text-sm text-gray-700">Aktif</span>
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Simpan
          </button>
        </div>
      </template>
    </BaseModal>
    <ConfirmDialog v-model="showDel" title="Hapus Bank?" :message="`Bank '${delTarget?.bank_name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { bankAccountApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const loading = ref(false), data = ref([]), meta = ref(null)
const search = ref(''), perPage = ref(10)
const showForm = ref(false), editItem = ref(null), saving = ref(false)
const emptyForm = { bank_name: '', account_number: '', account_name: '', logo_url: '', is_active: true }
const form = ref({ ...emptyForm })
const showDel = ref(false), delTarget = ref(null), deleting = ref(false)

const columns = [
  { key: 'logo_url', label: 'Logo' },
  { key: 'bank_name', label: 'Bank' },
  { key: 'account_number', label: 'No. Rekening' },
  { key: 'account_name', label: 'Pemilik' },
  { key: 'is_active', label: 'Status' }
]

const fetchData = async (p = 1) => {
  loading.value = true
  try { const r = await bankAccountApi.getAll(p, perPage.value, search.value); if (r.status === 'success') { data.value = r.data; meta.value = r.meta } }
  finally { loading.value = false }
}
const onSearch = () => fetchData(1)
const openForm = (item = null) => { editItem.value = item; form.value = item ? { ...item } : { ...emptyForm }; showForm.value = true }
const save = async () => {
  saving.value = true
  try {
    if (editItem.value) { await bankAccountApi.update(editItem.value.id, form.value); store.showToast('Bank diperbarui') }
    else { await bankAccountApi.create(form.value); store.showToast('Bank ditambahkan') }
    showForm.value = false; await fetchData()
  } finally { saving.value = false }
}
const handleDel = async () => {
  deleting.value = true
  try { await bankAccountApi.delete(delTarget.value.id); store.showToast('Bank dihapus'); showDel.value = false; await fetchData() }
  finally { deleting.value = false }
}
onMounted(() => fetchData())
</script>
