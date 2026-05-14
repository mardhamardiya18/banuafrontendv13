<template>
  <footer id="footer" class="bg-brand-forest-dark text-white/70 rounded-t-[4rem] relative overflow-hidden mt-32">
    <!-- Subtle Background Element -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-brand-terracotta/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
    
    <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 pb-12 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
        
        <!-- Brand Section -->
        <div class="lg:col-span-4 space-y-8">
          <div class="flex items-center gap-4 group">
            <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-terracotta/30 transition-colors duration-500">
              <img :src="logo" alt="Logo" class="h-9 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity">
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-black tracking-tight text-white uppercase leading-none mb-1">DMI Catering</span>
              <small class="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">By Dapur Mamah Iis</small>
            </div>
          </div>
          
          <p class="text-sm leading-relaxed max-w-sm text-white/40 font-medium">
            Solusi konsumsi acara sukses dengan rasa autentik dan tampilan menawan. Sajikan kelezatan tumpeng tradisional dan catering terbaik untuk setiap momen spesial Anda.
          </p>
          
          <div class="flex gap-4 pt-2">
            <a v-for="social in [{icon:'bx bxl-instagram', link:'#'}, {icon:'bx bxl-facebook', link:'#'}, {icon:'bx bxl-whatsapp', link:'https://wa.me/6285156253408'}]" 
               :key="social.icon"
               :href="social.link" 
               class="w-11 h-11 bg-white/5 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-500 border border-white/5 hover:border-brand-terracotta/50 group/social">
              <i :class="[social.icon, 'text-xl text-white/50 group-hover/social:text-white group-hover/social:scale-110 transition-all']"></i>
            </a>
          </div>
        </div>

        <!-- Navigation Section -->
        <div class="lg:col-span-2">
          <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-10">Eksplorasi</h4>
          <ul class="space-y-4 text-sm font-bold">
            <li v-for="link in [{n:'Beranda', p:'/'}, {n:'Katalog', p:'/katalog'}, {n:'Layanan', p:'/#services'}, {n:'Testimoni', p:'/#testimonials'}]" :key="link.n">
              <router-link v-if="link.p.startsWith('/') && !link.p.includes('#')" :to="link.p" class="text-white/50 hover:text-brand-terracotta transition-all duration-300 flex items-center gap-2 group">
                <span class="w-1 h-1 bg-brand-terracotta rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.n }}
              </router-link>
              <a v-else :href="link.p" class="text-white/50 hover:text-brand-terracotta transition-all duration-300 flex items-center gap-2 group">
                <span class="w-1 h-1 bg-brand-terracotta rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.n }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="lg:col-span-3">
          <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-10">Hubungi Kami</h4>
          <div class="space-y-8">
            <div class="flex items-start gap-4 group">
              <div class="w-10 h-10 rounded-xl bg-brand-terracotta/10 flex items-center justify-center shrink-0 border border-brand-terracotta/20">
                <i class='bx bxl-whatsapp text-brand-terracotta text-xl'></i>
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">WhatsApp Admin</span>
                <span class="text-white font-bold tracking-wide">0851-5625-3408</span>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <i class='bx bxs-map text-white/30 text-xl'></i>
              </div>
              <div class="flex flex-col gap-3">
                <span class="text-[10px] uppercase tracking-widest text-white/20 font-bold">Lokasi Kami</span>
                <p class="text-xs leading-relaxed text-white/40 font-medium">
                  Komp Putra Tunggal Mandiri Jl.H.Tanda Blok.D No.06, Landasan Ulin Tengah, Banjarbaru
                </p>
                <a href="https://maps.app.goo.gl/yqovJ86iasqgBCER8" target="_blank" 
                   class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-terracotta hover:text-white transition-colors group/map">
                  <span>Petunjuk Arah</span>
                  <i class='bx bx-right-arrow-alt text-lg group-hover/map:translate-x-1 transition-transform'></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Working Hours -->
        <div class="lg:col-span-3">
          <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 mb-10">Jam Operasional</h4>
          <div class="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
            <div class="flex justify-between items-center text-xs">
              <span class="text-white/40 font-bold uppercase tracking-wider">Senin - Sabtu</span>
              <span class="text-white font-black">07:00 - 18:00</span>
            </div>
            <div class="h-px bg-white/5 w-full"></div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-white/40 font-bold uppercase tracking-wider">Minggu</span>
              <span class="text-brand-terracotta font-black italic">By Appointment</span>
            </div>
          </div>
          <p class="mt-4 text-[10px] text-white/20 font-medium italic text-center">
            *Silakan hubungi kami untuk pesanan mendadak
          </p>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex flex-col items-center md:items-start gap-2">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            &copy; 2026 DMI Catering. All rights reserved.
          </p>
        </div>
        
        <div class="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
          <a href="#" class="hover:text-brand-terracotta transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-brand-terracotta transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from '../../assets/images/logo.png'
</script>
