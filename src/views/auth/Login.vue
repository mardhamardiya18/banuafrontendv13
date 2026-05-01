<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-cream-light px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-brand-maroon/5">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-brand-maroon tracking-tight">Sign in to your account</h2>
        <p class="mt-2 text-sm text-brand-forest-dark">Please enter your credentials</p>
      </div>
      <div class="space-y-4">
        <!-- Placeholder Form -->
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-brand-forest-dark/60">Email Address</label>
          <input type="text" class="w-full bg-brand-cream-light/30 border border-brand-maroon/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta" placeholder="name@example.com">
        </div>
        
        <button class="w-full bg-brand-terracotta hover:bg-brand-maroon text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-terracotta/20 transition-all active:scale-95">
          Sign In
        </button>
        
        <p class="text-center text-xs text-brand-forest-dark/50">
          Banua Frontend v13 &bull; Secure Authentication
        </p>
      </div>
    </div>
  </div>
</template>
