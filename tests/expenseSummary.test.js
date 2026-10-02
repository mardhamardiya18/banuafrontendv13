import test from 'node:test'
import assert from 'node:assert/strict'
import { expenseDateRange } from '../src/utils/expenseSummary.js'

test('monthly periods include the final day, including leap years', () => {
  assert.deepEqual(expenseDateRange('month', '2026-10'), { start: '2026-10-01', end: '2026-10-31' })
  assert.deepEqual(expenseDateRange('month', '2026-02'), { start: '2026-02-01', end: '2026-02-28' })
  assert.deepEqual(expenseDateRange('month', '2028-02'), { start: '2028-02-01', end: '2028-02-29' })
  assert.deepEqual(expenseDateRange('month', '2026-12'), { start: '2026-12-01', end: '2026-12-31' })
})
test('year and all-time periods', () => {
  assert.deepEqual(expenseDateRange('year', '', 2025), { start: '2025-01-01', end: '2025-12-31' })
  assert.deepEqual(expenseDateRange('all'), { start: '', end: '' })
})
test('incomplete and invalid periods do not request all-time data', () => {
  for (const month of ['', '2026-00', '2026-13', 'abc']) assert.equal(expenseDateRange('month', month), null)
  for (const year of ['', 0, 26, 2026.5, 10000]) assert.equal(expenseDateRange('year', '', year), null)
})
