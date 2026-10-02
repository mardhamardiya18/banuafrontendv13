import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import router from './router'

// Prerender static public content and catalog/product loading shells. Product data,
// store status and authenticated state are always fetched in the browser.
export async function render(url = '/') {
  const app = createSSRApp(App)
  app.use(createPinia())
  app.use(router)
  await router.push(url)
  await router.isReady()
  return renderToString(app)
}
