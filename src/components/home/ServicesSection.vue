<template>
  <section id="services" class="services-section scroll-mt-24" aria-labelledby="services-title">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <header class="services-heading">
        <div><p class="section-kicker">LAYANAN KAMI</p><h2 id="services-title">Anda punya acara,<br />kami punya <span>caranya.</span></h2></div>
        <p class="heading-note">Dari dapur sampai meja acara,<br />kami bantu urus sajiannya.</p>
      </header>
      <div class="service-stories">
        <article v-for="(service, index) in services" :key="service.title" class="service-story">
          <div class="story-drawing" :class="`drawing-${index}`" aria-hidden="true">
            <span class="drawing-backdrop"></span>
            <svg v-if="index === 0" viewBox="0 0 280 170" fill="none">
              <g stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M48 112H35M53 95H22M54 79H36" />
                <path d="M64 54L169 49L174 122L62 126Z" fill="#FDFBF7" />
                <path d="M170 74L206 73L234 102L237 120L174 122" fill="#E6B697" />
                <path d="M185 82L200 81L218 101L186 102Z" fill="#FDFBF7" />
                <circle cx="89" cy="127" r="16" fill="#FDFBF7" /><circle cx="89" cy="127" r="6" /><circle cx="210" cy="124" r="16" fill="#FDFBF7" /><circle cx="210" cy="124" r="6" />
                <path d="M99 92L117 66L137 91M94 94Q118 103 143 94M115 47L112 36M131 44L136 33" />
                <path d="M40 148Q91 144 135 147M172 146L242 143" stroke-dasharray="4 7" />
                <path d="M229 42L232 34L235 42L244 45L235 48L232 56L229 48L220 45Z" fill="#E6B697" stroke-width="2" />
              </g>
            </svg>
            <svg v-else-if="index === 1" viewBox="0 0 280 170" fill="none">
              <g stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M62 85Q74 140 141 141Q207 140 218 85Z" fill="#FDFBF7" /><ellipse cx="140" cy="85" rx="78" ry="17" fill="#F0D383" />
                <path d="M82 84Q102 65 123 84Q143 60 161 82Q180 66 201 82M102 108Q115 120 132 120" />
                <path d="M111 54C90 38 122 33 106 16M140 52C122 35 155 28 140 12M166 51C154 38 178 33 168 21" />
                <path d="M202 73L228 28M213 79L242 36M59 130L43 151M50 138L37 130" />
                <path d="M52 50Q30 30 36 16Q57 22 52 50ZM52 50L43 29" fill="#CBD4AD" />
                <path d="M229 121L233 112L237 121L246 125L237 129L233 138L229 129L220 125Z" stroke-width="2" />
              </g>
            </svg>
            <svg v-else viewBox="0 0 280 170" fill="none">
              <g stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="140" cy="120" rx="89" ry="21" fill="#FDFBF7" /><ellipse cx="140" cy="116" rx="72" ry="13" fill="#CBD4AD" />
                <path d="M107 114L140 39L174 113Q145 127 107 114Z" fill="#F0D383" />
                <path d="M140 39L142 24L159 31L141 36" fill="#E6B697" /><path d="M128 89L132 81M143 103L147 94M145 67L148 74" stroke-width="2" />
                <path d="M84 112Q78 101 88 97Q101 91 109 108M177 111Q179 94 192 98Q206 105 196 115M115 134L116 149L164 149L165 135" fill="#E6B697" />
                <path d="M75 55L80 41L85 55L99 60L85 65L80 79L75 65L61 60ZM204 65L208 55L212 65L222 69L212 73L208 83L204 73L194 69Z" stroke-width="2" />
                <path d="M49 94L39 90M225 100L239 95M184 36L189 24" />
              </g>
            </svg>
            <span class="drawing-caption">{{ service.note }}</span>
          </div>
          <div class="story-copy"><span class="story-number">0{{ index + 1 }}</span><h3>{{ service.title }}</h3><p>{{ service.description }}</p></div>
        </article>
      </div>
      <div class="services-signoff"><span aria-hidden="true">✳</span><p>Acara kecil atau besar, kami siapkan dengan hati.</p><span class="signoff-line" aria-hidden="true"></span></div>
    </div>
  </section>
</template>
<script setup>
const services = [
  { title: 'Tinggal tunggu, kami antar.', note: 'Siap meluncur!', description: 'Sajian diantar tepat waktu dengan kemasan aman dan higienis. Sampai di tempat, siap dinikmati bersama.' },
  { title: 'Banyak pilihan, satu rasa: enak.', note: 'Racikan dari dapur kami', description: 'Dari masakan Nusantara sampai menu modern. Bahan segar dan cita rasa rumahan untuk selera setiap tamu.' },
  { title: 'Cantik ditata, nikmat disantap.', note: 'Siap jadi pusat perhatian', description: 'Tumpeng, prasmanan, hingga nasi kotak ditata dengan cermat. Biar meja acara sama istimewanya dengan momennya.' },
]
</script>
<style scoped>
.services-section { padding: 80px 0 65px; color: #690b22; }
.section-kicker { color: #a75039; font-size: 10px; font-weight: 650; letter-spacing: .16em; margin-bottom: 15px; }
.services-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }.services-heading h2 { font-size: clamp(32px, 4vw, 48px); }.services-heading h2 span { color: #a75039; }.heading-note { font-size: 13px; line-height: 1.9; color: #52695b; padding-bottom: 7px; }
.service-stories { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 52px; margin-top: 36px; }.service-story { min-width: 0; }.service-story:nth-child(2) { padding-top: 27px; }
.story-drawing { position: relative; height: 210px; display: grid; place-items: center; }.story-drawing svg { position: relative; width: 100%; max-width: 280px; height: 170px; transform: rotate(-3deg); }.drawing-1 svg { transform: rotate(3deg); }.drawing-2 svg { transform: rotate(-2deg); }.drawing-backdrop { position: absolute; width: 155px; height: 145px; border-radius: 48% 52% 43% 57%; background: #f1e3d3; transform: rotate(17deg); }.drawing-1 .drawing-backdrop { background: #e6ead9; border-radius: 60% 40% 50% 50%; }.drawing-2 .drawing-backdrop { background: #f7e6c6; }.drawing-caption { position: absolute; right: 0; bottom: 0; font-family: var(--font-headline); font-size: 16px; transform: rotate(-6deg); color: #8b6149; }
.story-copy { margin-top: 27px; position: relative; padding-top: 22px; border-top: 1px solid #690b2225; }.story-number { position: absolute; right: 0; top: 16px; color: #ae8470; font-size: 11px; }.story-copy h3 { font-size: 25px; padding-right: 28px; max-width: 285px; }.story-copy > p { margin-top: 12px; color: #52695b; font-size: 12px; line-height: 1.9; max-width: 310px; }
.services-signoff { display: flex; align-items: center; gap: 14px; margin-top: 45px; }.services-signoff > span:first-child { font-size: 30px; color: #b5664e; }.services-signoff p { font-size: 11px; color: #7c7166; }.signoff-line { flex: 1; height: 1px; background: #690b2217; margin-left: 12px; }
@media(max-width: 900px) { .service-stories { gap: 25px; }.story-copy h3 { font-size: 23px; }.drawing-caption { font-size: 14px; } }
@media(max-width: 639px) { .services-section { padding: 52px 0 35px; }.services-heading { display: block; }.heading-note { margin-top: 16px; }.service-stories { grid-template-columns: 1fr; gap: 32px; margin-top: 20px; }.service-story:nth-child(2) { padding-top: 0; }.story-drawing { max-width: 290px; margin: auto; height: 185px; }.story-copy { margin-top: 20px; padding-top: 16px; }.story-copy h3 { max-width: none; font-size: 26px; }.story-copy > p { max-width: none; font-size: 13px; }.services-signoff { margin-top: 30px; gap: 10px; }.signoff-line { display: none; } }
</style>
