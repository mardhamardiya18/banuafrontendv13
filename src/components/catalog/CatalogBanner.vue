<template>
  <div class="px-6 mt-6">
    <section class="catalog-banner" aria-labelledby="catalog-banner-title">
      <div class="banner-copy">
        <span class="eyebrow"><span aria-hidden="true">✳</span> DARI DAPUR, UNTUK MOMEN SPESIAL</span>
        <h3 id="catalog-banner-title">Ada acara?<br>Biar kami yang <em>masak!</em></h3>
        <p>Tumpeng, nasi kotak, sampai prasmanan. Sajian penuh rasa, bikin kumpul makin berkesan.</p>
        <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Boleh%20minta%20info%20promo%20cateringnya%3F" target="_blank" rel="noopener noreferrer" class="banner-cta">Lihat Promo <span aria-hidden="true">↗</span></a>
        <span class="signoff">Pian punya acara, kami bawa rasa.</span>
      </div>
      <div class="banner-art" aria-hidden="true">
        <span class="doodle-note">Sepenuh hati,<br>sepiring bahagia!</span>
        <svg viewBox="0 0 480 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M75 160C46 67 148 26 261 51C375 15 465 132 406 242C363 324 151 331 84 253" fill="#efdfb8"/>
          <g stroke="#690b22" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m59 83 12 9m-23 8 16 2m-7 20 13-8M394 70l5-17m9 29 16-6"/>
            <path d="m92 205 38-26 228 1 44 40-44 50-229-3Z" fill="#245747"/>
            <ellipse cx="244" cy="234" rx="159" ry="53" fill="#f8edce"/>
            <ellipse cx="244" cy="224" rx="160" ry="49" fill="#8aab75"/>
            <path d="M165 221 239 80Q242 73 247 81L324 221Q250 253 165 221Z" fill="#edbe56"/>
            <path d="m222 112 17-32q3-7 8 1l20 38-22-8-12 10Z" fill="#245747"/>
            <path d="m216 151 5-3m28 14 5 2m-40 20 4 2m55-2 5 3m-30 23 6-2m-43 13 5 2m35-81 3 2" stroke="#b87c35"/>
            <path d="M109 216q-10-18 9-24 9-18 23-5 21-6 24 12 12 14-4 24Z" fill="#f4d782"/>
            <path d="m120 203 12 5 13-8m-24 17 22-3" stroke="#b87c35"/>
            <path d="M321 197q4-17 20-10 9-13 22-1 19-2 16 17l-13 14-39-4Z" fill="#cc7850"/>
            <path d="m337 201 12-3m7 7 8-7"/>
            <path d="M141 244q-15-10-7-21 8-9 18 1 9-10 18-1 10 10-6 24M285 240q-12-15 0-22 10-6 17 6 6-12 17-6 12 9-1 24" fill="#245747"/>
            <ellipse cx="190" cy="244" rx="20" ry="10" fill="#fff9e9" transform="rotate(12 190 244)"/>
            <ellipse cx="190" cy="244" rx="8" ry="5" fill="#edbe56"/>
            <path d="M222 244q10-12 21 0 11-12 22 0m-42 8q11-12 22 0 11-12 21 0" stroke="#b87c35"/>
            <circle cx="344" cy="234" r="14" fill="#dc8163"/><path d="m337 230 13 8m-12 0 11-9" stroke="#fff3dc"/>
            <path d="M106 138q-21-7-29 12m0 0 2-13m-2 13 14-1M375 288q22 0 27-18"/>
            <path d="m57 238 5 11 12 2-9 8 1 12-10-6-11 5 2-12-8-9 12-1ZM412 145l4 9 10 2-7 7 1 10-9-5-9 4 2-10-7-7 10-1Z" fill="#edbe56"/>
          </g>
        </svg>
        <span class="doodle-sticker">Rasa rumahan.<br><strong>Bahagianya kebagian!</strong></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalog-banner { position: relative; display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; overflow: hidden; padding: 40px 44px; border: 1px solid #e7d5b5; border-radius: 32px; background: #f7edda; color: #690b22; }
.catalog-banner::after { content: ''; position: absolute; inset: auto 0 0; height: 8px; background: repeating-linear-gradient(90deg, #690b22 0 24px, #f7edda 24px 48px); opacity: .8; }
.banner-copy { position: relative; z-index: 1; }
.eyebrow { display: flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 700; letter-spacing: .14em; }
.eyebrow > span { font-size: 24px; color: #af573b; }
.banner-copy h3 { margin: 14px 0; font-size: clamp(32px, 3.6vw, 48px); line-height: 1.12; }
.banner-copy em { position: relative; font-style: normal; color: #ac5037; white-space: nowrap; }
.banner-copy em::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 7px; border-top: 2px solid #ac5037; border-radius: 50%; transform: rotate(-3deg); }
.banner-copy p { max-width: 380px; font-size: 13px; line-height: 1.85; color: #6b6153; }
.banner-cta { display: inline-flex; align-items: center; gap: 27px; min-height: 46px; padding: 11px 22px; margin-top: 23px; border-radius: 30px; background: #690b22; color: #fff9ed; font-size: 12px; font-weight: 700; }
.banner-cta:hover { background: #8a2139; }
.banner-cta:focus-visible { outline: 3px solid #ac5037; outline-offset: 4px; }
.banner-cta span { font-size: 21px; line-height: 1; color: #edce88; }
.signoff { display: block; margin-top: 12px; font-size: 10px; color: #776750; }
.banner-art { position: relative; min-width: 0; }
.banner-art svg { width: 100%; height: auto; }
.doodle-note { position: absolute; top: 0; right: 12%; font-size: 16px; font-weight: 600; line-height: 1.4; transform: rotate(8deg); color: #245747; }
.doodle-sticker { position: absolute; right: 4%; bottom: 0; padding: 10px 17px; background: #fffaf0; border: 1px solid #d1b984; border-radius: 8px; font-size: 10px; line-height: 1.7; text-align: center; transform: rotate(-7deg); box-shadow: 3px 4px 0 #e5d3af; }
@media (max-width: 1023px) { .catalog-banner { padding: 30px 28px; } .doodle-note { font-size: 13px; top: -10px; } .banner-copy p { font-size: 12px; } }
@media (max-width: 639px) { .catalog-banner { grid-template-columns: 1fr; padding: 26px 24px 32px; border-radius: 25px; gap: 20px; } .eyebrow { font-size: 8px; letter-spacing: .09em; gap: 6px; } .banner-copy h3 { font-size: 35px; } .banner-copy p { font-size: 12px; } .banner-cta { margin-top: 18px; } .banner-art { width: 100%; max-width: 350px; justify-self: center; } .doodle-note { top: 0; right: 6%; } .doodle-sticker { right: 0; bottom: -4px; font-size: 9px; padding: 8px 12px; } }
</style>
