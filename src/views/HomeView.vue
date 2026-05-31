<template>
  <div class="bg-[#FDFBF7] min-h-screen">

    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-brand-maroon focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Langsung ke konten utama</a>

    <!-- NAVBAR (Consistent with Catalog & Detail) -->
    <TopNav />

    <main id="main-content">
    <!-- HERO -->
    <section id="home" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-48 md:pb-32 scroll-mt-24">
      <!-- Decorative blobs -->
      <div class="absolute top-10 -left-20 w-72 h-72 bg-brand-terracotta/10 blob blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-maroon/5 blob blur-3xl"></div>
      <div class="relative grid md:grid-cols-2 gap-16 items-center">
        <div class="space-y-4 lg:space-y-8 animate-fade-up">
          <span class="inline-block bg-brand-terracotta/10 text-brand-terracotta text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full" aria-label="Layanan Catering Banjarbaru dan Sekitarnya">🍽️ Layanan Catering Banjarbaru & Sekitarnya</span>
          <h1 class=" text-center lg:text-left text-5xl font-extrabold text-brand-maroon leading-[1.3] tracking-tight">
            Pesan Tumpeng & Catering No.1 di Banjarbaru & Banjarmasin
          </h1>
          <p class=" text-center lg:text-left text-base text-brand-forest-dark/85 leading-relaxed max-w-lg">
            Juaranya se-Banua! Kami siap maantarakan tumpeng, prasmanan, dan nasi kotak nang nyaman gasan berbagai acara pian di Banjarbaru, Banjarmasin, hingga Martapura.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-10 lg:mt-0">
            <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Liat-liat%20webnya%20nih,%20mau%20nanya-nanya%20pricelist%20cateringnya%20dong." target="_blank" class="bg-linear-to-r from-brand-terracotta to-brand-maroon text-white font-bold px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-2xl shadow-brand-terracotta/40 text-center animate-shimmer flex items-center justify-center gap-2 group">
              Pesan Sekarang
              <i class='bx bx-chevron-right text-2xl group-hover:translate-x-1 transition-transform'></i>
            </a>
            <RouterLink to="/katalog" class="border-2 border-brand-maroon/20 hover:border-brand-maroon text-brand-maroon font-bold px-10 py-4 rounded-full transition-all duration-300 text-center flex items-center justify-center">Lihat Paketan</RouterLink>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <div class="flex -space-x-3">
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-maroon text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">A</span>
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-terracotta text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">B</span>
              <span class="w-10 h-10 rounded-full border-2 border-brand-cream-light bg-brand-forest-dark text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">C</span>
            </div>
            <p class="text-sm text-brand-forest-dark/80"><span class="font-bold text-brand-maroon">1.000+</span> pelanggan puas</p>
          </div>
        </div>
        <div class="relative animate-fade-up-delay">
          <div class="relative rounded-4xl overflow-hidden shadow-2xl shadow-brand-maroon/10 ">
            <picture>
              <source media="(max-width: 767px)" srcset="/hero-img-mobile.webp" type="image/webp" />
              <img :src="heroImg" alt="Sajian tumpeng dan catering Dapur Mamah Iis" fetchpriority="high" width="600" height="499" class="w-full h-[500px] object-cover scale-105"/>
            </picture>
          </div>
          <div class="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float group hover:scale-105 transition-transform duration-500">
            <div class="bg-linear-to-br from-brand-terracotta to-brand-maroon p-3 rounded-2xl shadow-lg shadow-brand-terracotta/20">
              <i class='bx bxs-dish text-white text-xl' aria-hidden="true"></i>
            </div>
            <div>
              <p class="font-black text-brand-maroon text-lg leading-none">5.000+</p>
              <p class="text-[10px] uppercase tracking-widest font-bold text-brand-forest-dark/40 mt-1">Porsi Terjual</p>
            </div>
          </div>
          <div class="absolute -top-8 -right-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float" style="animation-delay: 1s;">
            <div class="bg-linear-to-r from-brand-terracotta to-brand-maroon p-3 rounded-2xl">
              <i class='bx bxs-star text-white text-xl animate-pulse' aria-hidden="true"></i>
            </div>
            <div>
              <p class="font-black text-brand-maroon text-lg leading-none">4.9/5</p>
              <p class="text-[10px] uppercase tracking-widest font-bold text-brand-forest-dark/40 mt-1">Rating Puas</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS COUNTER STRIP -->
    <section class="relative py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative bg-brand-maroon rounded-[2.5rem] p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white shadow-2xl shadow-brand-maroon/20 overflow-hidden group">
          <!-- Ornaments -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-700"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-brand-terracotta/20 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div v-for="stat in stats" :key="stat.label" class="relative z-10 flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-500 rounded-2xl hover:bg-white/5">
            <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <i :class="['bx text-3xl text-brand-terracotta', stat.icon]" aria-hidden="true"></i>
            </div>
            <p class="text-3xl md:text-4xl font-extrabold mb-1 bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">{{ stat.value }}</p>
            <p class="text-sm text-white/80 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="py-24 md:py-32 relative scroll-mt-24">
      <div class="absolute inset-0 bg-brand-forest-dark/2"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 max-w-2xl mx-auto">
          <p class="text-sm font-bold uppercase tracking-widest text-brand-terracotta mb-4">Layanan Kami</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-maroon tracking-tight mb-4">Solusi Lengkap untuk Acara Anda</h2>
          <p class="text-brand-forest-dark/80">Dari persiapan hingga pelaksanaan, kami siap membantu.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(service, i) in services" :key="service.title" class="bg-white/70 backdrop-blur-sm p-8 rounded-4xl border border-white hover:border-brand-terracotta/20 hover:shadow-2xl hover:shadow-brand-terracotta/5 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-brand-terracotta/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-terracotta group-hover:text-white transition-all duration-500">
              <i :class="['bx text-3xl transition-colors duration-500', service.icon, 'text-brand-terracotta group-hover:text-white']" aria-hidden="true"></i>
            </div>
            <h3 class="text-xl font-bold text-brand-maroon mb-3">{{ service.title }}</h3>
            <p class="text-brand-forest-dark/80 leading-relaxed text-sm">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative bg-brand-forest-dark rounded-3xl p-10 md:p-16 overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-brand-terracotta/20 blob blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-brand-maroon/20 blob blur-3xl"></div>
          <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="space-y-3 text-center md:text-left">
              <h3 class="text-2xl md:text-3xl font-extrabold text-white">Ada acara spesial dalam waktu dekat?</h3>
              <p class="text-white/80 max-w-md">Konsultasikan kebutuhan catering Anda secara gratis. Kami bantu carikan paket terbaik!</p>
            </div>
            <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Ada%20rencana%20bikin%20acara%20nih,%20bisa%20bantu%20rekomendasiin%20paket%20yang%20pas%20ngga%3F" target="_blank" class="shrink-0 bg-brand-terracotta hover:bg-white hover:text-brand-maroon text-white font-bold px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-xl flex items-center gap-2 animate-shimmer group" aria-label="Konsultasi Gratis via WhatsApp">
              <i class='bx bxl-whatsapp text-2xl' aria-hidden="true"></i>
              Konsultasi Gratis
              <i class='bx bx-chevron-right text-2xl group-hover:translate-x-1 transition-transform' aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section id="products" class="py-24 md:py-32 scroll-mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 max-w-2xl mx-auto">
          <p class="text-sm font-bold uppercase tracking-widest text-brand-terracotta mb-4">Menu Pilihan</p>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-maroon tracking-tight mb-4">Produk Unggulan Kami</h2>
          <p class="text-brand-forest-dark/80">Dibuat dari bahan terbaik dengan cinta dan keahlian.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.name" class="group relative bg-white rounded-4xl overflow-hidden border border-white hover:border-brand-terracotta/20 hover:shadow-2xl hover:shadow-brand-terracotta/10 transition-all duration-500 hover:-translate-y-2">
            <!-- Image with overlay -->
            <div class="relative aspect-4/3 overflow-hidden">
              <img :src="product.img" :alt="product.name" loading="lazy" decoding="async" width="400" height="300" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
              <div class="absolute inset-0 bg-linear-to-t from-brand-maroon/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <!-- Price badge floating -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-terracotta text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {{ product.price }}
              </div>
            </div>
            <!-- Content -->
            <div class="p-6 space-y-3">
              <h3 class="text-lg font-bold text-brand-maroon group-hover:text-brand-terracotta transition-colors duration-300">{{ product.name }}</h3>
              <p class="text-sm text-brand-forest-dark/80 leading-relaxed line-clamp-2">{{ product.desc }}</p>
              <button @click="$router.push({ path: '/katalog', query: { category: product.cat } })" class="w-full bg-brand-cream-light hover:bg-brand-terracotta text-brand-maroon hover:text-white font-semibold py-3 rounded-xl transition-all duration-300 text-sm" :aria-label="'Lihat detail ' + product.name">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST / WHY US STRIP -->
    <section class="py-20 relative overflow-hidden">
      <!-- Background Ornaments -->
      <div class="absolute top-1/2 left-0 w-72 h-72 bg-brand-terracotta/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-maroon/5 rounded-full blur-3xl translate-y-1/4 translate-x-1/4"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-14 max-w-2xl mx-auto">
          <p class="text-sm font-bold uppercase tracking-widest text-brand-terracotta mb-3">Keunggulan Kami</p>
          <h2 class="text-3xl md:text-4xl font-extrabold text-brand-maroon tracking-tight">Kenapa Memilih Kami?</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(reason, index) in whyUs" :key="reason.text" 
               class="group bg-white rounded-4xl p-8 border border-brand-maroon/5 shadow-xl shadow-brand-maroon/5 hover:shadow-2xl hover:shadow-brand-terracotta/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <!-- Card Ornament -->
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-brand-terracotta/5 rounded-full blur-2xl group-hover:bg-brand-terracotta/10 transition-colors duration-500"></div>
            
            <div class="w-16 h-16 bg-brand-cream-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-terracotta transition-colors duration-500 shadow-sm relative z-10">
              <i :class="['bx text-3xl text-brand-terracotta group-hover:text-white transition-colors duration-500', reason.icon]" aria-hidden="true"></i>
            </div>
            <div class="relative z-10">
              <h3 class="text-lg font-bold text-brand-maroon mb-2 group-hover:text-brand-terracotta transition-colors duration-300">{{ reason.text }}</h3>
              <p class="text-sm text-brand-forest-dark/80 leading-relaxed">{{ reason.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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
      class="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Hubungi Admin via WhatsApp"
    >
      <!-- Ripple Effect Animation -->
      <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
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

const authStore = useAuthStore()

const services = [
  { title: 'Pesan Antar / Delivery', desc: 'Pengiriman tepat waktu dengan packaging aman dan higienis. Makanan sampai dalam kondisi segar dan siap dinikmati untuk segala acara.', icon: 'bxs-truck' },
  { title: 'Cita Rasa Autentik & Menu Beragam', desc: 'Menghadirkan ragam pilihan menu masakan nusantara hingga modern. Dimasak dari bahan segar berkualitas dengan standar kebersihan tinggi untuk rasa yang memanjakan lidah.', icon: 'bxs-magic-wand' },
  { title: 'Presentasi Elegan & Eksklusif', desc: 'Tampilan hidangan yang menggugah selera; mulai dari set meja prasmanan yang mewah, kreasi tumpeng yang artistik, hingga kemasan nasi kotak yang rapi dan premium.', icon: 'bxs-user-voice' }
]

const products = [
  { name: 'Nasi Kotak', desc: 'Paket nasi kotak lengkap dengan lauk pilihan, cocok untuk meeting dan seminar.', price: 'Mulai Rp 20.000', img: naskotImg, cat: 'nasi-kotak' },
  { name: 'Tumpeng Besar', desc: 'Tumpeng nasi kuning megah dengan aneka lauk tradisional untuk acara spesial.', price: 'Mulai Rp 245.000', img: tumpengImg, cat: 'tumpeng' },
  { name: 'Tumpeng Kecil', desc: 'Tumpeng mini elegan, sempurna untuk ulang tahun dan syukuran keluarga.', price: 'Mulai Rp 22.500', img: tuminiImg, cat: 'tumpeng' },
  { name: 'Prasmanan', desc: 'Paket prasmanan lengkap dengan dekorasi meja mewah untuk pernikahan.', price: 'Mulai Rp 25.000/pax', img: prasmananImg, cat: 'prasmanan' }
]

const testimonials = [
  { name: 'Ibu Sari', org: 'PT. Maju Bersama', quote: 'Rasa makanannya luar biasa dan pelayanannya sangat profesional. Semua tamu puas!', img: testi1Img, tall: false },
  { name: 'Pak Ahmad', org: 'Dinas Pendidikan', quote: 'Sudah 3 tahun berlangganan untuk acara dinas. Tidak pernah mengecewakan.', img: null, tall: false },
  { name: 'Bella & Rizky', org: 'Wedding Reception', quote: 'Prasmanan pernikahan kami ditangani dengan sempurna. Dekorasinya cantik!', img: null, tall: true },
  { name: 'Hj. Fatimah', org: 'Arisan RT 05', quote: 'Nasi kotaknya enak dan harganya sangat terjangkau. Cocok untuk pengajian.', img: null, tall: false },
  { name: 'David Chen', org: 'StartUp Borneo', quote: 'Tim kami selalu order tumpeng untuk perayaan milestone. Kualitas terbaik!', img: testi2Img, tall: false }
]

const stats = [
  { value: '5.000+', label: 'Porsi Terjual', icon: 'bxs-bowl-hot' },
  { value: '1.200+', label: 'Acara Dilayani', icon: 'bxs-calendar-check' },
  { value: '4.9/5', label: 'Rating Pelanggan', icon: 'bxs-star' },
  { value: '5+', label: 'Tahun Pengalaman', icon: 'bxs-award' }
]

const whyUs = [
  { text: 'Bahan Segar', sub: '100% bahan pilihan berkualitas', icon: 'bxs-leaf' },
  { text: 'Tepat Waktu', sub: 'Komitmen pengiriman on-time', icon: 'bxs-time-five' },
  { text: 'Harga Bersaing', sub: 'Kualitas premium, harga terjangkau', icon: 'bxs-wallet' },
  { text: 'Higienis', sub: 'Standar kebersihan tinggi', icon: 'bxs-shield-alt-2' }
]
</script>
