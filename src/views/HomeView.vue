<template>
  <div class="bg-[#FDFBF7] min-h-screen">

    <!-- NAVBAR (Consistent with Catalog & Detail) -->
    <TopNav />

    <!-- HERO -->
    <section id="home" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-48 md:pb-32 scroll-mt-24">
      <!-- Decorative blobs -->
      <div class="absolute top-10 -left-20 w-72 h-72 bg-brand-terracotta/10 blob blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-maroon/5 blob blur-3xl"></div>
      <div class="relative grid md:grid-cols-2 gap-16 items-center">
        <div class="space-y-4 lg:space-y-8 animate-fade-up">
          <span class="inline-block bg-brand-terracotta/10 text-brand-terracotta text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">🍽️ Tumpeng & Catering Service</span>
          <h1 class=" text-center lg:text-left text-6xl font-extrabold text-brand-maroon leading-[1.1] tracking-tight">
            Juaranya Tumpeng & Catering <span class="text-brand-terracotta relative">di Banua!</span>
          </h1>
          <p class=" text-center lg:text-left text-base lg:text-lg text-brand-forest-dark/70 leading-relaxed max-w-lg">
            Kami siap maantarakan tumpeng dan catering nang nyaman gasan acara pian di Banjarbaru, Banjarmasin, dan Martapura.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#products" class="bg-brand-terracotta hover:bg-brand-maroon text-white font-bold px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-2xl shadow-brand-terracotta/40 text-center animate-shimmer flex items-center justify-center gap-2 group">
              Pesan Sekarang
              <i class='bx bx-chevron-right text-2xl group-hover:translate-x-1 transition-transform'></i>
            </a>
            <RouterLink to="/katalog" class="border-2 border-brand-maroon/20 hover:border-brand-maroon text-brand-maroon font-bold px-10 py-4 rounded-full transition-all duration-300 text-center flex items-center justify-center">Lihat Paketan</RouterLink>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <div class="flex -space-x-3">
              <img src="https://placehold.co/40x40/690B22/fff?text=A" class="w-10 h-10 rounded-full border-2 border-brand-cream-light" alt="avatar"/>
              <img src="https://placehold.co/40x40/E07A5F/fff?text=B" class="w-10 h-10 rounded-full border-2 border-brand-cream-light" alt="avatar"/>
              <img src="https://placehold.co/40x40/1B4D3E/fff?text=C" class="w-10 h-10 rounded-full border-2 border-brand-cream-light" alt="avatar"/>
            </div>
            <p class="text-sm text-brand-forest-dark/60"><span class="font-bold text-brand-maroon">1.000+</span> pelanggan puas</p>
          </div>
        </div>
        <div class="relative animate-fade-up-delay">
          <div class="relative rounded-4xl overflow-hidden shadow-2xl shadow-brand-maroon/10 ">
            <img :src="heroImg" alt="Hero" class="w-full h-[500px] object-cover scale-105"/>
          </div>
          <div class="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float group hover:scale-105 transition-transform duration-500">
            <div class="bg-linear-to-br from-brand-terracotta to-brand-maroon p-3 rounded-2xl shadow-lg shadow-brand-terracotta/20">
              <i class='bx bxs-dish text-white text-xl'></i>
            </div>
            <div>
              <p class="font-black text-brand-maroon text-lg leading-none">5.000+</p>
              <p class="text-[10px] uppercase tracking-widest font-bold text-brand-forest-dark/40 mt-1">Porsi Terjual</p>
            </div>
          </div>
          <div class="absolute -top-8 -right-8 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_50px_rgba(105,11,34,0.15)] border border-brand-maroon/5 flex items-center gap-4 animate-float" style="animation-delay: 1s;">
            <div class="bg-brand-cream-light p-3 rounded-2xl">
              <i class='bx bxs-star text-brand-terracotta text-xl animate-pulse'></i>
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
              <i :class="['bx text-3xl text-brand-terracotta', stat.icon]"></i>
            </div>
            <p class="text-3xl md:text-4xl font-extrabold mb-1 bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">{{ stat.value }}</p>
            <p class="text-sm text-white/70 font-medium">{{ stat.label }}</p>
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
          <p class="text-brand-forest-dark/60">Dari persiapan hingga pelaksanaan, kami siap membantu.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(service, i) in services" :key="service.title" class="bg-white/70 backdrop-blur-sm p-8 rounded-4xl border border-white hover:border-brand-terracotta/20 hover:shadow-2xl hover:shadow-brand-terracotta/5 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-brand-terracotta/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-terracotta group-hover:text-white transition-all duration-500">
              <i :class="['bx text-3xl transition-colors duration-500', service.icon, 'text-brand-terracotta group-hover:text-white']"></i>
            </div>
            <h3 class="text-xl font-bold text-brand-maroon mb-3">{{ service.title }}</h3>
            <p class="text-brand-forest-dark/60 leading-relaxed text-sm">{{ service.desc }}</p>
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
              <p class="text-white/60 max-w-md">Konsultasikan kebutuhan catering Anda secara gratis. Kami bantu carikan paket terbaik!</p>
            </div>
            <a href="https://wa.me/6281234567890" target="_blank" class="shrink-0 bg-brand-terracotta hover:bg-white hover:text-brand-maroon text-white font-bold px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-xl flex items-center gap-2 animate-shimmer group">
              <i class='bx bxl-whatsapp text-2xl'></i>
              Konsultasi Gratis
              <i class='bx bx-chevron-right text-2xl group-hover:translate-x-1 transition-transform'></i>
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
          <p class="text-brand-forest-dark/60">Dibuat dari bahan terbaik dengan cinta dan keahlian.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.name" class="group relative bg-white rounded-4xl overflow-hidden border border-white hover:border-brand-terracotta/20 hover:shadow-2xl hover:shadow-brand-terracotta/10 transition-all duration-500 hover:-translate-y-2">
            <!-- Image with overlay -->
            <div class="relative aspect-4/3 overflow-hidden">
              <img :src="product.img" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"/>
              <div class="absolute inset-0 bg-linear-to-t from-brand-maroon/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <!-- Price badge floating -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-terracotta text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                {{ product.price }}
              </div>
            </div>
            <!-- Content -->
            <div class="p-6 space-y-3">
              <h3 class="text-lg font-bold text-brand-maroon group-hover:text-brand-terracotta transition-colors duration-300">{{ product.name }}</h3>
              <p class="text-sm text-brand-forest-dark/60 leading-relaxed line-clamp-2">{{ product.desc }}</p>
              <button class="w-full bg-brand-cream-light hover:bg-brand-terracotta text-brand-maroon hover:text-white font-semibold py-3 rounded-xl transition-all duration-300 text-sm">
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
          <h3 class="text-3xl md:text-4xl font-extrabold text-brand-maroon tracking-tight">Kenapa Memilih Kami?</h3>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(reason, index) in whyUs" :key="reason.text" 
               class="group bg-white rounded-4xl p-8 border border-brand-maroon/5 shadow-xl shadow-brand-maroon/5 hover:shadow-2xl hover:shadow-brand-terracotta/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <!-- Card Ornament -->
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-brand-terracotta/5 rounded-full blur-2xl group-hover:bg-brand-terracotta/10 transition-colors duration-500"></div>
            
            <div class="w-16 h-16 bg-brand-cream-light rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-terracotta transition-colors duration-500 shadow-sm relative z-10">
              <i :class="['bx text-3xl text-brand-terracotta group-hover:text-white transition-colors duration-500', reason.icon]"></i>
            </div>
            <div class="relative z-10">
              <h4 class="text-lg font-bold text-brand-maroon mb-2 group-hover:text-brand-terracotta transition-colors duration-300">{{ reason.text }}</h4>
              <p class="text-sm text-brand-forest-dark/60 leading-relaxed">{{ reason.sub }}</p>
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
            <img v-if="t.img" :src="t.img" :alt="t.name" class="w-full rounded-2xl mb-5 object-cover" :class="t.tall ? 'h-56' : 'h-40'"/>
            <p class="text-brand-forest-dark/70 text-sm leading-relaxed italic mb-5">"{{ t.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-brand-terracotta/10 flex items-center justify-center font-bold text-brand-terracotta text-sm">{{ t.name.charAt(0) }}</div>
              <div><p class="font-bold text-brand-maroon text-sm">{{ t.name }}</p><p class="text-xs text-brand-forest-dark/40">{{ t.org }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER (Consistent Modular Component) -->
    <Footer />

    <!-- WHATSAPP FIXED BUTTON -->
    <a 
      href="https://wa.me/6281234567890" 
      target="_blank" 
      class="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
    >
      <!-- Ripple Effect Animation -->
      <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
      <i class='bx bxl-whatsapp text-4xl relative z-10'></i>
      
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
import logo from '../assets/images/logo.png'
import heroImg from '../assets/images/hero-img.png'
import TopNav from '../components/catalog/TopNav.vue'
import Footer from '../components/catalog/Footer.vue'

const authStore = useAuthStore()
const mobileMenu = ref(false)

const services = [
  { title: 'Pesan Antar / Delivery', desc: 'Pengiriman tepat waktu dengan packaging aman dan higienis. Makanan sampai dalam kondisi segar.', icon: 'bxs-truck' },
  { title: 'Set Dekorasi Prasmanan', desc: 'Dekorasi meja prasmanan yang elegan dan aesthetic. Hidangan tertata mewah dan menggugah selera.', icon: 'bxs-magic-wand' },
  { title: 'Pramusaji Profesional', desc: 'Tim pelayan terlatih dan berpenampilan rapi. Pelayanan ramah untuk kenyamanan tamu undangan.', icon: 'bxs-user-voice' }
]

const products = [
  { name: 'Nasi Kotak', desc: 'Paket nasi kotak lengkap dengan lauk pilihan, cocok untuk meeting dan seminar.', price: 'Mulai Rp 25.000', img: 'https://placehold.co/400x300/E07A5F/fff?text=Nasi+Kotak' },
  { name: 'Tumpeng Besar', desc: 'Tumpeng nasi kuning megah dengan aneka lauk tradisional untuk acara spesial.', price: 'Mulai Rp 350.000', img: 'https://placehold.co/400x300/690B22/fff?text=Tumpeng+Besar' },
  { name: 'Tumpeng Kecil', desc: 'Tumpeng mini elegan, sempurna untuk ulang tahun dan syukuran keluarga.', price: 'Mulai Rp 150.000', img: 'https://placehold.co/400x300/1B4D3E/fff?text=Tumpeng+Kecil' },
  { name: 'Prasmanan', desc: 'Paket prasmanan lengkap dengan dekorasi meja mewah untuk pernikahan.', price: 'Mulai Rp 75.000/pax', img: 'https://placehold.co/400x300/F1E3D3/690B22?text=Prasmanan' }
]

const testimonials = [
  { name: 'Ibu Sari', org: 'PT. Maju Bersama', quote: 'Rasa makanannya luar biasa dan pelayanannya sangat profesional. Semua tamu puas!', img: 'https://placehold.co/400x250/E07A5F/fff?text=Event+Photo', tall: false },
  { name: 'Pak Ahmad', org: 'Dinas Pendidikan', quote: 'Sudah 3 tahun berlangganan untuk acara dinas. Tidak pernah mengecewakan.', img: null, tall: false },
  { name: 'Bella & Rizky', org: 'Wedding Reception', quote: 'Prasmanan pernikahan kami ditangani dengan sempurna. Dekorasinya cantik!', img: 'https://placehold.co/400x320/690B22/fff?text=Wedding', tall: true },
  { name: 'Hj. Fatimah', org: 'Arisan RT 05', quote: 'Nasi kotaknya enak dan harganya sangat terjangkau. Cocok untuk pengajian.', img: null, tall: false },
  { name: 'David Chen', org: 'StartUp Borneo', quote: 'Tim kami selalu order tumpeng untuk perayaan milestone. Kualitas terbaik!', img: 'https://placehold.co/400x200/1B4D3E/fff?text=Office+Party', tall: false }
]

const stats = [
  { value: '5.000+', label: 'Porsi Terjual', icon: 'bxs-bowl-hot' },
  { value: '1.200+', label: 'Acara Dilayani', icon: 'bxs-calendar-check' },
  { value: '4.9/5', label: 'Rating Pelanggan', icon: 'bxs-star' },
  { value: '8+', label: 'Tahun Pengalaman', icon: 'bxs-award' }
]

const whyUs = [
  { text: 'Bahan Segar', sub: '100% bahan pilihan berkualitas', icon: 'bxs-leaf' },
  { text: 'Tepat Waktu', sub: 'Komitmen pengiriman on-time', icon: 'bxs-time-five' },
  { text: 'Harga Bersaing', sub: 'Kualitas premium, harga terjangkau', icon: 'bxs-wallet' },
  { text: 'Higienis', sub: 'Standar kebersihan tinggi', icon: 'bxs-shield-alt-2' }
]
</script>
