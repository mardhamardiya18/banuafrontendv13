import { createApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import Cookies from 'js-cookie'
import './style.css'
import App from './App.vue'
import router from './router'

const container = document.getElementById('app')
// Returning authenticated/closed-store sessions render their current state, while
// anonymous homepage visits reuse the HTML emitted at build time.
const hydrate = container.dataset.prerendered === (window.location.pathname.replace(/\/$/, '') || '/') &&
  !Cookies.get('token') && localStorage.getItem('isStoreClosed') !== 'true'
const app = (hydrate ? createSSRApp : createApp)(App)

app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  // Static HTML already provides working links and readable content. Give the
  // browser a paint opportunity before wiring the full page's Vue listeners.
  if (hydrate && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => app.mount(container), { timeout: 1000 })
  } else {
    app.mount(container)
  }
})
