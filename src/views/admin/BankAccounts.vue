<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" style="color: rgba(224,224,239,0.95);">Bank Account</h1>
        <p class="text-sm mt-1" style="color: rgba(160,160,192,0.6);">Kelola rekening bank untuk pembayaran.</p>
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
        <img :src="value" alt="" class="h-8 rounded-lg object-contain" style="border: 1px solid rgba(255,255,255,0.08);" />
      </template>
      <template #cell-bank_name="{ value }"><span class="font-semibold" style="color: rgba(230,230,250,0.97);">{{ value }}</span></template>
      <template #cell-account_number="{ value }"><span class="font-mono text-sm" style="color: rgba(200,200,230,0.85);">{{ value }}</span></template>
      <template #cell-is_active="{ value }">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :style="value
                ? 'background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.2);'
                : 'background: rgba(160,160,192,0.08); color: rgba(160,160,192,0.5); border: 1px solid rgba(160,160,192,0.15);'"
        >{{ value ? 'Aktif' : 'Nonaktif' }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button @click="openForm(row)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style="color: rgba(160,160,192,0.6);"
                  onmouseenter="this.style.background='rgba(96,165,250,0.12)'; this.style.color='#60a5fa';"
                  onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
          ><i class="bx bx-edit-alt"></i></button>
          <button @click="delTarget=row;showDel=true"
                  class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style="color: rgba(160,160,192,0.6);"
                  onmouseenter="this.style.background='rgba(248,113,113,0.12)'; this.style.color='#f87171';"
                  onmouseleave="this.style.background=''; this.style.color='rgba(160,160,192,0.6)';"
          ><i class="bx bx-trash"></i></button>
        </div>
      </template>
    </DataTable>

    <BaseModal v-model="showForm" :title="editItem ? 'Edit Bank' : 'Tambah Bank'" size="md">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="dark-label">Nama Bank</label>
          <input v-model="form.bank_name" type="text" required class="dark-input" placeholder="Contoh: BCA, Mandiri" />
        </div>
        <div>
          <label class="dark-label">Nomor Rekening</label>
          <input v-model="form.account_number" type="text" required class="dark-input" />
        </div>
        <div>
          <label class="dark-label">Nama Pemilik</label>
          <input v-model="form.account_name" type="text" required class="dark-input" />
        </div>
        <div>
          <label class="dark-label">Logo URL</label>
          <input v-model="form.logo_url" type="text" class="dark-input" placeholder="https://..." />
        </div>
        <label class="flex items-center gap-2 cursor-pointer" style="color: rgba(190,190,220,0.75);">
          <input type="checkbox" v-model="form.is_active" class="w-4 h-4 accent-purple-500 rounded" />
          <span class="text-sm font-medium">Aktif</span>
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showForm=false" class="dark-btn-cancel">Batal</button>
          <button @click="save" :disabled="saving" class="dark-btn-primary">
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
import { bankAccountApi } from '../../api/apiService'
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
