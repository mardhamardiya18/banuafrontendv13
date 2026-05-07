<template>
  <footer id="footer" class="bg-brand-forest-dark text-white/80 rounded-t-[3rem] mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <img :src="logo" alt="Logo" class="h-12 w-auto brightness-0 invert">
            <div class="flex flex-col">
              <span class="text-2xl font-black tracking-tight text-white uppercase">DMI Catering</span>
              <small class="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">By Dapur Mamah Iis</small>
            </div>
          </div>
          <p class="text-sm leading-relaxed text-white/50 max-w-xs">
            Layanan catering premium dengan cita rasa autentik Nusantara. Kami menghadirkan kelezatan di setiap momen spesial Anda.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-white/5 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <i class='bx bxl-instagram text-xl text-white'></i>
            </a>
            <a href="#" class="w-10 h-10 bg-white/5 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <i class='bx bxl-facebook text-xl text-white'></i>
            </a>
            <a href="#" class="w-10 h-10 bg-white/5 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-300 border border-white/5">
              <i class='bx bxl-whatsapp text-xl text-white'></i>
            </a>
          </div>
        </div>

        <!-- Contact Section -->
        <div>
          <h4 class="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Kontak Kami</h4>
          <ul class="space-y-4 text-sm text-white/50 font-medium">
            <li class="flex items-start gap-3">
              <i class='bx bxs-phone text-brand-terracotta text-lg'></i>
              <span>+62 812-3456-7890</span>
            </li>
            <li class="flex items-start gap-3">
              <i class='bx bxs-envelope text-brand-terracotta text-lg'></i>
              <span>hello@dmificatering.id</span>
            </li>
            <li class="flex items-start gap-3">
              <i class='bx bxs-map text-brand-terracotta text-lg'></i>
              <span class="leading-relaxed">Banjarmasin, Kalimantan Selatan, Indonesia</span>
            </li>
          </ul>
        </div>

        <!-- Links Section -->
        <div>
          <h4 class="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Navigasi</h4>
          <ul class="space-y-3 text-sm text-white/50 font-medium">
            <li><router-link to="/" class="hover:text-brand-terracotta transition-colors flex items-center gap-2 group"><i class='bx bx-chevron-right opacity-0 group-hover:opacity-100 transition-all'></i> Beranda</router-link></li>
            <li><router-link to="/katalog" class="hover:text-brand-terracotta transition-colors flex items-center gap-2 group"><i class='bx bx-chevron-right opacity-0 group-hover:opacity-100 transition-all'></i> Katalog Menu</router-link></li>
            <li><a href="/#services" class="hover:text-brand-terracotta transition-colors flex items-center gap-2 group"><i class='bx bx-chevron-right opacity-0 group-hover:opacity-100 transition-all'></i> Layanan Kami</a></li>
            <li><a href="/#testimonials" class="hover:text-brand-terracotta transition-colors flex items-center gap-2 group"><i class='bx bx-chevron-right opacity-0 group-hover:opacity-100 transition-all'></i> Testimoni</a></li>
          </ul>
        </div>

        <!-- Working Hours / Newsletter -->
        <div>
          <h4 class="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Jam Operasional</h4>
          <ul class="space-y-4 text-sm text-white/50 font-medium">
            <li class="flex justify-between border-b border-white/5 pb-2">
              <span>Senin - Jumat</span>
              <span class="text-white/80">08:00 - 17:00</span>
            </li>
            <li class="flex justify-between border-b border-white/5 pb-2">
              <span>Sabtu</span>
              <span class="text-white/80">09:00 - 15:00</span>
            </li>
            <li class="flex justify-between text-brand-terracotta">
              <span>Minggu</span>
              <span class="font-bold">By Appointment</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright Section -->
      <div class="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
        <p>&copy; 2026 DMI Catering. All rights reserved.</p>
        <div class="flex gap-8">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from '../../assets/images/logo.png'
</script>
