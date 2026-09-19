<template>
  <footer id="footer" class="site-footer">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="footer-invitation">
        <div><p class="footer-eyebrow">DARI DAPUR KAMI, UNTUK MOMEN ANDA</p><h2>Acara boleh usai.<br />Rasa baiknya <span>tinggal lama.</span></h2></div>
        <a href="https://wa.me/6285156253408" target="_blank" rel="noopener noreferrer" class="footer-chat"><span>Yuk, cerita soal acaramu</span><ArrowUpRight :size="22" aria-hidden="true" /></a>
      </div>

      <div class="footer-columns">
        <div class="footer-brand">
          <RouterLink to="/" class="brand-link" aria-label="DMI Catering ? Beranda"><img :src="logo" alt="" width="44" height="44" loading="lazy" /><span><strong>DMI Catering</strong><small>By Dapur Mamah Iis</small></span></RouterLink>
          <p>Tumpeng dan catering dengan rasa rumahan, untuk setiap cerita dan perayaan Anda di Banua.</p>
          <span class="brand-signature">Dimasak dengan hati. ?</span>
        </div>

        <nav aria-labelledby="footer-explore">
          <h3 id="footer-explore">Jelajahi</h3>
          <ul><li v-for="link in links" :key="link.to"><a v-if="link.to.includes('#')" :href="link.to">{{ link.label }}</a><RouterLink v-else :to="link.to">{{ link.label }}</RouterLink></li></ul>
        </nav>

        <div class="footer-contact">
          <h3>Temui kami</h3>
          <a href="https://wa.me/6285156253408" target="_blank" rel="noopener noreferrer" class="contact-number" aria-label="WhatsApp admin 0851-5625-3408">0851-5625-3408 <ArrowUpRight :size="14" aria-hidden="true" /></a>
          <address>Komp. Putra Tunggal Mandiri<br />Jl. H. Tanda Blok D No. 06,<br />Landasan Ulin Tengah, Banjarbaru</address>
          <a href="https://maps.app.goo.gl/yqovJ86iasqgBCER8" target="_blank" rel="noopener noreferrer" class="map-link">Petunjuk arah <ArrowUpRight :size="14" aria-hidden="true" /></a>
        </div>

        <div class="footer-hours">
          <h3>Waktu berkunjung</h3>
          <dl><div><dt>Senin ? Sabtu</dt><dd>07.00 ? 18.00</dd></div><div><dt>Minggu</dt><dd>Dengan janji temu</dd></div></dl>
          <p>Ada pesanan mendadak?<br />Hubungi kami dulu, ya.</p>
        </div>
      </div>

      <div class="footer-bottom"><p>? {{ year }} DMI Catering. Semua hak dilindungi.</p><span>Banjarbaru, Kalimantan Selatan <span class="bottom-flower" aria-hidden="true">?</span></span></div>
    </div>
  </footer>
</template>

<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import logo from '../../assets/images/logo-small.webp'
const year = new Date().getFullYear()
const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Katalog menu', to: '/katalog' },
  { label: 'Layanan kami', to: '/#services' },
  { label: 'Cerita pelanggan', to: '/#testimonials' },
]
</script>

<style scoped>
.site-footer { margin-top: 80px; padding-bottom: 30px; color: #43594e; background: transparent; }
.footer-invitation { display: flex; align-items: center; justify-content: space-between; gap: 35px; padding: 35px 0 45px; border-top: 1px solid #690b2220; border-bottom: 1px solid #690b2220; }
.footer-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: .16em; color: #8e6856; margin-bottom: 15px; }
.footer-invitation h2 { font-size: clamp(30px, 3.5vw, 43px); color: #690b22; }.footer-invitation h2 span { color: #9a5940; }
.footer-chat { display: inline-flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 0; border-bottom: 1px solid #690b22; font-size: 13px; font-weight: 500; color: #690b22; flex-shrink: 0; }
.footer-columns { display: grid; grid-template-columns: 1.35fr .75fr 1.1fr 1fr; gap: 40px; padding: 45px 0 48px; }
.brand-link { display: inline-flex; align-items: center; gap: 12px; min-height: 48px; }.brand-link img { width: 44px; height: 44px; object-fit: contain; }.brand-link strong { display: block; color: #690b22; font-size: 19px; font-weight: 650; letter-spacing: -.04em; }.brand-link small { display: block; font-size: 9px; margin-top: 2px; color: #64786b; }
.footer-brand > p { font-size: 12px; line-height: 1.9; max-width: 260px; margin: 21px 0 16px; }.brand-signature { font-family: var(--font-headline); font-size: 19px; color: #a16b51; }
.footer-columns h3 { font-size: 21px; color: #690b22; margin: 3px 0 17px; }.footer-columns ul { list-style: none; margin: 0; padding: 0; }.footer-columns li a { display: inline-flex; align-items: center; min-height: 38px; font-size: 12px; }
.contact-number { display: inline-flex; gap: 10px; align-items: center; min-height: 38px; color: #690b22; font-size: 13px; font-weight: 600; }.footer-contact address { font-style: normal; font-size: 11px; line-height: 1.9; margin: 11px 0 7px; }.map-link { display: inline-flex; align-items: center; min-height: 40px; gap: 9px; font-size: 11px; font-weight: 500; color: #914f39; }
.footer-hours dl > div { padding: 9px 0 12px; border-bottom: 1px solid #690b2212; }.footer-hours dt { font-size: 11px; }.footer-hours dd { font-size: 12px; font-weight: 500; color: #304d3b; margin: 5px 0 0; }.footer-hours > p { font-size: 10px; line-height: 1.9; margin-top: 15px; color: #746c60; }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-top: 22px; border-top: 1px solid #690b2218; font-size: 10px; color: #756e62; }.footer-bottom > span { display: inline-flex; align-items: center; gap: 18px; }.bottom-flower { color: #ad7859; font-size: 25px; }
.site-footer a { transition: color .2s; }.site-footer a:hover { color: #a75039; }.site-footer a:focus-visible { outline: 2px solid #a75039; outline-offset: 5px; border-radius: 2px; }
@media(max-width: 1023px) { .footer-columns { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 35px 55px; }.footer-hours dl { max-width: 270px; } }
@media(max-width: 639px) { .site-footer { margin-top: 48px; padding-bottom: 90px; }.footer-invitation { display: block; padding: 28px 0 30px; }.footer-eyebrow { font-size: 8px; letter-spacing: .1em; }.footer-chat { margin-top: 20px; font-size: 12px; gap: 25px; }.footer-columns { gap: 30px 22px; padding: 32px 0; }.footer-brand { grid-column: 1 / -1; }.footer-brand > p { max-width: 340px; margin: 15px 0 10px; }.footer-columns h3 { font-size: 20px; }.footer-hours { grid-column: 1 / -1; }.footer-hours dl { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; max-width: none; }.footer-hours > p br { display: none; }.contact-number { font-size: 11px; gap: 5px; }.footer-contact address { font-size: 10px; }.footer-bottom { align-items: flex-start; flex-direction: column; gap: 12px; font-size: 9px; }.footer-bottom > span { gap: 12px; }.footer-columns li a { min-height: 44px; } }
</style>
