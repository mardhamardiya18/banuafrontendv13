<template>
  <footer id="footer" class="bg-brand-forest-dark text-white/80 rounded-t-[3rem] mt-10">
    <div class="px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img :src="logo" alt="Logo" class="h-10 w-auto brightness-0 invert">
            <div class="flex flex-col">
              <span class="text-2xl font-extrabold tracking-tight text-white">DMI Catering</span>
              <small class="text-xs">By Dapur Mamah Iis</small>
            </div>
          </div>
          <p class="text-sm leading-relaxed text-white/50">Layanan catering premium dengan cita rasa autentik Nusantara.</p>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Kontak</h4>
          <ul class="space-y-3 text-sm text-white/50">
            <li class="flex items-center gap-2">
              <i class='bx bxs-phone text-brand-terracotta'></i>
              +62 812-3456-7890
            </li>
            <li class="flex items-center gap-2">
              <i class='bx bxs-envelope text-brand-terracotta'></i>
              hello@banuacatering.id
            </li>
            <li class="flex items-center gap-2">
              <i class='bx bxs-map text-brand-terracotta'></i>
              Banjarmasin, Kalsel
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm text-white/50">
            <li><router-link to="/" class="hover:text-brand-terracotta transition-colors">Home</router-link></li>
            <li><router-link to="/katalog" class="hover:text-brand-terracotta transition-colors">Katalog</router-link></li>
            <li><a href="#services" class="hover:text-brand-terracotta transition-colors">Services</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Social Media</h4>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-300">
              <i class='bx bxl-instagram text-xl text-white'></i>
            </a>
            <a href="#" class="w-10 h-10 bg-white/10 hover:bg-brand-terracotta rounded-xl flex items-center justify-center transition-all duration-300">
              <i class='bx bxl-facebook text-xl text-white'></i>
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/30">
        <p>&copy; 2026 BanuaCatering. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from '../../assets/images/logo.png'
</script>

