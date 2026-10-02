import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { serveBuild, productionOrigin, localOriginArgs } from './lib/preview-server.mjs'

const baseline = process.argv.includes('--baseline')
const server = await serveBuild({ directory: baseline ? '.performance/baseline-dist' : 'dist', https: true })
const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || 'msedge', headless: true, args: localOriginArgs })
const errors = []
const geometry = {}
try {
  await mkdir('.performance', { recursive: true })
  for (const [device, viewport] of [['desktop', { width: 1440, height: 1000 }], ['mobile', { width: 412, height: 823 }]]) {
    const page = await browser.newPage({ viewport })
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', msg => { if (/hydration/i.test(msg.text())) errors.push(msg.text()) })
    await page.goto(productionOrigin, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => document.querySelector('#app').__vue_app__)
    await page.evaluate(() => document.fonts.ready)
    // Warm up lazy images before comparing final desktop appearance.
    if (device === 'desktop') {
      for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded()
      await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))))
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    }
    await page.screenshot({ path: `.performance/${baseline ? 'baseline' : 'final'}-${device}-visual.png`, fullPage: device === 'desktop', animations: 'disabled' })
    geometry[device] = await page.evaluate(() => Object.fromEntries(['.hero-title', '.hero-photo', '.hero-copy', '#products', '#testimonials', 'footer'].map(selector => {
      const rect = document.querySelector(selector)?.getBoundingClientRect()
      return [selector, rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null]
    })))
    const heroSource = await page.locator('.hero-photo img').evaluate(img => img.currentSrc)
    if (!baseline) assert.equal(heroSource.endsWith('/hero-img-mobile.webp'), device === 'mobile')
    if (device === 'mobile') {
      await page.getByRole('button', { name: 'Buka menu navigasi' }).click()
      await page.getByRole('link', { name: 'Katalog', exact: true }).first().click()
    } else await page.goto(`${productionOrigin}/katalog`, { waitUntil: 'networkidle' })
    await page.locator('[aria-labelledby="recommended-title"] .reco-card').first().waitFor()
    assert.match(await page.title(), /Daftar Menu/)
    const search = page.getByRole('searchbox', { name: 'Cari menu' })
    await search.fill('zzz-menu-tidak-ada-zzz')
    await page.getByText('Belum ada menu yang cocok', { exact: true }).waitFor()
    await search.fill('')
    await page.getByRole('button', { name: 'Semua Menu', exact: true }).click()
    const productLink = page.locator('a[href^="/produk/"]').first()
    const detailPath = await productLink.getAttribute('href')
    const catalogPhoto = await productLink.locator('img').evaluate(img => img.currentSrc)
    if (!baseline && device === 'mobile') assert.match(catalogPhoto, /\/catalog-media\//)
    await page.screenshot({ path: `.performance/${baseline ? 'baseline' : 'final'}-${device}-catalog.png`, animations: 'disabled' })
    await productLink.click()
    await page.locator('.gallery-image img').first().waitFor()
    await page.waitForFunction(() => !document.querySelector('.detail-loading'))
    assert.equal(new URL(page.url()).pathname, detailPath)
    assert.ok((await page.locator('#product-title').textContent()).length > 3)
    const image = page.locator('.gallery-image img').first()
    await image.evaluate(img => img.decode())
    if (!baseline && device === 'mobile') assert.match(await image.evaluate(img => img.currentSrc), /\/catalog-media\//)
    assert.match(await page.locator('.order-button').getAttribute('href'), /^https:\/\/wa\.me\//)
    if (await page.getByRole('button', { name: 'Foto berikutnya' }).count()) {
      await page.getByRole('button', { name: 'Foto berikutnya' }).click()
      await page.waitForFunction(() => document.querySelector('.gallery-paging > span')?.textContent.trim().startsWith('2'))
      await page.getByRole('button', { name: 'Foto sebelumnya' }).click()
      await page.waitForFunction(() => document.querySelector('.gallery-paging > span')?.textContent.trim().startsWith('1'))
      if (!baseline) {
        await page.locator('.detail-gallery').focus()
        await page.keyboard.press('ArrowRight')
        await page.waitForFunction(() => document.querySelector('.gallery-paging > span')?.textContent.trim().startsWith('2'))
        await page.keyboard.press('ArrowLeft')
        await page.waitForFunction(() => document.querySelector('.gallery-paging > span')?.textContent.trim().startsWith('1'))
      }
    }
    await page.screenshot({ path: `.performance/${baseline ? 'baseline' : 'final'}-${device}-product.png`, animations: 'disabled' })
    await page.goto(`${productionOrigin}/admin/dashboard`, { waitUntil: 'networkidle' })
    assert.equal(new URL(page.url()).pathname, '/login')
    await page.close()
  }
  if (!baseline) {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 412, height: 823 } })
    for (const [path, text] of [['/', 'Pesan Tumpeng'], ['/katalog', 'Temukan Menu Favoritmu']]) {
      await page.goto(productionOrigin + path)
      assert.ok((await page.locator('#app').textContent()).includes(text))
    }
    await page.goto(`${productionOrigin}/produk/snackbox-2kueair`)
    assert.equal(await page.locator('#app').getAttribute('data-prerendered'), '/produk/snackbox-2kueair')
    assert.equal(await page.locator('.product-price strong').textContent(), '—')
    assert.equal(await page.locator('.order-button').getAttribute('href'), null)
    assert.equal(await page.locator('.gallery-image img').count(), 1)
    await page.close()
    const closed = await browser.newPage()
    closed.on('pageerror', error => errors.push(error.message))
    closed.on('console', msg => { if (/hydration/i.test(msg.text())) errors.push(msg.text()) })
    await closed.route('**/api/catalog/store-status', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true, data: { is_store_closed: true } }) }))
    await closed.goto(productionOrigin)
    await closed.getByText('Toko Sedang Tutup', { exact: true }).waitFor()
    await closed.goto(`${productionOrigin}/login`)
    assert.equal(await closed.getByText('Toko Sedang Tutup', { exact: true }).count(), 0)
    await closed.close()
  }
  assert.deepEqual(errors, [])
  await writeFile(`.performance/${baseline ? 'baseline' : 'final'}-geometry.json`, JSON.stringify(geometry, null, 2))
  console.log(`PASS (${baseline ? 'baseline' : 'optimized'}): public navigation, real catalog API, search, responsive images, gallery and anonymous admin redirect. No browser/hydration errors.`)
  if (!baseline) console.log('PASS: content without JavaScript and closed-store overlay.')
} finally {
  await browser.close()
  server.close()
}
