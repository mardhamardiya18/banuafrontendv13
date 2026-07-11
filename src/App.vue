<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import StoreClosedPopup from './components/common/StoreClosedPopup.vue'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.fetchStoreStatus()
})
</script>

<template>
  <StoreClosedPopup />
  <RouterView />
</template>
