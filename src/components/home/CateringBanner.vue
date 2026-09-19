<template>
  <section class="py-10" aria-labelledby="catering-cta-title">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="catering-banner">
        <div class="banner-copy">
          <span class="occasion-label"><span aria-hidden="true">✦</span> ACARA SPESIAL, SAJIAN SPESIAL</span>
          <h2 id="catering-cta-title">Anda siapkan acaranya.<br />Kami siapkan <em>enaknya!</em></h2>
          <p>Dari syukuran kecil sampai perayaan besar, yuk cari sajian yang pas. Konsultasikan kebutuhan catering Anda, gratis!</p>
          <div class="banner-action">
            <a href="https://wa.me/6285156253408?text=Halo%20Min!%20Ada%20rencana%20bikin%20acara%20nih,%20bisa%20bantu%20rekomendasiin%20paket%20yang%20pas%20ngga%3F" target="_blank" rel="noopener noreferrer" class="consult-button" aria-label="Konsultasi gratis via WhatsApp">
              <i class="bx bxl-whatsapp" aria-hidden="true"></i>Konsultasi Gratis<span class="button-arrow" aria-hidden="true">↗</span>
            </a>
            <span class="action-note">Cerita dulu, pesan kemudian.</span>
          </div>
        </div>

        <div class="banner-art" aria-hidden="true">
          <div class="art-halo"></div>
          <span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✦</span>
          <span class="art-confetti confetti-one"></span><span class="art-confetti confetti-two"></span>
          <span class="art-caption">Bikin momen makin berkesan!</span>
          <svg class="tumpeng-art" viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- A festive platter, drawn as a lightweight vector ornament. -->
            <ellipse cx="210" cy="270" rx="155" ry="27" fill="#102F29" opacity=".22" />
            <ellipse cx="210" cy="245" rx="171" ry="53" fill="#D6B08A" />
            <ellipse cx="210" cy="235" rx="171" ry="53" fill="#F5DFC0" />
            <ellipse cx="210" cy="232" rx="152" ry="42" fill="#49784C" />
            <path d="M66 230C107 198 138 217 177 218C217 194 263 203 348 232C314 260 252 266 198 259C133 270 97 252 66 230Z" fill="#78A563" />
            <path d="M89 237L330 232M129 215L155 236L125 251M194 211L212 234L191 258M267 215L284 232L269 250" stroke="#B6C891" stroke-width="2" stroke-linecap="round" opacity=".65" />
            <!-- Golden rice cone -->
            <path d="M203 66C206 59 213 59 216 66L278 222C280 241 143 243 144 223L203 66Z" fill="#F3BA45" />
            <path d="M211 65L278 222C277 233 235 239 211 236V65Z" fill="#E9A634" />
            <ellipse cx="210" cy="222" rx="66" ry="14" fill="#F5C75F" />
            <path d="M186 126L190 118M201 144L204 137M177 164L180 157M196 186L199 180M162 208L165 201M220 109L223 116M233 143L236 150M225 173L228 180M248 197L251 204M216 214L220 215M186 218L190 217" stroke="#FFDD83" stroke-width="3" stroke-linecap="round" />
            <path d="M204 62L210 44L217 64" fill="#93B777" />
            <!-- Side dishes -->
            <path d="M103 211C85 193 111 177 125 190C140 178 156 196 145 212C131 227 115 224 103 211Z" fill="#AD603A" />
            <path d="M108 194L130 211M122 190L144 203" stroke="#D89350" stroke-width="5" stroke-linecap="round" />
            <path d="M278 211C270 191 292 182 305 193C318 180 340 199 326 216C312 227 291 224 278 211Z" fill="#AD603A" />
            <path d="M289 197L310 211M304 194L320 202" stroke="#D89350" stroke-width="5" stroke-linecap="round" />
            <ellipse cx="145" cy="247" rx="24" ry="15" transform="rotate(12 145 247)" fill="#FFF8DD" /><ellipse cx="145" cy="247" rx="12" ry="9" fill="#EDAA3B" />
            <ellipse cx="279" cy="246" rx="24" ry="15" transform="rotate(-15 279 246)" fill="#FFF8DD" /><ellipse cx="279" cy="246" rx="12" ry="9" fill="#EDAA3B" />
            <circle cx="92" cy="232" r="15" fill="#D0DC9C" /><circle cx="92" cy="232" r="10" stroke="#769A54" stroke-width="2" /><path d="M88 231L96 234M94 227L91 237" stroke="#769A54" stroke-width="2" />
            <circle cx="333" cy="233" r="15" fill="#D0DC9C" /><circle cx="333" cy="233" r="10" stroke="#769A54" stroke-width="2" /><path d="M329 232L337 235M335 228L332 238" stroke="#769A54" stroke-width="2" />
            <path d="M188 254C174 246 186 234 196 240C197 226 213 227 217 238C229 230 241 242 230 251C219 267 200 270 188 254Z" fill="#DF775B" /><circle cx="209" cy="249" r="8" fill="#F5AD7F" />
            <path d="M185 266C174 271 165 267 165 260C175 256 184 258 185 266ZM230 264C240 254 249 257 252 264C243 272 235 272 230 264Z" fill="#A6BD77" />
          </svg>
          <div class="art-sticker"><span>DIBUAT DENGAN</span><strong>sepenuh<br />hati <span>♡</span></strong></div>
        </div>
        <span class="banner-bottom-dots" aria-hidden="true"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catering-banner { position: relative; isolation: isolate; display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; overflow: hidden; border-radius: 32px; background: #1d4d40; color: #fff7e9; padding: 45px 52px; gap: 24px; }
.banner-copy { position: relative; z-index: 2; }
.occasion-label { display: inline-flex; align-items: center; gap: 8px; color: #dfc9a8; font-size: 9px; font-weight: 700; letter-spacing: .16em; }.occasion-label > span { color: #e9ae7e; font-size: 17px; }
.banner-copy h2 { font-size: clamp(28px, 3vw, 40px); font-weight: 750; letter-spacing: -.045em; line-height: 1.22; margin: 16px 0; }.banner-copy em { position: relative; font-family: var(--font-sans); font-weight: 400; color: #f2bc91; white-space: nowrap; }.banner-copy em::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 7px; border-top: 2px solid #e7ac80; border-radius: 50%; transform: rotate(-3deg); }
.banner-copy > p { max-width: 390px; font-size: 13px; line-height: 1.8; color: #d0dfd6; }
.banner-action { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; margin-top: 25px; }.consult-button { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 9px 10px 9px 18px; min-height: 48px; color: #38271f; background: #f4be96; border-radius: 100px; font-size: 12px; font-weight: 750; transition: background .2s; }.consult-button:hover { background: #ffe1bd; }.consult-button:focus-visible { outline: 2px solid #fff7e9; outline-offset: 5px; }.consult-button > i { font-size: 21px; }.button-arrow { display: grid; place-items: center; width: 31px; height: 31px; background: #1d4d4010; border-radius: 50%; font-size: 20px; margin-left: 7px; }.action-note { color: #c4d5c8; font-size: 10px; }
.banner-art { position: relative; min-width: 0; width: 100%; max-width: 440px; aspect-ratio: 1.3; justify-self: center; }.art-halo { position: absolute; width: 75%; aspect-ratio: 1; left: 13%; top: 6%; background: #2a5a49; border-radius: 50%; border: 1px solid #b8ce9c1a; }.art-halo::after { content: ''; position: absolute; inset: -15px; border: 1px dashed #d4d7a025; border-radius: 50%; }.tumpeng-art { position: absolute; width: 100%; height: 100%; inset: 3% 0 0; transform: rotate(-5deg); filter: drop-shadow(0 14px 10px #102f2920); }.art-caption { position: absolute; z-index: 1; top: 2%; left: 7%; transform: rotate(-9deg); font-family: var(--font-sans); font-style: italic; font-size: 15px; color: #e8d7b6; }.art-sticker { position: absolute; right: -2%; bottom: 3%; width: 108px; height: 108px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: #edb396; border: 5px solid #1d4d40; outline: 1px solid #edb396; border-radius: 50%; color: #663125; transform: rotate(12deg); }.art-sticker > span { font-size: 7px; letter-spacing: .08em; font-weight: 700; }.art-sticker strong { font-family: var(--font-sans); font-style: italic; font-size: 22px; line-height: 1; margin-top: 6px; font-weight: 400; }.art-sticker strong span { font-size: 17px; }.art-spark { position: absolute; color: #f0bc7e; }.spark-one { top: 16%; right: 1%; font-size: 44px; transform: rotate(12deg); }.spark-two { left: 0; bottom: 14%; font-size: 33px; }.art-confetti { position: absolute; width: 8px; height: 23px; border-radius: 4px; background: #d58165; }.confetti-one { top: 35%; left: 4%; transform: rotate(-30deg); }.confetti-two { bottom: 34%; right: -2%; transform: rotate(35deg); height: 14px; background: #a9ba87; }.banner-bottom-dots { position: absolute; width: 150px; height: 90px; bottom: -28px; left: 46%; background-image: radial-gradient(#d4d7a029 2px, transparent 2px); background-size: 15px 15px; transform: rotate(-12deg); z-index: -1; }
@media (max-width: 900px) { .catering-banner { padding: 35px 28px; gap: 12px; }.art-sticker { width: 88px; height: 88px; }.art-sticker strong { font-size: 19px; }.art-caption { font-size: 12px; } }
@media (max-width: 639px) { .catering-banner { grid-template-columns: 1fr; padding: 28px 24px 14px; gap: 16px; border-radius: 26px; }.banner-copy h2 { font-size: clamp(26px, 6.5vw, 36px); }.banner-copy > p { font-size: 12px; }.occasion-label { font-size: 8px; letter-spacing: .1em; }.banner-action { gap: 10px; margin-top: 20px; }.banner-art { max-width: 300px; }.art-caption { top: 3%; }.art-sticker { right: 0; bottom: 6%; }.banner-bottom-dots { left: -40px; bottom: 15px; }.action-note { font-size: 9px; } }
</style>
