import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { serveBuild } from './lib/preview-server.mjs'

const server = await serveBuild()
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []
const requests = []
let fail = false
const addonId = '11111111-1111-4111-8111-111111111111'
try {
  const context = await browser.newContext()
  await context.addCookies([{ name: 'token', value: 'local-test-only', url: 'http://127.0.0.1:4173' }])
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.pathname.endsWith('/addon-report')) {
      requests.push(Object.fromEntries(url.searchParams))
      if (fail) return route.fulfill({ status: 500, json: { message: 'Test failure' } })
      const empty = url.searchParams.get('year') === '2020'
      return route.fulfill({ json: { success: true, data: {
        summary: { total_amount: empty ? 0 : 80000, total_quantity: empty ? 0 : 2, total_orders: empty ? 0 : 2 },
        add_ons: [...Array.from({ length: 8 }, (_, i) => ({ id: `sample-${i}`, name: `Add-on ${i}`, product_name: 'Tumini Reguler' })), { id: addonId, name: 'Ongkir', product_name: null, price: 40000 }],
        breakdown: empty ? [] : [{ add_on_id: addonId, name: 'Ongkir', total_amount: 80000, total_quantity: 2, total_orders: 2 }],
        details: empty ? [] : [{ id: 'line-1', add_on_id: addonId, add_on_name: 'Ongkir', order_id: 'order-1', invoice_number: 'INV-2610-003', delivery_date: '2026-10-02 13:00:00', quantity: 1, snapshot_price: 40000, sub_total: 40000 }],
        meta: { current_page: Number(url.searchParams.get('page')), last_page: empty ? 1 : 2, total: empty ? 0 : 16 },
      } } })
    }
    if (url.pathname.endsWith('/user')) return route.fulfill({ json: { data: { name: 'Admin Test', role: 'admin', is_store_closed: false } } })
    if (url.hostname !== '127.0.0.1') return route.fulfill({ json: { success: true, data: { is_store_closed: false } } })
    return route.continue()
  })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('http://127.0.0.1:4173/admin/finance/addons')
  await page.getByRole('link', { name: 'INV-2610-003' }).waitFor()
  assert.equal(await page.getByRole('heading', { name: 'Rekap Add-ons', exact: true }).count(), 1)
  await page.getByRole('button', { name: 'Add-on Semua add-ons', exact: true }).click()
  assert.equal(await page.getByRole('option').count(), 6)
  await page.getByText('Gunakan fitur search', { exact: false }).waitFor()
  const search = page.getByRole('combobox', { name: 'Cari add-on atau produk' })
  await search.fill('TUMINI')
  assert.equal(await page.getByRole('option').count(), 6)
  await search.fill('tidak-ada')
  await page.getByText('Add-on tidak ditemukan. Coba kata kunci lain.').waitFor()
  await search.fill(' ONGKIR ')
  assert.equal(await page.getByRole('option').count(), 1)
  assert.match(await page.getByRole('option').innerText(), /Rp 40\.000/)
  await Promise.all([page.waitForResponse(res => res.url().includes(`add_on_id=${addonId}`)), search.press('Enter')])
  await page.getByRole('button', { name: 'Add-on Ongkir', exact: true }).click()
  await search.press('Escape')
  assert.equal(await page.getByRole('listbox').count(), 0)
  await page.getByRole('button', { name: 'Berikutnya' }).click()
  await page.waitForResponse(res => res.url().includes('page=2'))
  await page.getByRole('button', { name: 'Tahunan', exact: true }).click()
  await page.getByRole('spinbutton').fill('2020')
  await page.getByText('Belum ada add-on pada order completed untuk filter ini.').waitFor()
  assert.equal(requests.at(-1).page, '1')
  await page.getByRole('button', { name: 'Keseluruhan', exact: true }).click()
  await page.getByRole('link', { name: 'INV-2610-003' }).waitFor()
  assert.equal(requests.at(-1).period, 'all')
  assert.equal(requests.at(-1).year, undefined)
  await mkdir('.performance', { recursive: true })
  await page.screenshot({ path: '.performance/addon-report-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload()
  await page.getByRole('link', { name: 'INV-2610-003' }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: '.performance/addon-report-mobile.png', fullPage: true })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
  fail = true
  await page.getByRole('button', { name: 'Muat ulang' }).click()
  await page.getByRole('alert').waitFor()
  fail = false
  await page.getByRole('button', { name: 'Coba lagi' }).click()
  await page.getByRole('link', { name: 'INV-2610-003' }).waitFor()
  assert.deepEqual(errors, [])
  console.log('PASS: filters, pagination reset, empty/error/retry states, invoice link, mobile layout; all API responses mocked locally.')
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
