import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeProductSales } from '../src/utils/productSales.js'

test('all products stay separate beyond five, including matching names and mixed ID types', () => {
  const months = [
    { month: 'Jan', products: Array.from({ length: 8 }, (_, i) => ({ product_id: i + 1, name: 'Produk sama', total_sold: String(i + 1) })) },
    { month: 'Feb', products: [{ product_id: '1', name: 'Produk sama', total_sold: '10' }] },
  ]
  const result = summarizeProductSales(months)
  assert.equal(result.products.length, 8)
  assert.equal(result.total, 46)
  assert.equal(result.maximum, 11)
  assert.deepEqual(result.products[0], { id: '1', name: 'Produk sama', total: 11 })
  const february = summarizeProductSales(months, 'Feb')
  assert.equal(february.total, 10)
  assert.equal(february.products.length, 1)
  assert.equal(summarizeProductSales(months, 'Jan').total + february.total, result.total)
})

test('empty periods have zero totals and no chart bars', () => {
  assert.deepEqual(summarizeProductSales(), { products: [], total: 0, maximum: 0 })
  assert.deepEqual(summarizeProductSales([{ month: 'Jan', products: [] }], 'Jan'), { products: [], total: 0, maximum: 0 })
})
