<template>
  <section class="why-section" aria-labelledby="why-title">
    <div class="why-layout max-w-7xl mx-auto px-6 lg:px-8">
      <header class="why-intro">
        <p class="why-kicker">KENAPA DAPUR MAMAH IIS?</p>
        <h2 id="why-title">Bukan cuma enak.<br />Bikin <span>tenang</span> juga.</h2>
        <p class="why-description">Di balik setiap sajian, ada hal-hal kecil yang kami jaga. Supaya Anda bisa fokus menikmati acaranya.</p>
        <div class="kitchen-stamp" aria-hidden="true"><span>DARI DAPUR KAMI</span><strong>Sepenuh<br />hati.</strong><span>✳ &nbsp; UNTUK ACARA ANDA &nbsp; ✳</span></div>
        <svg class="intro-scribble" viewBox="0 0 140 65" fill="none" aria-hidden="true"><path d="M4 13C36 64 109 47 91 18C75-7 52 43 128 41M119 31L132 41L120 49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </header>
      <ol class="why-list">
        <li v-for="(reason, index) in reasons" :key="reason.title">
          <span class="reason-number">0{{ index + 1 }}</span>
          <div><h3>{{ reason.title }}</h3><p>{{ reason.description }}</p></div>
          <svg class="reason-mark" viewBox="0 0 60 60" fill="none" aria-hidden="true">
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="index === 0"><path d="M15 44C4 23 26 11 47 12C48 36 34 49 15 44Z" /><path d="M12 50L38 22M22 39L21 27M29 32L40 33" /></template>
              <template v-else-if="index === 1"><path d="M48 18A22 22 0 1 1 33 8M30 16V31L41 37M44 6L46 14L54 12" /></template>
              <template v-else-if="index === 2"><path d="M12 16L40 9L45 19M10 20L48 18L50 46L12 49Z" /><path d="M50 29L34 30L35 39L50 38" /><circle cx="40" cy="34" r="1" /></template>
              <template v-else><path d="M29 8C36 14 43 16 50 16L48 34Q42 47 30 52Q15 46 11 33L10 16Q22 15 29 8Z" /><path d="M20 30L27 37L40 23" /></template>
            </g>
          </svg>
        </li>
      </ol>
    </div>
  </section>
</template>
<script setup>
const reasons = [
  { title: 'Segarnya terasa.', description: 'Bahan segar pilihan, karena rasa yang baik dimulai dari bahan yang baik.' },
  { title: 'Pas waktunya.', description: 'Jadwal pengantaran kami jaga. Sajian siap saat acara Anda dimulai.' },
  { title: 'Pas juga di anggaran.', description: 'Pilihan paket dengan harga bersaing, tanpa mengurangi kualitas sajian.' },
  { title: 'Bersih, dari awal.', description: 'Dari persiapan, proses memasak, sampai pengemasan, kebersihan selalu kami jaga.' },
]
</script>
<style scoped>
.why-section { position: relative; padding: 70px 0; background: #f0e7d9; color: #234b3b; border-top: 1px solid #234b3b15; border-bottom: 1px solid #234b3b15; }
.why-layout { display: grid; grid-template-columns: .95fr 1.1fr; gap: 90px; align-items: center; }.why-intro { position: relative; }.why-kicker { font-size: 10px; font-weight: 650; letter-spacing: .15em; margin-bottom: 18px; color: #755847; }.why-intro h2 { font-size: clamp(32px, 3.6vw, 46px); }.why-intro h2 span { position: relative; white-space: nowrap; }.why-intro h2 span::after { content: ''; position: absolute; inset: auto -5px -5px; height: 11px; border-top: 2px solid #b3654b; border-radius: 50%; transform: rotate(-4deg); }.why-description { font-size: 12px; line-height: 1.9; max-width: 340px; margin-top: 20px; color: #576650; }
.kitchen-stamp { width: 135px; height: 135px; margin: 30px 0 0 8px; border: 1px solid #a15d45; outline: 1px solid #a15d4560; outline-offset: -6px; border-radius: 50%; color: #974c35; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 7px; transform: rotate(-12deg); }.kitchen-stamp > span { font-size: 6px; letter-spacing: .1em; font-weight: 650; }.kitchen-stamp strong { font-family: var(--font-headline); font-weight: 400; text-align: center; font-size: 27px; line-height: 1.05; }.intro-scribble { position: absolute; width: 120px; bottom: 12px; left: 165px; color: #a15d45; }
.why-list { list-style: none; padding: 0; margin: 0; }.why-list li { display: grid; grid-template-columns: 27px minmax(0,1fr) 52px; gap: 18px; padding: 25px 0; border-top: 1px solid #234b3b30; align-items: start; }.why-list li:last-child { border-bottom: 1px solid #234b3b30; }.reason-number { font-size: 11px; font-weight: 500; color: #8a725a; padding-top: 8px; }.why-list h3 { font-size: 27px; }.why-list p { margin-top: 7px; font-size: 12px; line-height: 1.85; color: #576650; max-width: 330px; }.reason-mark { width: 52px; height: 52px; color: #58724c; transform: rotate(7deg); }.why-list li:nth-child(even) .reason-mark { color: #a15d45; transform: rotate(-7deg); }
@media(max-width: 900px) { .why-layout { gap: 40px; }.why-list li { gap: 12px; grid-template-columns: 23px minmax(0,1fr) 40px; }.reason-mark { width: 40px; height: 40px; } }
@media(max-width: 639px) { .why-section { padding: 45px 0; }.why-layout { grid-template-columns: 1fr; gap: 30px; }.why-description { max-width: 100%; font-size: 13px; }.kitchen-stamp { width: 105px; height: 105px; margin-top: 24px; }.kitchen-stamp strong { font-size: 23px; }.kitchen-stamp > span { font-size: 5px; }.intro-scribble { left: 140px; width: 95px; }.why-list h3 { font-size: 25px; }.why-list p { font-size: 12px; }.why-list li { padding: 22px 0; } }
</style>
