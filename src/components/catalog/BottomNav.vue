<template>
  <!-- Fixed Bottom Navigation -->
  <nav class="fixed bottom-0 left-0 w-full z-40 px-6 pb-6 pt-4 pointer-events-none flex justify-center">
    <div class="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 p-2 flex items-center justify-between pointer-events-auto relative">
      
      <!-- Home Menu -->
      <button class="w-12 h-12 flex items-center justify-center text-brand-maroon rounded-2xl hover:bg-brand-maroon/5 transition-colors group">
        <i class="bx bxs-home-alt-2 text-2xl group-hover:-translate-y-1 transition-transform"></i>
      </button>
      
      <!-- Favorite Menu -->
      <button class="w-12 h-12 flex items-center justify-center text-brand-forest-dark/40 rounded-2xl hover:bg-brand-maroon/5 hover:text-brand-maroon transition-colors group">
        <i class="bx bx-heart text-2xl group-hover:-translate-y-1 transition-transform"></i>
      </button>

      <!-- Center Floating Button (WhatsApp) -->
      <div class="relative -top-6 mx-2">
        <a href="https://wa.me/6281234567890" target="_blank" class="w-14 h-14 bg-brand-terracotta hover:bg-brand-maroon text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-terracotta/30 transition-all duration-300 active:scale-95 group">
          <i class="bx bxl-whatsapp text-2xl group-hover:scale-110 transition-transform"></i>
        </a>
      </div>

      <!-- Profile Menu -->
      <button class="w-12 h-12 flex items-center justify-center text-brand-forest-dark/40 rounded-2xl hover:bg-brand-maroon/5 hover:text-brand-maroon transition-colors group">
        <i class="bx bx-user text-2xl group-hover:-translate-y-1 transition-transform"></i>
      </button>

      <!-- WhatsApp Menu -->
      <a href="https://wa.me/6281234567890" target="_blank" class="w-12 h-12 flex items-center justify-center text-brand-forest-dark/40 rounded-2xl hover:bg-brand-maroon/5 hover:text-[#25D366] transition-colors group">
        <i class="bx bxl-whatsapp text-2xl group-hover:-translate-y-1 transition-transform"></i>
      </a>
      
    </div>
  </nav>
</template>

<script setup>
</script>
