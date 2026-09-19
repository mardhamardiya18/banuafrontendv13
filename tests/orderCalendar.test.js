import test from 'node:test'
import assert from 'node:assert/strict'
import { calendarDays, deliveryParts, fetchScheduledOrders } from '../src/utils/orderCalendar.js'

test('calendar spans Monday to next Monday across year boundaries and Sunday', () => {
  const days = calendarDays(new Date(2027, 0, 3))
  assert.equal(days.length, 8)
  assert.equal(days[0].key, '2026-12-28')
  assert.equal(days[7].key, '2027-01-04')
})

test('agenda sorts delivery times, includes pickup and excludes cancelled orders', () => {
  const order = (id, time, status = 'pending') => ({ id, delivery: { date: `2026-09-19 ${time}`, type: 'pickup' }, status: { order: status } })
  const items = [order(1, '17:00'), order(2, '08:30'), order(3, '12:00', 'processing'), order(4, '10:00'), order(5, '09:00', 'cancelled')]
  const day = calendarDays(new Date(2026, 8, 19), items)[5]
  assert.deepEqual(day.orders.map(o => o.id), [2, 4, 3, 1])
  assert.equal(day.orders.slice(0, 3).length, 3)
  assert.equal(deliveryParts({ delivery: { date: '2026-09-19T08:30:00' } }).time, '08:30')
  assert.equal(deliveryParts({}).time, '')
})

test('fetches every page for both scheduled statuses', async () => {
  const calls = []
  const orders = await fetchScheduledOrders(async (page, limit, search, status) => {
    calls.push(`${status}/${page}`)
    return { status: 'success', data: [{ id: `${status}-${page}` }], meta: { last_page: 2 } }
  })
  assert.equal(orders.length, 4)
  assert.deepEqual(calls.sort(), ['pending/1', 'pending/2', 'processing/1', 'processing/2'])
  await assert.rejects(() => fetchScheduledOrders(async () => ({ status: 'error' })))
})
