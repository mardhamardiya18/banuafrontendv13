<template>
  <section class="proof-section py-12 md:py-16" aria-labelledby="proof-title">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="proof-panel">
        <header class="proof-heading">
          <div>
            <p class="proof-eyebrow"><span aria-hidden="true"></span> DARI DAPUR, DENGAN SEPENUH HATI</p>
            <h2 id="proof-title">Ribuan sajian.<br class="sm:hidden" /> Cerita bahagia <em>tak terhitung.</em></h2>
          </div>
          <p class="proof-intro">Terima kasih sudah menjadikan kami<br class="hidden lg:block" /> bagian dari momen istimewa Anda.</p>
        </header>

        <dl class="proof-grid">
          <div v-for="stat in stats" :key="stat.id" class="proof-card" :class="`proof-card--${stat.id}`">
            <div class="proof-card-top" aria-hidden="true">
              <span class="proof-icon"><component :is="stat.icon" :size="23" :stroke-width="1.65" /></span>
              <span class="proof-note">{{ stat.note }}</span>
            </div>
            <dt class="proof-label">{{ stat.label }}</dt>
            <dd class="proof-value">{{ stat.value }}<span>{{ stat.suffix }}</span></dd>
            <div class="proof-card-bottom">
              <span>{{ stat.caption }}</span>
              <span v-if="stat.id === 'rating'" class="proof-stars" aria-hidden="true"><Star v-for="star in 5" :key="star" :size="12" fill="currentColor" /></span>
              <Heart v-else-if="stat.id === 'portions'" :size="17" aria-hidden="true" />
              <span v-else class="proof-spark" aria-hidden="true">✳</span>
            </div>
            <div class="proof-rings" aria-hidden="true"></div>
          </div>
        </dl>
        <div class="proof-footer"><span class="proof-footer-line"></span><span>Rasa rumahan, untuk setiap perayaan.</span><span class="proof-footer-line"></span></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { CookingPot, CalendarCheck, Star, Award, Heart } from 'lucide-vue-next'

const stats = [
  { id: 'portions', value: '5.000', suffix: '+', label: 'Porsi Terjual', icon: CookingPot, note: 'SEPENUH HATI', caption: 'Disajikan dengan cinta' },
  { id: 'events', value: '1.200', suffix: '+', label: 'Acara Dilayani', icon: CalendarCheck, note: 'MOMEN SPESIAL', caption: 'Dari hangat hingga meriah' },
  { id: 'rating', value: '4.9', suffix: '/5', label: 'Rating Pelanggan', icon: Star, note: 'KATA MEREKA', caption: 'Kepuasan pelanggan' },
  { id: 'years', value: '5', suffix: '+', label: 'Tahun Pengalaman', icon: Award, note: 'TUMBUH BERSAMA', caption: 'Menjaga rasa & kepercayaan' },
]
</script>

<style scoped>
.proof-panel { padding: 34px; border: 1px solid #690b2210; border-radius: 32px; background: #f4efe8; }
.proof-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 28px; }
.proof-eyebrow { display: flex; align-items: center; gap: 8px; color: #855246; font-size: 10px; font-weight: 750; letter-spacing: .16em; margin-bottom: 12px; }
.proof-eyebrow span { width: 6px; height: 6px; background: #ae5845; border-radius: 50%; }
.proof-heading h2 { max-width: 590px; color: #690b22; font-size: clamp(24px, 2.5vw, 32px); line-height: 1.3; font-weight: 750; letter-spacing: -.045em; }
.proof-heading em { font-family: Georgia, serif; font-weight: 400; color: #a45340; }
.proof-intro { color: #74665d; font-size: 12px; line-height: 1.8; }
.proof-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.proof-card { position: relative; display: flex; flex-direction: column; overflow: hidden; min-width: 0; padding: 24px 22px 19px; border-radius: 21px; color: #690b22; background: #fffcf6; transition: transform .25s ease, box-shadow .25s ease; }
.proof-card--portions { background: #690b22; color: #fff5e8; box-shadow: 0 10px 24px #690b2218; }
.proof-card--rating { background: #e2e9de; color: #314d3c; }
.proof-card--years { background: #eed7c6; }
.proof-card-top, .proof-card-bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.proof-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid currentColor; border-color: color-mix(in srgb, currentColor 18%, transparent); }
.proof-card--portions .proof-icon { color: #f4b597; }
.proof-note { font-size: 8px; font-weight: 700; letter-spacing: .12em; }
.proof-label { position: relative; z-index: 1; margin-top: 30px; font-size: 13px; font-weight: 600; }
.proof-value { position: relative; z-index: 1; margin: 5px 0 23px; font-size: clamp(36px, 4vw, 52px); font-weight: 750; letter-spacing: -.065em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.proof-value > span { margin-left: 3px; font-size: .58em; font-weight: 450; letter-spacing: -.04em; }
.proof-card-bottom { margin-top: auto; padding-top: 14px; border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent); font-size: 10px; line-height: 1.5; }
.proof-card-bottom > svg { flex-shrink: 0; }
.proof-stars { display: flex; gap: 2px; }
.proof-spark { font-size: 22px; line-height: 16px; }
.proof-rings { position: absolute; width: 180px; height: 180px; right: -115px; top: 55px; border: 1px solid currentColor; border-radius: 50%; opacity: .07; box-shadow: 0 0 0 16px, 0 0 0 33px; pointer-events: none; }
.proof-footer { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 24px; color: #84756b; font-size: 11px; }
.proof-footer-line { width: 36px; height: 1px; background: #d5c8ba; }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .proof-card:hover { transform: translateY(-5px); box-shadow: 0 14px 25px #49251912; }
}
@media (max-width: 1023px) {
  .proof-heading { align-items: flex-start; flex-direction: column; gap: 12px; }
  .proof-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .proof-value { font-size: 48px; }
}
@media (max-width: 479px) {
  .proof-panel { padding: 22px 12px 20px; border-radius: 25px; }
  .proof-heading { padding: 0 6px; margin-bottom: 22px; }
  .proof-eyebrow { font-size: 8px; letter-spacing: .1em; }
  .proof-grid { gap: 10px; }
  .proof-card { padding: 16px 13px; border-radius: 17px; }
  .proof-icon { width: 36px; height: 36px; }
  .proof-note { max-width: 64px; font-size: 7px; text-align: right; }
  .proof-label { margin-top: 24px; font-size: 11px; }
  .proof-value { font-size: clamp(30px, 9vw, 42px); margin-bottom: 18px; }
  .proof-card-bottom { align-items: flex-start; flex-direction: column; font-size: 9px; gap: 8px; }
  .proof-footer { gap: 8px; font-size: 9px; }
  .proof-footer-line { width: 18px; }
}
</style>
