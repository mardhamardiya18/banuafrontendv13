<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Menu</h1>
        <p class="text-sm text-gray-500 mt-1">Master Menu, Menu Items, dan Add-ons.</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
        class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        :class="activeTab===tab.key ? 'bg-white text-brand-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab: Master Menu -->
    <div v-if="activeTab==='menus'">
      <div class="flex justify-end mb-4">
        <button @click="openMenuForm()" class="flex items-center gap-2 bg-brand-maroon text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
          <i class="bx bx-plus text-lg"></i> Tambah Menu
        </button>
      </div>
      <DataTable :columns="menuCols" :data="menuData" :meta="menuMeta" :loading="menuLoading"
        v-model:search-query="menuSearch" v-model:per-page="menuPerPage"
        search-placeholder="Cari menu..."
        @page-change="fetchMenus" @search="() => fetchMenus(1)">
        <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button @click="openMenuForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><i class="bx bx-edit-alt"></i></button>
            <button @click="delTarget=row;showDel=true" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><i class="bx bx-trash"></i></button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Tab: Menu Items -->
    <div v-if="activeTab==='items'">
      <div class="flex justify-end mb-4">
        <button @click="openItemForm()" class="flex items-center gap-2 bg-brand-maroon text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
          <i class="bx bx-plus text-lg"></i> Tambah Item
        </button>
      </div>
      <DataTable :columns="itemCols" :data="itemData" :meta="itemMeta" :loading="itemLoading"
        v-model:search-query="itemSearch" v-model:per-page="itemPerPage"
        search-placeholder="Cari item menu..."
        @page-change="fetchItems" @search="() => fetchItems(1)">
        <template #cell-thumbnail="{ value }"><img :src="value" alt="" class="w-10 h-10 rounded-xl object-cover border border-gray-100" /></template>
        <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
        <template #cell-menu_name="{ value }"><span class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">{{ value }}</span></template>
        <template #cell-type="{ value }"><span class="px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-medium text-blue-600">{{ value }}</span></template>
        <template #cell-is_active="{ value }">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="value?'bg-emerald-50 text-emerald-600':'bg-gray-100 text-gray-400'">{{ value?'Aktif':'Off' }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button @click="openItemForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><i class="bx bx-edit-alt"></i></button>
            <button @click="delTarget=row;delType='item';showDel=true" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><i class="bx bx-trash"></i></button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Tab: Add-ons -->
    <div v-if="activeTab==='addons'">
      <div class="flex justify-end mb-4">
        <button @click="openAddonForm()" class="flex items-center gap-2 bg-brand-maroon text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
          <i class="bx bx-plus text-lg"></i> Tambah Add-on
        </button>
      </div>
      <DataTable :columns="addonCols" :data="addonData" :meta="addonMeta" :loading="addonLoading"
        v-model:search-query="addonSearch" v-model:per-page="addonPerPage"
        search-placeholder="Cari add-on..."
        @page-change="fetchAddons" @search="() => fetchAddons(1)">
        <template #cell-name="{ value }"><span class="font-semibold text-gray-800">{{ value }}</span></template>
        <template #cell-sub_product_name="{ value }"><span class="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">{{ value }}</span></template>
        <template #cell-price="{ value }"><span class="font-semibold">Rp {{ value.toLocaleString('id-ID') }}</span></template>
        <template #cell-is_active="{ value }">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="value?'bg-emerald-50 text-emerald-600':'bg-gray-100 text-gray-400'">{{ value?'Aktif':'Off' }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button @click="openAddonForm(row)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><i class="bx bx-edit-alt"></i></button>
            <button @click="delTarget=row;delType='addon';showDel=true" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><i class="bx bx-trash"></i></button>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Menu Form Modal -->
    <BaseModal v-model="showMenuForm" :title="editMenu ? 'Edit Menu' : 'Tambah Menu'">
      <form @submit.prevent="saveMenu" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Menu</label>
          <input v-model="menuForm.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showMenuForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="saveMenu" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Simpan
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Item Form Modal -->
    <BaseModal v-model="showItemForm" :title="editItem ? 'Edit Menu Item' : 'Tambah Menu Item'" size="lg">
      <form @submit.prevent="saveItem" class="space-y-5">
        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Master Menu</label>
            <select v-model="itemForm.menu_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-maroon">
              <option value="" disabled>Pilih</option>
              <option v-for="m in menuList" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Item</label>
            <input v-model="itemForm.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tipe</label>
            <input v-model="itemForm.type" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" placeholder="protein / vegetable" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
            <input v-model.number="itemForm.display_order" type="number" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
            <input v-model="itemForm.thumbnail" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi</label>
          <textarea v-model="itemForm.description" rows="2" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon resize-none"></textarea>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="itemForm.is_active" class="w-4 h-4 rounded accent-brand-maroon" />
          <span class="text-sm text-gray-700">Aktif</span>
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showItemForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="saveItem" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Simpan
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Addon Form Modal -->
    <BaseModal v-model="showAddonForm" :title="editAddon ? 'Edit Add-on' : 'Tambah Add-on'">
      <form @submit.prevent="saveAddon" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Sub Produk</label>
          <select v-model="addonForm.sub_product_id" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white focus:border-brand-maroon">
            <option value="" disabled>Pilih</option>
            <option v-for="sp in subList" :key="sp.id" :value="sp.id">{{ sp.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Add-on</label>
          <input v-model="addonForm.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Harga</label>
          <input v-model.number="addonForm.price" type="number" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-maroon" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="addonForm.is_active" class="w-4 h-4 rounded accent-brand-maroon" />
          <span class="text-sm text-gray-700">Aktif</span>
        </label>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showAddonForm=false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
          <button @click="saveAddon" :disabled="saving" class="px-5 py-2.5 text-sm font-semibold bg-brand-maroon text-white rounded-xl disabled:opacity-60 flex items-center gap-2">
            <i v-if="saving" class="bx bx-loader-alt bx-spin"></i>Simpan
          </button>
        </div>
      </template>
    </BaseModal>

    <ConfirmDialog v-model="showDel" title="Hapus Data?" :message="`Data '${delTarget?.name}' akan dihapus.`" :loading="deleting" @confirm="handleDel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../../components/admin/DataTable.vue'
import BaseModal from '../../components/admin/BaseModal.vue'
import ConfirmDialog from '../../components/admin/ConfirmDialog.vue'
import { menuApi, menuItemApi, addonApi } from '../../api/mockService'
import { useAdminStore } from '../../stores/admin'

const store = useAdminStore()
const activeTab = ref('menus')
const tabs = [{ key: 'menus', label: 'Master Menu' }, { key: 'items', label: 'Menu Items' }, { key: 'addons', label: 'Add-ons' }]
const saving = ref(false)
const showDel = ref(false), delTarget = ref(null), delType = ref('menu'), deleting = ref(false)

// --- Master Menu ---
const menuLoading = ref(false), menuData = ref([]), menuMeta = ref(null)
const menuSearch = ref(''), menuPerPage = ref(10)
const showMenuForm = ref(false), editMenu = ref(null), menuForm = ref({ name: '' })
const menuCols = [{ key: 'name', label: 'Nama Menu' }, { key: 'id', label: 'ID', tdClass: 'text-gray-400 font-mono text-xs' }]

const fetchMenus = async (p = 1) => { menuLoading.value = true; try { const r = await menuApi.getAll(p, menuPerPage.value, menuSearch.value); if (r.status === 'success') { menuData.value = r.data; menuMeta.value = r.meta } } finally { menuLoading.value = false } }
const openMenuForm = (item = null) => { editMenu.value = item; menuForm.value = item ? { ...item } : { name: '' }; showMenuForm.value = true }
const saveMenu = async () => {
  saving.value = true
  try { if (editMenu.value) { await menuApi.update(editMenu.value.id, menuForm.value); store.showToast('Menu diperbarui') } else { await menuApi.create(menuForm.value); store.showToast('Menu ditambahkan') }; showMenuForm.value = false; await fetchMenus(); await store.refreshMenus() } finally { saving.value = false }
}

// --- Menu Items ---
const itemLoading = ref(false), itemData = ref([]), itemMeta = ref(null), menuList = ref([])
const itemSearch = ref(''), itemPerPage = ref(10)
const showItemForm = ref(false), editItem = ref(null)
const emptyItemForm = { menu_id: '', name: '', type: '', is_active: true, description: '', thumbnail: '', display_order: 1 }
const itemForm = ref({ ...emptyItemForm })
const itemCols = [{ key: 'thumbnail', label: 'Img' }, { key: 'name', label: 'Nama' }, { key: 'menu_name', label: 'Menu' }, { key: 'type', label: 'Tipe' }, { key: 'is_active', label: 'Status' }]

const fetchItems = async (p = 1) => { itemLoading.value = true; try { const r = await menuItemApi.getAll(p, itemPerPage.value, itemSearch.value); if (r.status === 'success') { itemData.value = r.data; itemMeta.value = r.meta } } finally { itemLoading.value = false } }
const openItemForm = (item = null) => { editItem.value = item; itemForm.value = item ? { ...item } : { ...emptyItemForm }; showItemForm.value = true }
const saveItem = async () => {
  saving.value = true
  try { if (editItem.value) { await menuItemApi.update(editItem.value.id, itemForm.value); store.showToast('Item diperbarui') } else { await menuItemApi.create(itemForm.value); store.showToast('Item ditambahkan') }; showItemForm.value = false; await fetchItems() } finally { saving.value = false }
}

// --- Add-ons ---
const addonLoading = ref(false), addonData = ref([]), addonMeta = ref(null), subList = ref([])
const addonSearch = ref(''), addonPerPage = ref(10)
const showAddonForm = ref(false), editAddon = ref(null)
const addonForm = ref({ sub_product_id: '', name: '', price: 0, is_active: true })
const addonCols = [{ key: 'name', label: 'Nama' }, { key: 'sub_product_name', label: 'Sub Produk' }, { key: 'price', label: 'Harga' }, { key: 'is_active', label: 'Status' }]

const fetchAddons = async (p = 1) => { addonLoading.value = true; try { const r = await addonApi.getAll(p, addonPerPage.value, addonSearch.value); if (r.status === 'success') { addonData.value = r.data; addonMeta.value = r.meta } } finally { addonLoading.value = false } }
const openAddonForm = (item = null) => { editAddon.value = item; addonForm.value = item ? { ...item } : { sub_product_id: '', name: '', price: 0, is_active: true }; showAddonForm.value = true }
const saveAddon = async () => {
  saving.value = true
  try { if (editAddon.value) { await addonApi.update(editAddon.value.id, addonForm.value); store.showToast('Add-on diperbarui') } else { await addonApi.create(addonForm.value); store.showToast('Add-on ditambahkan') }; showAddonForm.value = false; await fetchAddons() } finally { saving.value = false }
}

// --- Delete handler ---
const handleDel = async () => {
  deleting.value = true
  try {
    if (delType.value === 'item') await menuItemApi.delete(delTarget.value.id)
    else if (delType.value === 'addon') await addonApi.delete(delTarget.value.id)
    else await menuApi.delete(delTarget.value.id)
    store.showToast('Data dihapus'); showDel.value = false
    if (delType.value === 'item') await fetchItems()
    else if (delType.value === 'addon') await fetchAddons()
    else { await fetchMenus(); await store.refreshMenus() }
  } finally { deleting.value = false }
}

onMounted(async () => {
  await Promise.all([store.fetchMenus(), store.fetchSubProducts()])
  menuList.value = store.menus; subList.value = store.subProducts
  await Promise.all([fetchMenus(), fetchItems(), fetchAddons()])
})
</script>
