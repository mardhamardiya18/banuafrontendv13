<template>
  <div class="detail-page">
    <TopNav :showMenu="false" />
    <div v-if="loading" class="detail-loading" role="status" aria-live="polite"><span></span><p>Menyiapkan hidangan...</p></div>
    <main class="detail-main" :aria-busy="loading">
      <div class="detail-navigation">
        <button @click="$router.back()" class="back-link"><ArrowLeft :size="19" aria-hidden="true" /> Kembali</button>
        <nav class="detail-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/">Beranda</RouterLink><span>/</span><RouterLink to="/katalog">Katalog</RouterLink><span>/</span><span aria-current="page">{{ product.name }}</span></nav>
      </div>
      <div class="detail-layout">
        <section class="gallery-section" aria-label="Galeri produk">
          <div class="gallery-heading"><span>Dari dapur kami</span><span class="gallery-edition">Untuk momen pian</span></div>
          <div class="gallery-stage">
            <swiper :key="route.params.slug" :modules="modules" :slides-per-view="1" :space-between="18" :keyboard="{ enabled: true, onlyInViewport: true }" @swiper="captureGallery" @slideChange="updateGallery" class="detail-gallery">
              <swiper-slide v-for="(img, index) in productImages" :key="img + index">
                <div class="gallery-image"><img :src="img" :alt="product.name + ', foto ' + (index + 1)" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" width="800" height="800" /></div>
              </swiper-slide>
            </swiper>
            <span class="gallery-label">Sajian penuh cerita</span>
          </div>
          <div class="gallery-controls" v-if="productImages.length > 1">
            <div class="gallery-thumbnails" aria-label="Pilih foto produk"><button v-for="(img, index) in productImages" :key="index" @click="showImage(index)" :class="{ selected: activeImage === index }" :aria-label="'Lihat foto ' + (index + 1)" :aria-pressed="activeImage === index"><img :src="img" alt="" loading="lazy" width="64" height="64" /></button></div>
            <div class="gallery-paging"><span aria-live="polite">{{ activeImage + 1 }} / {{ productImages.length }}</span><button @click="gallery?.slidePrev()" :disabled="activeImage === 0" aria-label="Foto sebelumnya"><ChevronLeft :size="20" /></button><button @click="gallery?.slideNext()" :disabled="activeImage === productImages.length - 1" aria-label="Foto berikutnya"><ChevronRight :size="20" /></button></div>
          </div>
        </section>
        <section class="product-panel" aria-labelledby="product-title">
          <div class="product-tags"><span>{{ product.category?.name || 'Catering Banua' }}</span><span v-if="product.is_recommended" class="recommended-tag">Pilihan dapur kami</span></div>
          <h1 id="product-title">{{ product.name }}</h1>
          <p class="panel-intro">Bawa rasa nyaman ke momen istimewa pian.</p>
          <div class="product-price"><p>Harga mulai dari</p><div><span>Rp</span><strong>{{ formatPriceValue(product.price) }}</strong></div><span v-if="product.discount > 0" class="discount-note">Diskon {{ product.discount }}% tersedia</span></div>
          <dl class="product-facts"><div><dt>Minimum pesanan</dt><dd>{{ product.min_order || 20 }} porsi</dd></div><div><dt>Sistem pemesanan</dt><dd>Pre-order (PO)</dd></div></dl>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="order-button">Pesan via WhatsApp <ArrowUpRight :size="24" aria-hidden="true" /></a>
          <p class="order-note">Yuk, obrolin tanggal acara dan kebutuhan pian bersama kami.</p>
          <a href="#product-description" class="description-jump">Kenali sajiannya <ArrowRight :size="17" aria-hidden="true" /></a>
        </section>
        <section id="product-description" class="product-description" aria-labelledby="description-title">
          <div class="description-heading"><span class="section-kicker">Tentang sajian ini</span><h2 id="description-title">Kenalan lebih dekat.</h2><p>Isi paket, pilihan, dan semua detail untuk acara pian.</p></div>
          <div class="description-content" v-html="product.description"></div>
        </section>
      </div>
      <section v-if="similarProducts.length" class="related-section" aria-labelledby="related-title">
        <div class="related-heading"><div><p class="section-kicker">Masih dari dapur kami</p><h2 id="related-title">Pilihan lainnya, sama nyamannya.</h2></div><RouterLink to="/katalog" class="catalog-link">Jelajahi semua menu <ArrowRight :size="20" aria-hidden="true" /></RouterLink></div>
        <div class="related-grid">
          <article v-for="item in similarProducts" :key="item.id" class="related-item">
            <RouterLink :to="'/produk/' + item.slug" class="related-link"><ProductPhoto :src="item.image" :name="item.name" class="related-photo" /><div class="related-name"><h3 class="font-body">{{ item.name }}</h3><span><ArrowUpRight :size="21" aria-hidden="true" /></span></div></RouterLink>
            <div class="related-price"><span>Mulai dari</span><strong>{{ formatPrice(item.price) }}</strong></div>
          </article>
        </div>
        <div class="related-signoff"><span>Rasa rumahan. Momen berkesan.</span><span aria-hidden="true"></span><span>Dapur Mamah Iis</span></div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Keyboard } from 'swiper/modules'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import ProductPhoto from '../components/catalog/ProductPhoto.vue'
import catalogApi from '../api/catalogApi'
import TopNav from '../components/catalog/TopNav.vue'
import Footer from '../components/catalog/Footer.vue'

import 'swiper/css'


const route = useRoute()
const router = useRouter()
const modules = [A11y, Keyboard]
const gallery = ref(null)
const activeImage = ref(0)
const captureGallery = (instance) => { gallery.value = instance }
const updateGallery = (instance) => { activeImage.value = instance.activeIndex }
const showImage = (index) => gallery.value?.slideTo(index)
const loading = ref(true)

const product = ref({
  name: 'Memuat...',
  price: 0,
  description: '',
  category: null,
  add_ons: [],
  is_recommended: false,
  discount: 0
})

const productImages = ref([])
const similarProducts = ref([])

const fetchProductDetail = async () => {
  loading.value = true
  activeImage.value = 0
  try {
    const slug = route.params.slug
    const res = await catalogApi.getProductDetail(slug)
    
    if (res.success && res.data) {
      const data = res.data
      product.value = data
      
      // Images mapping from Contract v2 galleries
      if (data.galleries && data.galleries.length > 0) {
        productImages.value = data.galleries.map(g => g.image_url)
      } else {
        productImages.value = [data.thumbnail || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop']
      }
      
      // Related products mapping
      if (data.related_products && data.related_products.length > 0) {
        similarProducts.value = data.related_products.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.thumbnail || p.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop'
        }))
      } else {
        similarProducts.value = []
      }
    } else {
      await router.replace({ name: 'Catalog' })
    }
  } catch (error) {
    console.error('Error fetching product detail:', error)
  } finally {
    loading.value = false
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

const formatPriceValue = (value) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0
  }).format(value)
}

const whatsappLink = computed(() => {
  const message = `Halo Min! Rencananya mau pesen "${product.value.name}" nih. Kira-kira buat ordernya gimana ya?`
  return `https://wa.me/6285156253408?text=${encodeURIComponent(message)}`
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchProductDetail()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onMounted(() => {
  fetchProductDetail()
})
</script>

<style scoped>
.detail-page { background: #fdfbf7; color: #690b22; min-height: 100vh; }
.detail-main { max-width: 1280px; margin: auto; padding: 116px 32px 90px; }
.detail-navigation { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 38px; }
.back-link { display: inline-flex; align-items: center; gap: 10px; color: #690b22; font-size: 12px; font-weight: 600; cursor: pointer; min-height: 44px; }
.detail-breadcrumb { display: flex; align-items: center; gap: 12px; font-size: 11px; color: #806d5d; min-width: 0; }
.detail-breadcrumb > :last-child { color: #690b22; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 260px; }
.detail-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 58px 70px; align-items: start; }
.gallery-section { min-width: 0; }
.gallery-heading { display: flex; justify-content: space-between; gap: 15px; align-items: center; margin-bottom: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: #806335; }
.gallery-edition { text-transform: none; letter-spacing: 0; font-size: 12px; transform: rotate(-3deg); }
.gallery-stage { position: relative; }
.gallery-stage::before { content: ''; position: absolute; inset: -7px 3px 6px -7px; border: 1px solid #c5a263; border-radius: 95px 30px 85px 30px; transform: rotate(-2deg); pointer-events: none; }
.detail-gallery { border-radius: 85px 25px 75px 25px; background: #eee3d1; }
.gallery-image { aspect-ratio: 1 / 1.02; }
.gallery-image img { width: 100%; height: 100%; object-fit: cover; }
.gallery-label { position: absolute; right: 25px; bottom: 23px; z-index: 2; padding: 11px 20px; background: #e9cd92; color: #690b22; font-size: 12px; font-weight: 600; transform: rotate(-5deg); pointer-events: none; }
.gallery-controls { display: flex; align-items: center; gap: 18px; justify-content: space-between; margin-top: 23px; }
.gallery-thumbnails { display: flex; gap: 9px; overflow-x: auto; padding: 4px; min-width: 0; }
.gallery-thumbnails button { flex-shrink: 0; width: 57px; height: 63px; padding: 3px; border-radius: 13px; border: 1px solid transparent; opacity: .6; cursor: pointer; }
.gallery-thumbnails button.selected { border-color: #690b22; opacity: 1; }
.gallery-thumbnails img { width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }
.gallery-paging { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.gallery-paging > span { font-size: 11px; font-variant-numeric: tabular-nums; margin-right: 7px; }
.gallery-paging button { display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #cbb691; border-radius: 50%; cursor: pointer; }
.gallery-paging button:disabled { opacity: .3; cursor: default; }
.gallery-paging button:not(:disabled):hover { background: #690b22; color: #e9cd92; }
.product-panel { grid-column: 2; grid-row: 1 / 3; position: sticky; top: 105px; padding: 26px 0 24px; border-top: 2px solid #bea16a; border-bottom: 1px solid #d9cdbb; }
.product-tags { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .09em; }
.recommended-tag { background: #e9cd92; padding: 7px 10px; transform: rotate(3deg); text-transform: none; letter-spacing: 0; }
.product-panel h1 { font-size: clamp(38px, 4vw, 58px); line-height: 1.18 !important; margin: 25px 0 16px; overflow-wrap: anywhere; }
.panel-intro { color: #79675c; font-size: 14px; line-height: 1.8; max-width: 320px; }
.product-price { margin: 28px 0; }
.product-price p { font-size: 11px; color: #79675c; margin-bottom: 7px; }
.product-price > div { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px; }
.product-price strong { font-size: clamp(32px, 3.3vw, 44px); letter-spacing: -.05em; line-height: 1.2; font-weight: 600; }
.product-price > div > span { font-size: 18px; color: #977333; }
.discount-note { display: inline-block; margin-top: 12px; color: #690b22; border-bottom: 2px solid #c5a263; font-size: 12px; }
.product-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 23px 0; border-block: 1px solid #dfd3c1; margin-bottom: 27px; }
.product-facts dt { font-size: 10px; color: #79675c; margin-bottom: 7px; }
.product-facts dd { font-size: 14px; font-weight: 600; }
.order-button { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 18px 23px; background: #690b22; color: #fff8eb; border-radius: 18px; box-shadow: 0 5px 0 #dfc795; font-size: 14px; font-weight: 600; transition: transform .2s, background .2s; }
.order-button svg { color: #e9cd92; }
.order-button:hover { background: #51091a; transform: translateY(-2px); }
.order-note { color: #79675c; font-size: 11px; line-height: 1.8; margin: 18px 0 24px; max-width: 320px; }
.description-jump { display: inline-flex; align-items: center; gap: 14px; font-size: 12px; font-weight: 600; }
.product-description { grid-column: 1; min-width: 0; scroll-margin-top: 100px; }
.description-heading { padding: 28px 0; border-top: 1px solid #cbb691; }
.section-kicker { display: block; color: #806335; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .14em; margin-bottom: 13px; }
.description-heading h2 { font-size: 36px; }
.description-heading > p { font-size: 12px; color: #79675c; margin-top: 9px; line-height: 1.8; }
.description-content { font-size: 14px; line-height: 1.95; color: #665b51; overflow-wrap: anywhere; }
.description-content :deep(p) { margin-bottom: 17px; }
.description-content :deep(strong), .description-content :deep(b) { color: #690b22; font-weight: 600; }
.description-content :deep(ul), .description-content :deep(ol) { padding-left: 22px; margin: 12px 0 26px; }
.description-content :deep(ul) { list-style: disc; }
.description-content :deep(ol) { list-style: decimal; }
.description-content :deep(li) { padding-left: 5px; margin-bottom: 5px; }
.description-content :deep(li::marker) { color: #a8813b; }
.description-content :deep(h1), .description-content :deep(h2), .description-content :deep(h3), .description-content :deep(h4) { color: #690b22; font-size: 23px; margin: 28px 0 12px; }
.description-content :deep(img) { max-width: 100%; height: auto; border-radius: 20px; }
.description-content :deep(table) { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; }
.description-content :deep(td), .description-content :deep(th) { padding: 9px 12px; border-bottom: 1px solid #dfd3c1; }
.description-content :deep(a) { color: #690b22; text-decoration: underline; }
.related-section { margin-top: 85px; padding: 55px 0 0; border-top: 1px solid #cbb691; }
.related-heading { display: flex; justify-content: space-between; gap: 30px; align-items: flex-end; margin-bottom: 38px; }
.related-heading h2 { font-size: clamp(32px, 3.5vw, 44px); max-width: 630px; }
.catalog-link { display: inline-flex; align-items: center; gap: 14px; font-size: 12px; font-weight: 600; border-bottom: 1px solid #cbb691; padding-bottom: 7px; flex-shrink: 0; }
.related-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; }
.related-item { min-width: 0; }
.related-item:nth-child(even) { margin-top: 30px; }
.related-link { display: block; }
.related-photo { aspect-ratio: 1 / 1.12; border-radius: 100px 100px 20px 20px; }
.related-item:nth-child(4n + 2) .related-photo { border-radius: 24px 80px 24px 80px; }
.related-item:nth-child(4n + 3) .related-photo { border-radius: 80px 24px 80px 24px; }
.related-item:nth-child(4n + 4) .related-photo { border-radius: 20px 20px 100px 100px; }
.related-link:hover :deep(img) { transform: scale(1.045); }
.related-name { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 19px 0; }
.related-name h3 { font-size: 18px; font-weight: 600; letter-spacing: -.025em; }
.related-name > span { display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid #cbb691; border-radius: 50%; flex-shrink: 0; }
.related-link:hover .related-name > span { background: #690b22; color: #e9cd92; }
.related-price { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; padding-top: 15px; border-top: 1px solid #d9cdbb; }
.related-price span { font-size: 11px; color: #79675c; }
.related-price strong { font-size: 16px; font-weight: 600; }
.related-signoff { display: flex; align-items: center; gap: 20px; font-size: 10px; color: #79675c; margin-top: 50px; }
.related-signoff > :nth-child(2) { flex: 1; height: 1px; background: #d9cdbb; }
.detail-main :is(a, button):focus-visible { outline: 3px solid #a8813b; outline-offset: 4px; }
.detail-loading { position: fixed; inset: 0; z-index: 100; background: #fdfbf7; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; font-size: 12px; }
.detail-loading > span { width: 40px; height: 40px; border: 3px solid #e9cd92; border-top-color: #690b22; border-radius: 50%; animation: detail-spin .8s linear infinite; }
@keyframes detail-spin { to { transform: rotate(360deg); } }
@media (max-width: 1023px) { .detail-layout { gap: 40px 35px; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); } .detail-main { padding-inline: 24px; } .product-panel { top: 95px; } .gallery-controls { flex-wrap: wrap; } .gallery-thumbnails { max-width: 100%; } .related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .related-heading { flex-wrap: wrap; } }
@media (max-width: 767px) { .detail-main { padding: 100px 22px 60px; } .detail-navigation { align-items: flex-start; flex-direction: column; gap: 10px; margin-bottom: 27px; } .detail-breadcrumb { width: 100%; font-size: 10px; gap: 9px; } .detail-layout { display: flex; flex-direction: column; gap: 36px; } .gallery-section, .product-panel, .product-description { width: 100%; } .gallery-heading { font-size: 9px; } .gallery-edition { font-size: 10px; } .gallery-image { aspect-ratio: 1; } .gallery-controls { flex-wrap: nowrap; gap: 10px; } .gallery-thumbnails button { width: 46px; height: 52px; } .gallery-paging { gap: 5px; } .gallery-paging button { width: 34px; height: 34px; } .gallery-paging > span { margin-right: 2px; font-size: 10px; } .product-panel { position: static; padding-top: 24px; } .product-panel h1 { font-size: 43px; } .product-price strong { font-size: 39px; } .panel-intro, .order-note { max-width: none; } .description-heading { padding-top: 0; border: 0; } .related-section { margin-top: 50px; padding-top: 36px; } .related-heading { gap: 22px; } .related-heading h2 { font-size: 34px; } .related-grid { gap: 28px 17px; } .related-name { gap: 5px; align-items: flex-start; } .related-name h3 { font-size: 14px; } .related-name > span { width: 28px; height: 28px; } .related-price strong { font-size: 13px; } .related-signoff { gap: 9px; font-size: 9px; } }
@media (max-width: 380px) { .related-grid { grid-template-columns: 1fr; } .related-item:nth-child(even) { margin-top: 0; } .related-name h3 { font-size: 18px; } }
@media (prefers-reduced-motion: reduce) { .detail-loading > span { animation: none; } .order-button, .related-photo :deep(img) { transition: none; } :deep(.swiper-wrapper) { transition-duration: 0ms !important; } }
</style>
