<template>
  <div class="bg-paper min-h-screen">

    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-brand-maroon focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Langsung ke konten utama</a>

    <!-- NAVBAR (Consistent with Catalog & Detail) -->
    <TopNav />

    <main id="main-content">
    <!-- HERO -->
    <section id="home" class="hero-section relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 scroll-mt-24">
      <!-- Decorative blobs -->
      <div class="absolute top-10 -left-20 w-72 h-72 bg-brand-terracotta/10 blob blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-maroon/5 blob blur-3xl"></div>
      <div class="hero-grid relative grid md:grid-cols-2 gap-16 items-center">
        <div class="hero-copy space-y-4 lg:space-y-6 animate-fade-up">
          <span class="hero-eyebrow"><span class="eyebrow-icon" aria-hidden="true">&#127869;</span> Layanan Catering Banjarbaru &amp; Sekitarnya <span class="eyebrow-spark" aria-hidden="true">&#10022;</span></span>
          <h1 class="hero-title text-brand-maroon">
            <span>Pesan Tumpeng &amp;</span><span>Catering No.1 di</span><span>Banjarbaru &amp;</span><span class="title-finish">Banjarmasin</span>
          </h1>
          <p class=" text-left text-base text-brand-forest-dark/85 leading-relaxed max-w-lg">
            Juaranya se-Banua! Kami siap maantarakan tumpeng, prasmanan, dan nasi kotak nang nyaman gasan berbagai acara pian di Banjarbaru, Banjarmasin, hingga Martapura.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-10 lg:mt-0">
            <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Liat-liat%20webnya%20nih,%20mau%20nanya-nanya%20pricelist%20cateringnya%20dong." target="_blank" class="hero-primary bg-brand-maroon text-white font-bold px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-2xl shadow-brand-maroon/15 text-center flex items-center justify-center gap-2 group">
              Pesan Sekarang
              <i class='bx bx-chevron-right text-2xl text-[#e5c584] group-hover:translate-x-1 transition-transform'></i>
            </a>
            <RouterLink to="/katalog" class="hero-secondary border-2 border-brand-maroon/20 hover:border-brand-maroon text-brand-maroon font-bold px-10 py-4 rounded-full transition-all duration-300 text-center flex items-center justify-center">Lihat Paketan</RouterLink>
          </div>
          <div class="hero-proof flex items-center gap-3 pt-2">
            <div class="flex -space-x-3">
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-maroon text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">&#10022;</span>
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-terracotta text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">&#10022;</span>
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-forest-dark text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">&#10022;</span>
            </div>
            <p class="text-sm text-brand-forest-dark/80"><span class="proof-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span class="font-bold text-brand-maroon">1.000+</span> pelanggan puas</p>
          </div>
        </div>
        <div class="hero-visual relative animate-fade-up-delay">
          <div class="hero-photo relative overflow-hidden shadow-2xl shadow-brand-maroon/10">
            <img :src="heroImg" alt="Sajian tumpeng dan catering Dapur Mamah Iis" fetchpriority="high" width="600" height="499" class="w-full h-125 object-cover"/>
          </div>
          <div class="hero-portions absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float group hover:scale-105 transition-transform duration-500">
            <div class="bg-brand-maroon p-3 rounded-2xl shadow-lg shadow-brand-terracotta/20">
              <i class='bx bxs-dish text-[#e5c584] text-xl' aria-hidden="true"></i>
            </div>
            <div>
              <p class="font-black text-brand-maroon text-lg leading-none">5.000+</p>
              <p class="text-[10px] uppercase tracking-widest font-bold text-brand-forest-dark/40 mt-1">Porsi Terjual</p>
            </div>
          </div>
          <div class="hero-rating absolute -top-8 -right-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float" style="animation-delay: 1s;">
            <div class="bg-brand-maroon p-3 rounded-2xl">
              <i class='bx bxs-star text-[#e5c584] text-xl' aria-hidden="true"></i>
            </div>
            <div>
              <p class="font-black text-brand-maroon text-lg leading-none">4.9/5</p>
              <p class="text-[10px] uppercase tracking-widest font-bold text-brand-forest-dark/40 mt-1">Rating Puas</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <StatsProof />

    <ServicesSection />

    <CateringBanner />

    <!-- PRODUCTS -->
    <section id="products" class="featured-section scroll-mt-24" aria-labelledby="featured-title">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="featured-heading">
          <div>
            <p class="featured-eyebrow"><span aria-hidden="true"></span> Menu pilihan, untuk momen pian</p>
            <h2 id="featured-title">Produk Unggulan <span>Kami<svg viewBox="0 0 180 13" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 Q75 0 177 7" /></svg></span></h2>
          </div>
          <div class="featured-intro">
            <p>Dari makan siang sampai hari istimewa.<br />Ada sajian nyaman untuk setiap cerita.</p>
            <RouterLink to="/katalog" class="featured-catalog">Jelajahi semua menu <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></RouterLink>
          </div>
        </div>
        <div class="featured-grid">
          <article v-for="product in products" :key="product.name" class="featured-item">
            <RouterLink :to="{ path: '/katalog', query: { category: product.cat } }" class="featured-link" :aria-label="'Lihat pilihan ' + product.name">
              <div class="featured-image">
                <img :src="product.img" :alt="product.name" loading="lazy" decoding="async" width="400" height="400" />
                <span class="featured-occasion">{{ product.occasion }}</span>
              </div>
              <div class="featured-name"><h3 class="font-body">{{ product.name }}</h3><span class="featured-arrow"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></span></div>
            </RouterLink>
            <p class="featured-description">{{ product.desc }}</p>
            <div class="featured-price"><span>Mulai dari</span><strong>{{ product.price.replace('Mulai ', '') }}</strong></div>
          </article>
        </div>
        <div class="featured-footer"><span>Rasa rumahan. Momen berkesan.</span><span class="featured-footer-line" aria-hidden="true"></span><span>Dapur Mamah Iis</span></div>
      </div>
    </section>

    <WhyUsSection />

    <!-- TESTIMONIALS -->
    <section id="testimonials" class="py-24 md:py-32 relative scroll-mt-24">
      <div class="absolute inset-0 bg-brand-forest-dark/2"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 max-w-2xl mx-auto">
          <p class="text-sm font-bold uppercase tracking-widest text-brand-terracotta mb-4">Testimoni</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-maroon tracking-tight">Kata Mereka Tentang Kami</h2>
        </div>
        <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <div v-for="t in testimonials" :key="t.name" class="break-inside-avoid bg-white/80 backdrop-blur-sm p-6 rounded-4xl border border-white hover:border-brand-terracotta/10 hover:shadow-xl transition-all duration-500">
            <img v-if="t.img" :src="t.img" :alt="'Foto pelanggan ' + t.name" loading="lazy" decoding="async" width="400" :height="t.tall ? 224 : 160" class="w-full rounded-2xl mb-5 object-cover" :class="t.tall ? 'h-56' : 'h-40'"/>
            <div class="flex items-center gap-1 mb-3">
              <i v-for="i in 5" :key="i" class='bx bxs-star text-amber-400 text-[15px]' aria-hidden="true"></i>
            </div>
            <p class="text-brand-forest-dark/85 text-sm leading-relaxed italic mb-5">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-terracotta/10 flex items-center justify-center font-bold text-brand-terracotta text-sm">{{ t.name.charAt(0) }}</div>
              <div><p class="font-bold text-brand-maroon text-sm">{{ t.name }}</p><p class="text-xs text-brand-forest-dark/70">{{ t.org }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </main>

    <!-- FOOTER (Consistent Modular Component) -->
    <Footer />

    <!-- WHATSAPP FIXED BUTTON -->
    <a 
      href="https://wa.me/6285156253408?text=Halo%20Min!%20Mau%20nanya-nanya%20dulu%20nih%20soal%20cateringnya,%20boleh%3F" 
      target="_blank" 
      class="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-whatsapp text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Hubungi Admin via WhatsApp"
    >
      <!-- Ripple Effect Animation -->
      <span class="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-20"></span>
      
      <i class='bx bxl-whatsapp text-4xl relative z-10' aria-hidden="true"></i>
      
      <!-- Tooltip effect on hover -->
      <span class="absolute right-full mr-4 bg-brand-maroon text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        Chat via WhatsApp
      </span>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/images/logo-small.webp'
const heroImg = '/hero-img.webp'
import naskotImg from '../assets/images/naskot.webp'
import tumpengImg from '../assets/images/tumpeng.webp'
import tuminiImg from '../assets/images/tumini.webp'
import prasmananImg from '../assets/images/prasmanan.webp'
import testi1Img from '../assets/images/testi1.webp'
import testi2Img from '../assets/images/testi2.webp'
import TopNav from '../components/catalog/TopNav.vue'
import Footer from '../components/catalog/Footer.vue'
import StatsProof from '../components/home/StatsProof.vue'
import CateringBanner from '../components/home/CateringBanner.vue'
import ServicesSection from '../components/home/ServicesSection.vue'
import WhyUsSection from '../components/home/WhyUsSection.vue'

const authStore = useAuthStore()

const products = [
  { name: 'Nasi Kotak', occasion: 'Teman kumpul & meeting', desc: 'Paket nasi kotak lengkap dengan lauk pilihan, cocok untuk meeting dan seminar.', price: 'Mulai Rp 20.000', img: naskotImg, cat: 'nasi-kotak' },
  { name: 'Tumpeng Besar', occasion: 'Rayakan yang istimewa', desc: 'Tumpeng nasi kuning megah dengan aneka lauk tradisional untuk acara spesial.', price: 'Mulai Rp 245.000', img: tumpengImg, cat: 'tumpeng' },
  { name: 'Tumpeng Kecil', occasion: 'Mungil, penuh makna', desc: 'Tumpeng mini elegan, sempurna untuk ulang tahun dan syukuran keluarga.', price: 'Mulai Rp 22.500', img: tuminiImg, cat: 'tumpeng' },
  { name: 'Prasmanan', occasion: 'Jamuan untuk semua', desc: 'Paket prasmanan lengkap dengan dekorasi meja mewah untuk pernikahan.', price: 'Mulai Rp 25.000/pax', img: prasmananImg, cat: 'prasmanan' }
]

const testimonials = [
  { name: 'Ibu Sari', org: 'PT. Maju Bersama', quote: 'Rasa makanannya luar biasa dan pelayanannya sangat profesional. Semua tamu puas!', img: testi1Img, tall: false },
  { name: 'Pak Ahmad', org: 'Dinas Pendidikan', quote: 'Sudah 3 tahun berlangganan untuk acara dinas. Tidak pernah mengecewakan.', img: null, tall: false },
  { name: 'Bella & Rizky', org: 'Wedding Reception', quote: 'Prasmanan pernikahan kami ditangani dengan sempurna. Dekorasinya cantik!', img: null, tall: true },
  { name: 'Hj. Fatimah', org: 'Arisan RT 05', quote: 'Nasi kotaknya enak dan harganya sangat terjangkau. Cocok untuk pengajian.', img: null, tall: false },
  { name: 'David Chen', org: 'StartUp Borneo', quote: 'Tim kami selalu order tumpeng untuk perayaan milestone. Kualitas terbaik!', img: testi2Img, tall: false }
]

</script>

<style scoped>
.hero-copy { container-type: inline-size; min-width: 0; }
.hero-title { font-size: 10.9cqi; line-height: 1.17 !important; letter-spacing: -.015em !important; padding-bottom: 9px; }
.hero-title > span { display: block; white-space: nowrap; }
.title-finish { position: relative; width: fit-content; }
.title-finish::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 100%; height: 9px; border-top: 3px solid #c4a05a; border-radius: 50%; transform: rotate(-2deg); }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 9px; padding: 6px 12px 6px 6px; border: 1px solid #e2cca4; background: #f8efdf; color: #690b22; border-radius: 14px 14px 14px 4px; font-size: 10px; font-weight: 700; letter-spacing: .035em; text-transform: uppercase; transform: rotate(-1.5deg); }
.eyebrow-icon { display: grid; place-items: center; flex-shrink: 0; width: 31px; height: 31px; background: #690b22; color: #e5c584; border-radius: 9px; font-size: 17px; }
.eyebrow-spark { color: #997126; font-size: 20px; }
.hero-primary { border: 1px solid #8a3b4c; border-radius: 18px; box-shadow: 0 5px 0 #dfc795; padding-inline: 28px; }
.hero-primary:hover { background: #51091a; transform: translateY(-2px); }
.hero-secondary { border: 1px solid #cfb993; background: #fffaf1; border-radius: 18px; padding-inline: 28px; }
.hero-section a:focus-visible { outline: 3px solid #ac8338; outline-offset: 5px; }
.hero-proof { width: fit-content; padding: 10px 17px 10px 8px; background: #f6efe3; border-radius: 40px 16px 30px 40px; border: 1px solid #e9dcc6; }
.hero-proof .proof-stars { display: block; font-size: 13px; letter-spacing: 3px; color: #9c7126; margin-bottom: 2px; }
.hero-proof .rounded-full { font-size: 24px; font-weight: 400; }
.hero-proof .rounded-full:nth-child(2) { background: #e5c584; color: #690b22; transform: translateY(-4px) rotate(-10deg); }
.hero-visual { margin: 10px 16px 20px 0; }
.hero-visual::before { content: ''; position: absolute; inset: -13px -13px 4px 12px; border: 1.5px solid #c6a15a; border-radius: 110px 65px 125px 50px; transform: rotate(5deg); }
.hero-visual::after { content: '\2733'; position: absolute; top: -45px; left: -26px; color: #690b22; font-size: 60px; transform: rotate(12deg); }
.hero-photo { padding: 8px; background: #efe0c5; border-radius: 100px 45px 100px 45px; transform: rotate(-3deg); }
.hero-photo img { height: auto; aspect-ratio: 1 / 1.04; border-radius: 92px 37px 92px 37px; }
.hero-rating, .hero-portions { background: #fffdf8; border: 1px solid #e6d6b9; padding: 15px 18px; gap: 12px; animation: none; }
.hero-rating { right: -20px; top: -23px; transform: rotate(5deg); border-radius: 22px 22px 7px 22px; }
.hero-portions { left: -24px; bottom: -16px; transform: rotate(-5deg); border-radius: 8px 22px 22px 22px; }
.hero-visual .tracking-widest { color: #526658; letter-spacing: .07em; }
@media (min-width: 768px) and (max-width: 1100px) { .hero-grid { gap: 35px; } .hero-eyebrow { font-size: 8px; gap: 6px; } .hero-primary, .hero-secondary { font-size: 12px; padding-inline: 15px; } }
@media (max-width: 767px) { .hero-section { padding-inline: 24px; } .hero-grid { gap: 66px; } .hero-copy { max-width: 560px; width: 100%; margin-inline: auto; } .hero-title { font-size: 10.8cqi; } .hero-eyebrow { font-size: 8px; gap: 6px; } .hero-visual { margin: 0 16px 20px; } .hero-photo img { aspect-ratio: 1.05; } .hero-rating, .hero-portions { padding: 12px; gap: 10px; } .hero-visual::after { font-size: 45px; top: -34px; left: -22px; } .hero-proof { margin-inline: auto; } }
@media (prefers-reduced-motion: reduce) { .hero-copy, .hero-visual { animation: none; } .hero-primary { transition: none; } }

.featured-section { padding: 100px 0 80px; background: #f7f2e9; }
.featured-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 36px; margin-bottom: 48px; }
.featured-eyebrow { display: flex; align-items: center; gap: 10px; color: #72512e; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 16px; }
.featured-eyebrow > span { width: 22px; height: 2px; background: #a8813b; }
.featured-heading h2 { font-size: clamp(36px, 4vw, 52px); color: #690b22; max-width: 620px; }
.featured-heading h2 > span { position: relative; display: inline-block; }
.featured-heading h2 svg { position: absolute; bottom: 1px; left: 0; width: 100%; height: 12px; fill: none; stroke: #b8914b; stroke-width: 2.5; stroke-linecap: round; }
.featured-intro { flex-shrink: 0; padding-bottom: 5px; }
.featured-intro p { color: #4e6658; font-size: 14px; line-height: 1.8; }
.featured-catalog { display: inline-flex; align-items: center; gap: 15px; color: #690b22; font-size: 13px; font-weight: 600; margin-top: 15px; padding-bottom: 6px; border-bottom: 1px solid #bca67e; }
.featured-section svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.featured-heading h2 svg { width: 100%; height: 12px; stroke: #b8914b; }
.featured-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; align-items: start; }
.featured-item { min-width: 0; }
.featured-item:nth-child(even) { margin-top: 34px; }
.featured-link { display: block; border-radius: 4px; }
.featured-image { position: relative; aspect-ratio: 1 / 1.12; overflow: hidden; border-radius: 100px 100px 20px 20px; background: #e7ddcc; }
.featured-item:nth-child(2) .featured-image { border-radius: 24px 80px 24px 80px; }
.featured-item:nth-child(3) .featured-image { border-radius: 80px 24px 80px 24px; }
.featured-item:nth-child(4) .featured-image { border-radius: 20px 20px 100px 100px; }
.featured-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.featured-link:hover img { transform: scale(1.045); }
.featured-occasion { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%) rotate(-4deg); width: max-content; max-width: 94%; padding: 8px 12px; background: #e9cd92; color: #542014; font-size: 10px; font-weight: 600; }
.featured-item:nth-child(even) .featured-occasion { transform: translateX(-50%) rotate(3deg); background: #690b22; color: #fff4dc; }
.featured-name { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 20px; }
.featured-name h3 { font-size: 20px; font-weight: 700; letter-spacing: -.035em; color: #690b22; }
.featured-arrow { display: grid; place-items: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; color: #690b22; border: 1px solid #cbb691; transition: background-color .2s, color .2s, transform .2s; }
.featured-link:hover .featured-arrow { background: #690b22; color: #e9cd92; transform: rotate(45deg); }
.featured-description { color: #4e6658; font-size: 13px; line-height: 1.85; margin: 10px 0 17px; min-height: 73px; }
.featured-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 5px 9px; padding-top: 15px; border-top: 1px solid #d9cdbb; }
.featured-price > span { font-size: 11px; color: #687266; }
.featured-price strong { color: #690b22; font-size: 16px; font-weight: 600; }
.featured-footer { display: flex; align-items: center; gap: 22px; margin-top: 52px; color: #6e715f; font-size: 11px; letter-spacing: .035em; }
.featured-footer-line { flex: 1; height: 1px; background: #d9cdbb; }
.featured-section a:focus-visible { outline: 3px solid #a8813b; outline-offset: 6px; }
@media (max-width: 1023px) { .featured-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 28px; } .featured-heading { align-items: flex-start; flex-direction: column; gap: 20px; } .featured-description { min-height: 48px; } .featured-item:nth-child(even) { margin-top: 28px; } }
@media (max-width: 539px) { .featured-section { padding: 64px 0 50px; } .featured-heading { margin-bottom: 32px; } .featured-eyebrow { font-size: 9px; letter-spacing: .08em; } .featured-heading h2 { font-size: 37px; } .featured-grid { grid-template-columns: 1fr; gap: 36px; } .featured-item:nth-child(even) { margin-top: 0; } .featured-image { aspect-ratio: 1.15; } .featured-name h3 { font-size: 22px; } .featured-description { min-height: 0; } .featured-occasion { font-size: 11px; } .featured-footer { gap: 12px; font-size: 10px; flex-wrap: wrap; } }
@media (prefers-reduced-motion: reduce) { .featured-image img, .featured-arrow { transition: none; } .featured-link:hover img, .featured-link:hover .featured-arrow { transform: none; } }
</style>
