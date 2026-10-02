import { mkdir } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { chromium } from 'playwright'
import { serveBuild, productionOrigin, localOriginArgs } from './lib/preview-server.mjs'

// Serve the production bundle with compression, as the production host should.
const label = process.argv[2] || 'current'
const target = process.argv[3] || '/'
const desktop = process.argv.includes('--desktop')
const sameOrigin = process.argv.includes('--production-origin')
const server = await serveBuild({ directory: process.env.AUDIT_DIST || 'dist', https: sameOrigin })
let browser
try {
  browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || 'msedge', headless: true, args: ['--remote-debugging-port=9222', ...(sameOrigin ? localOriginArgs : [])] })
  const origin = sameOrigin ? productionOrigin : 'http://127.0.0.1:4173'
  const url = target.startsWith('http') ? target : `${origin}${target}`
  const result = await lighthouse(url, { port: 9222, output: ['json', 'html'], onlyCategories: ['performance'] }, desktop ? desktopConfig : undefined)
  await mkdir('.performance', { recursive: true })
  const { writeFile } = await import('node:fs/promises')
  await writeFile(`.performance/${label}.json`, result.report[0])
  await writeFile(`.performance/${label}.html`, result.report[1])
  const { lhr } = result
  const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift'].map(id => [id, lhr.audits[id].numericValue]))
  console.log(JSON.stringify({ label, url, localBuild: !target.startsWith('http'), lighthouse: lhr.lighthouseVersion, score: lhr.categories.performance.score * 100, metrics, warnings: lhr.runWarnings, opportunities: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1 && a.details).map(a => ({ id: a.id, display: a.displayValue, savings: a.metricSavings })) }, null, 2))
  const page = await browser.newPage({ viewport: desktop ? { width: 1440, height: 1000 } : { width: 412, height: 823 }, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `.performance/${label}.png`, fullPage: true, animations: 'disabled' })
  console.log('Page:', await page.title())
} finally {
  await browser?.close()
  server.close()
}
