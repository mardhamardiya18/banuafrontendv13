<template>
  <section class="order-calendar" aria-labelledby="calendar-title" :aria-busy="loading">
    <header class="calendar-heading">
      <div><p class="calendar-eyebrow">AGENDA ORDER</p><h2 id="calendar-title">Jadwal pengantaran</h2></div>
      <button class="today-button" @click="resetToday">Hari ini</button>
    </header>
    <div class="calendar-month"><p>{{ rangeLabel }}</p><div class="week-controls"><button @click="moveWeek(-1)" aria-label="Minggu sebelumnya">‹</button><button @click="moveWeek(1)" aria-label="Minggu berikutnya">›</button></div></div>
    <div class="calendar-dates" aria-label="Pilih tanggal pengantaran">
      <button v-for="day in days" :key="day.key" @click="selectedKey = day.key" :aria-pressed="selectedKey === day.key" :aria-label="`${longDate(day.date)}, ${day.orders.length} order`" :aria-current="day.key === today ? 'date' : undefined" :class="{ selected: selectedKey === day.key, 'is-today': day.key === today }">
        <span>{{ day.date.toLocaleDateString('id-ID', { weekday: 'short' }) }}</span><strong>{{ day.date.getDate() }}</strong><span class="order-dot" :class="{ filled: !loading && day.orders.length }" aria-hidden="true"></span>
      </button>
    </div>
    <div class="agenda-heading"><h3 class="font-body">{{ longDate(selectedDay.date) }}</h3><span>{{ loading ? 'Memuat…' : `${selectedDay.orders.length} order` }}</span></div>
    <div v-if="loading" class="agenda-state" role="status">Memuat jadwal order…</div>
    <div v-else-if="error" class="agenda-state" role="alert"><p>Jadwal belum berhasil dimuat.</p><button class="today-button mt-3" @click="loadOrders">Coba lagi</button></div>
    <div v-else-if="!selectedDay.orders.length" class="agenda-state"><span class="empty-date">{{ selectedDay.date.getDate() }}</span><p>Belum ada jadwal di tanggal ini.</p><small>Pilih tanggal lain untuk melihat order.</small></div>
    <div v-else class="agenda-list">
      <RouterLink v-for="order in selectedDay.orders.slice(0, 3)" :key="order.id" :to="{ name: 'AdminOrderDetail', params: { id: order.id } }" class="agenda-row">
        <div class="agenda-time"><strong>{{ deliveryParts(order).time || '—' }}</strong><span>{{ order.delivery?.type === 'pickup' ? 'Ambil' : 'Antar' }}</span></div>
        <div class="agenda-info"><h4>{{ order.customer_snapshot?.name || order.invoice_number }}</h4><p>{{ productText(order) }}</p><small>{{ order.invoice_number }}</small></div>
        <span class="agenda-status" :class="{ processing: order.status?.order === 'processing' }">{{ order.status?.order === 'processing' ? 'Diproses' : 'Menunggu' }}</span>
      </RouterLink>
    </div>
    <footer class="calendar-footer"><span>Senin — Senin berikutnya</span><button v-if="!loading && !error && selectedDay.orders.length > 3" @click="showAll = true">Muat lainnya (+{{ selectedDay.orders.length - 3 }}) <span aria-hidden="true">↗</span></button></footer>
    <BaseModal v-model="showAll" :title="`Order · ${longDate(selectedDay.date)}`" size="lg">
      <p class="modal-summary">{{ selectedDay.orders.length }} order · Diurutkan berdasarkan jam antar / ambil</p>
      <div class="modal-orders">
        <RouterLink v-for="order in selectedDay.orders" :key="order.id" :to="{ name: 'AdminOrderDetail', params: { id: order.id } }" @click="showAll = false" class="agenda-row">
          <div class="agenda-time"><strong>{{ deliveryParts(order).time || '—' }}</strong><span>{{ order.delivery?.type === 'pickup' ? 'Ambil' : 'Antar' }}</span></div>
          <div class="agenda-info"><h4>{{ order.customer_snapshot?.name || order.invoice_number }}</h4><p>{{ productText(order) }}</p><small>{{ order.invoice_number }}</small></div>
          <span class="agenda-status" :class="{ processing: order.status?.order === 'processing' }">{{ order.status?.order === 'processing' ? 'Diproses' : 'Menunggu' }}</span>
        </RouterLink>
      </div>
    </BaseModal>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { orderApi } from '../../api/apiService'
import BaseModal from './BaseModal.vue'
import { calendarDays, deliveryParts, localDateKey, fetchScheduledOrders } from '../../utils/orderCalendar'
const today = localDateKey(new Date())
const anchor = ref(new Date())
const selectedKey = ref(today)
const orders = ref([])
const loading = ref(true)
const error = ref(false)
const showAll = ref(false)
const days = computed(() => calendarDays(anchor.value, orders.value))
const selectedDay = computed(() => days.value.find(day => day.key === selectedKey.value) || days.value[0])
const longDate = date => date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const rangeLabel = computed(() => `${days.value[0].date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${days.value[7].date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`)
function moveWeek(direction) { const date = new Date(anchor.value); date.setDate(date.getDate() + direction * 7); anchor.value = date; selectedKey.value = days.value[0].key }
function resetToday() { anchor.value = new Date(); selectedKey.value = localDateKey(anchor.value) }
function productText(order) { const item = order.items?.[0]; return item ? `${item.product?.name || item.package?.name || 'Produk'}${order.items.length > 1 ? ` +${order.items.length - 1} lainnya` : ''}` : 'Lihat detail order' }
async function loadOrders() { loading.value = true; error.value = false; try { orders.value = await fetchScheduledOrders((...args) => orderApi.getAll(...args)) } catch { error.value = true } finally { loading.value = false } }
function closeOnEscape(event) { if (event.key === 'Escape') showAll.value = false }
onMounted(() => { loadOrders(); window.addEventListener('keydown', closeOnEscape) })
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>
<style scoped>
.order-calendar { min-width: 0; display: flex; flex-direction: column; padding: 24px; border: 1px solid #ffffff0e; border-radius: 22px; background: #141420; color: #eeeef7; }
.calendar-heading,.calendar-month,.week-controls,.agenda-heading,.calendar-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.calendar-eyebrow { font-size: 9px; letter-spacing: .18em; color: #a78bfa; font-weight: 700; margin-bottom: 6px; }.calendar-heading h2 { font-size: 18px; font-weight: 700; letter-spacing: -.03em; }
.today-button { color: #c4b5fd; border: 1px solid #a78bfa30; padding: 8px 12px; border-radius: 10px; font-size: 11px; min-height: 40px; }
.calendar-month { margin: 20px 0 12px; font-size: 12px; font-weight: 600; }.week-controls { gap: 4px; }.week-controls button { width: 36px; height: 36px; border-radius: 10px; background: #ffffff05; font-size: 23px; color: #aaaac1; }
.calendar-dates { display: grid; grid-template-columns: repeat(8,minmax(0,1fr)); gap: 4px; padding-bottom: 17px; border-bottom: 1px solid #ffffff0d; }
.calendar-dates button { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 7px; border-radius: 14px; padding: 10px 0 7px; color: #a0a0bb; font-size: 10px; }.calendar-dates strong { font-size: 16px; color: #e4e4f2; }.calendar-dates .selected { background: #8b5cf6; color: #f5f0ff; box-shadow: 0 5px 18px #8b5cf625; }.calendar-dates .selected strong { color: white; }.calendar-dates .is-today:not(.selected) { background: #8b5cf614; }.order-dot { width: 4px; height: 4px; border-radius: 50%; background: transparent; }.order-dot.filled { background: #b9a0fb; }.selected .order-dot.filled { background: white; }
.agenda-heading { margin: 17px 0 4px; font-size: 11px; }.agenda-heading h3 { color: #c6c6dc; font-weight: 600; }.agenda-heading > span { color: #9494ae; white-space: nowrap; }
.agenda-list { flex: 1; }.agenda-row { display: flex; align-items: center; gap: 13px; padding: 16px 0; border-bottom: 1px solid #ffffff09; text-decoration: none; }.agenda-row:hover { background: #ffffff03; }.agenda-time { flex-shrink: 0; width: 49px; display: flex; flex-direction: column; gap: 4px; }.agenda-time strong { font-size: 13px; font-variant-numeric: tabular-nums; color: #ddd9ed; }.agenda-time span { color: #9494ae; font-size: 10px; }.agenda-info { min-width: 0; flex: 1; padding-left: 12px; border-left: 2px solid #a78bfa60; }.agenda-info h4 { font-size: 12px; color: #e7e7f4; font-weight: 650; }.agenda-info p { font-size: 11px; color: #a2a2bc; margin: 3px 0; }.agenda-info small { font-size: 9px; color: #8b8ba5; }.agenda-info h4,.agenda-info p { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }.agenda-status { font-size: 9px; padding: 5px 7px; border-radius: 6px; background: #fbbf2410; color: #e8c677; }.agenda-status.processing { background: #60a5fa10; color: #93c5fd; }
.agenda-state { flex: 1; min-height: 225px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #a2a2bc; font-size: 12px; }.agenda-state small { color: #85859e; font-size: 11px; }.empty-date { font-size: 28px; color: #bca8e8; font-weight: 700; margin-bottom: 5px; }
.calendar-footer { margin-top: auto; padding-top: 17px; font-size: 10px; color: #8888a3; flex-wrap: wrap; }.calendar-footer button { color: #c4b5fd; font-size: 11px; font-weight: 600; min-height: 40px; }.modal-summary { color: #a2a2bc; font-size: 12px; margin-bottom: 10px; }.modal-orders .agenda-info h4,.modal-orders .agenda-info p { white-space: normal; overflow-wrap: anywhere; }
button:focus-visible,a:focus-visible { outline: 2px solid #c4b5fd; outline-offset: 3px; }
@media(max-width: 479px) { .order-calendar { padding: 16px; }.calendar-heading h2 { font-size: 16px; }.calendar-dates { gap: 1px; }.calendar-dates button { border-radius: 10px; }.agenda-row { gap: 8px; flex-wrap: wrap; }.agenda-status { margin-left: auto; }.agenda-time { width: 42px; }.agenda-info { padding-left: 8px; }.agenda-heading { font-size: 10px; } }
</style>
