<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="router.back()" class="p-2 bg-white rounded-xl shadow-sm text-gray-400 hover:text-brand-maroon transition-colors">
        <i class="bx bx-left-arrow-alt text-2xl"></i>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Konfigurasi Paket: {{ subProduct?.name || '...' }}</h1>
        <p class="text-sm text-gray-500 mt-1">Atur inclusions, rules, set menus, dan add-ons untuk paket ini.</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto no-scrollbar">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
        class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap"
        :class="activeTab===tab.key ? 'bg-white text-brand-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content: Inclusions -->
    <div v-if="activeTab==='inclusions'" class="animate-fade-up">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">📦 Item Bawaan (Inclusions)</h2>
          <button @click="openInclusionForm()" class="bg-brand-maroon text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i class="bx bx-plus"></i> Tambah Item
          </button>
        </div>
        
        <div class="space-y-4">
          <div v-for="inc in inclusions" :key="inc.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-maroon shadow-sm border border-gray-100">
                <i class="bx bx-package text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-bold text-brand-forest-dark">{{ inc.menu_item?.name }}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ inc.menu_item?.menu?.name }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <span class="text-xs font-black text-brand-maroon italic">Qty: {{ inc.quantity }}</span>
              <button @click="handleDeleteInclusion(inc.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                <i class="bx bx-trash text-lg"></i>
              </button>
            </div>
          </div>
          <p v-if="inclusions.length === 0" class="text-center py-12 text-gray-300 font-bold uppercase tracking-widest text-xs">Belum ada item bawaan</p>
        </div>
      </div>
    </div>

    <!-- Tab Content: Selection Rules -->
    <div v-if="activeTab==='rules'" class="animate-fade-up">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">📋 Aturan Pilihan (Selection Rules)</h2>
          <button @click="openRuleForm()" class="bg-brand-maroon text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i class="bx bx-plus"></i> Tambah Aturan
          </button>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div v-for="rule in rules" :key="rule.id" class="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-black text-brand-forest-dark uppercase tracking-tight">{{ rule.menu?.name }}</h4>
                <p class="text-xs text-brand-maroon font-bold mt-1">Maks: {{ rule.max_choices }} Pilihan</p>
              </div>
              <button @click="handleDeleteRule(rule.id)" class="text-gray-300 hover:text-red-500">
                <i class="bx bx-trash text-lg"></i>
              </button>
            </div>
            <div class="pt-4 border-t border-gray-200">
              <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2">Tersedia:</p>
              <div class="flex flex-wrap gap-1">
                <span v-for="item in rule.menu?.menu_items" :key="item.id" class="text-[9px] bg-white border border-gray-100 px-2 py-1 rounded text-gray-500">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Set Menus (Validation Logic Here) -->
    <div v-if="activeTab==='set_menus'" class="animate-fade-up">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">⭐ Set Menu / Rekomendasi Chef</h2>
          <button @click="openSetMenuForm()" class="bg-brand-maroon text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i class="bx bx-plus"></i> Buat Set Menu
          </button>
        </div>

        <div class="grid gap-6">
          <div v-for="sm in setMenus" :key="sm.id" class="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="font-black text-brand-forest-dark uppercase tracking-tight">{{ sm.name }}</h4>
                <p class="text-xs text-gray-400 mt-1">{{ sm.description }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold" :class="sm.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-400'">{{ sm.is_active ? 'AKTIF' : 'OFF' }}</span>
                <button @click="handleDeleteSetMenu(sm.id)" class="text-gray-300 hover:text-red-500">
                  <i class="bx bx-trash text-lg"></i>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <div v-for="item in sm.items" :key="item.id" class="flex flex-col p-2 bg-white rounded-xl border border-gray-100 min-w-[100px]">
                <span class="text-[9px] text-gray-400 font-bold uppercase">{{ item.menu?.name || 'Item' }}</span>
                <span class="text-[11px] font-black text-brand-forest-dark">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content: Add-Ons -->
    <div v-if="activeTab==='addons'" class="animate-fade-up">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-brand-maroon/5 border border-brand-maroon/5 p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-sm font-black text-brand-maroon uppercase tracking-widest">🏷️ Add-Ons (Tambahan Berbayar)</h2>
          <button @click="openAddonForm()" class="bg-brand-maroon text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i class="bx bx-plus"></i> Tambah Add-On
          </button>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="addon in addons" :key="addon.id" class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
            <div>
              <h4 class="font-black text-brand-forest-dark uppercase tracking-tight text-sm">{{ addon.name }}</h4>
              <p class="text-xs text-brand-terracotta font-black italic mt-1">{{ formatPrice(addon.price) }}</p>
            </div>
            <button @click="handleDeleteAddon(addon.id)" class="text-gray-300 group-hover:text-red-500 transition-colors">
              <i class="bx bx-trash text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <!-- Inclusion Modal -->
    <BaseModal v-model="showInclusionForm" title="Tambah Item Bawaan">
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Pilih Item Lauk</label>
          <select v-model="inclusionForm.menu_item_id" class="form-input">
            <option value="" disabled>Pilih Item...</option>
            <option v-for="item in masterItems" :key="item.id" :value="item.id">
              {{ item.name }} ({{ item.menu?.name }})
            </option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Jumlah (Qty)</label>
          <input v-model.number="inclusionForm.quantity" type="number" class="form-input" min="1" />
        </div>
      </div>
      <template #footer>
        <button @click="saveInclusion" :disabled="saving" class="btn-primary w-full py-4">Simpan Inclusion</button>
      </template>
    </BaseModal>

    <!-- Selection Rule Modal -->
    <BaseModal v-model="showRuleForm" title="Tambah Aturan Pilihan">
      <div class="space-y-4">
        <div v-if="apiErrors.menu_id" class="p-3 bg-red-50 text-red-500 text-xs rounded-xl font-bold mb-4">
          {{ apiErrors.menu_id[0] }}
        </div>
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori Lauk</label>
          <select v-model="ruleForm.menu_id" class="form-input">
            <option value="" disabled>Pilih Kategori...</option>
            <option v-for="menu in masterMenus" :key="menu.id" :value="menu.id">{{ menu.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Maksimal Pilihan</label>
          <input v-model.number="ruleForm.max_choices" type="number" class="form-input" min="1" />
        </div>
      </div>
      <template #footer>
        <button @click="saveRule" :disabled="saving" class="btn-primary w-full py-4">Simpan Aturan</button>
      </template>
    </BaseModal>

    <!-- Set Menu Modal (With Validation Logic) -->
    <BaseModal v-model="showSetMenuForm" title="Buat Set Menu Baru" size="lg">
      <div class="space-y-6">
        <div v-if="Object.keys(apiErrors).length > 0" class="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2">
          <p class="text-xs font-black text-red-600 uppercase tracking-widest">Gagal Validasi:</p>
          <ul class="list-disc list-inside text-[11px] text-red-500 font-bold italic">
            <li v-for="(err, key) in apiErrors" :key="key">{{ err[0] }}</li>
          </ul>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Set Menu</label>
            <input v-model="setMenuForm.name" type="text" placeholder="Rekomendasi Chef A" class="form-input" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</label>
            <select v-model="setMenuForm.is_active" class="form-input">
              <option :value="true">Aktif</option>
              <option :value="false">Nonaktif</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deskripsi</label>
          <textarea v-model="setMenuForm.description" rows="2" class="form-input resize-none" placeholder="Ceritakan tentang set menu ini..."></textarea>
        </div>

        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Pilih Item Lauk (Sesuai Selection Rules)</label>
          <div v-if="allowedItems.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            <label v-for="item in allowedItems" :key="item.id" 
              class="flex flex-col p-3 rounded-2xl border cursor-pointer transition-all duration-300"
              :class="setMenuForm.menu_item_ids.includes(item.id) ? 'bg-brand-maroon/5 border-brand-maroon/30 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'"
            >
              <input type="checkbox" :value="item.id" v-model="setMenuForm.menu_item_ids" class="hidden" />
              <div class="flex items-center gap-2">
                <i :class="setMenuForm.menu_item_ids.includes(item.id) ? 'bx bxs-check-circle text-brand-maroon' : 'bx bx-circle text-gray-300'" class="text-lg"></i>
                <span class="text-[11px] font-black text-brand-forest-dark uppercase truncate">{{ item.name }}</span>
              </div>
              <span class="text-[9px] text-gray-400 font-bold mt-1 ml-6">{{ item.menu?.name }}</span>
            </label>
          </div>
          <div v-else class="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">⚠️ Daftarkan 'Aturan Pilihan' terlebih dahulu agar item lauk muncul di sini.</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button @click="saveSetMenu" :disabled="saving" class="btn-primary w-full py-4 flex items-center justify-center gap-2">
          <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>
          Simpan Set Menu
        </button>
      </template>
    </BaseModal>

    <!-- Addon Modal -->
    <BaseModal v-model="showAddonForm" title="Tambah Add-On Baru">
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama Add-On</label>
          <input v-model="addonForm.name" type="text" placeholder="Misal: Ekstra Sambal" class="form-input" />
        </div>
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Harga Tambahan</label>
          <input v-model.number="addonForm.price" type="number" class="form-input" />
        </div>
      </div>
      <template #footer>
        <button @click="saveAddon" :disabled="saving" class="btn-primary w-full py-4">Simpan Add-On</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { subProductApi, inclusionApi, selectionRuleApi, setMenuApi, addonApi, referenceApi } from '../../api/apiService'
import { useAdminStore } from '../../stores/admin'
import BaseModal from '../../components/admin/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const store = useAdminStore()
const subProductId = route.params.id

// Page State
const subProduct = ref(null)
const activeTab = ref('inclusions')
const tabs = [
  { key: 'inclusions', label: 'Item Bawaan' },
  { key: 'rules', label: 'Aturan Pilihan' },
  { key: 'set_menus', label: 'Set Menu' },
  { key: 'addons', label: 'Add-Ons' }
]
const saving = ref(false)
const apiErrors = ref({})

// Data Lists
const inclusions = ref([])
const rules = ref([])
const setMenus = ref([])
const addons = ref([])
const masterItems = ref([])
const masterMenus = ref([])

// Computed: Filter items that belong to categories defined in Selection Rules
const allowedItems = computed(() => {
  if (rules.value.length === 0) return []
  const allowedMenuIds = rules.value.map(r => r.menu_id || r.menu?.id)
  return masterItems.value.filter(item => allowedMenuIds.includes(item.menu_id || item.menu?.id))
})

// Form States
const showInclusionForm = ref(false)
const inclusionForm = reactive({ menu_item_id: '', quantity: 1 })

const showRuleForm = ref(false)
const ruleForm = reactive({ menu_id: '', max_choices: 1 })

const showSetMenuForm = ref(false)
const setMenuForm = reactive({ name: '', description: '', is_active: true, menu_item_ids: [] })

const showAddonForm = ref(false)
const addonForm = reactive({ name: '', price: 0, is_active: true, sub_product_id: subProductId })

// --- FETCH LOGIC ---
const fetchConfig = async () => {
  const [pRes, iRes, rRes, sRes, aRes] = await Promise.all([
    subProductApi.getById(subProductId),
    inclusionApi.getAll(subProductId),
    selectionRuleApi.getAll(subProductId),
    setMenuApi.getAll(subProductId),
    addonApi.getAll(1, 100, '', subProductId)
  ])
  
  if (pRes.status === 'success') subProduct.value = pRes.data
  if (iRes.status === 'success') inclusions.value = iRes.data
  if (rRes.status === 'success') rules.value = rRes.data
  if (sRes.status === 'success') setMenus.value = sRes.data
  if (aRes.status === 'success') {
    // Filter addons manually if API doesn't support sub_product_id query perfectly
    addons.value = aRes.data.filter(a => a.sub_product_id === subProductId)
  }
}

// --- SAVE LOGIC ---
const saveInclusion = async () => {
  saving.value = true
  try {
    const res = await inclusionApi.create(subProductId, inclusionForm)
    if (res.status === 'success') {
      store.showToast('Item bawaan ditambahkan')
      showInclusionForm.value = false
      await fetchConfig()
    }
  } finally { saving.value = false }
}

const saveRule = async () => {
  saving.value = true
  apiErrors.value = {}
  try {
    const res = await selectionRuleApi.create(subProductId, ruleForm)
    if (res.status === 'success') {
      store.showToast('Aturan pilihan disimpan')
      showRuleForm.value = false
      await fetchConfig()
    }
  } catch (err) {
    if (err.response?.status === 422) apiErrors.value = err.response.data.errors
  } finally { saving.value = false }
}

const saveSetMenu = async () => {
  saving.value = true
  apiErrors.value = {}
  try {
    const res = await setMenuApi.create(subProductId, setMenuForm)
    if (res.status === 'success') {
      store.showToast('Set menu berhasil dibuat')
      showSetMenuForm.value = false
      await fetchConfig()
    }
  } catch (err) {
    if (err.response?.status === 422) apiErrors.value = err.response.data.errors
    else store.showToast('Gagal menyimpan set menu', 'error')
  } finally { saving.value = false }
}

const saveAddon = async () => {
  saving.value = true
  try {
    const res = await addonApi.create(addonForm)
    if (res.status === 'success') {
      store.showToast('Add-on ditambahkan')
      showAddonForm.value = false
      await fetchConfig()
    }
  } finally { saving.value = false }
}

// --- DELETE LOGIC ---
const handleDeleteInclusion = async (id) => {
  if (confirm('Hapus item bawaan?')) {
    await inclusionApi.delete(id)
    fetchConfig()
  }
}
const handleDeleteRule = async (id) => {
  if (confirm('Hapus aturan ini?')) {
    await selectionRuleApi.delete(id)
    fetchConfig()
  }
}
const handleDeleteSetMenu = async (id) => {
  if (confirm('Hapus set menu ini?')) {
    await setMenuApi.delete(id)
    fetchConfig()
  }
}
const handleDeleteAddon = async (id) => {
  if (confirm('Hapus add-on ini?')) {
    await addonApi.delete(id)
    fetchConfig()
  }
}

// --- FORM OPENERS ---
const openInclusionForm = () => {
  inclusionForm.menu_item_id = ''
  inclusionForm.quantity = 1
  showInclusionForm.value = true
}
const openRuleForm = () => {
  ruleForm.menu_id = ''
  ruleForm.max_choices = 1
  apiErrors.value = {}
  showRuleForm.value = true
}
const openSetMenuForm = () => {
  setMenuForm.name = ''
  setMenuForm.description = ''
  setMenuForm.is_active = true
  setMenuForm.menu_item_ids = []
  apiErrors.value = {}
  showSetMenuForm.value = true
}
const openAddonForm = () => {
  addonForm.name = ''
  addonForm.price = 0
  showAddonForm.value = true
}

// --- UTILS ---
const formatPrice = (v) => `Rp ${v.toLocaleString('id-ID')}`

onMounted(async () => {
  fetchConfig()
  const [iRes, mRes] = await Promise.all([
    referenceApi.getMenuItems(),
    referenceApi.getMenus()
  ])
  if (iRes.status === 'success') masterItems.value = iRes.data
  if (mRes.status === 'success') masterMenus.value = mRes.data
})
</script>

<style scoped>
@reference "../../style.css";

.form-input {
  @apply w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-forest-dark outline-none focus:bg-white focus:border-brand-maroon/20 focus:ring-4 focus:ring-brand-maroon/5 transition-all duration-300;
}

.btn-primary {
  @apply bg-brand-maroon text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-brand-maroon/20 hover:shadow-brand-maroon/40 hover:-translate-y-1 active:scale-95 transition-all duration-500;
}

.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
