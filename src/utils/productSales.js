// Keep product identity separate from its display name; IDs may arrive as numbers or strings.
export function summarizeProductSales(months = [], period = 'year') {
  const totals = new Map()
  const selectedMonths = period === 'year' ? months : months.filter(month => month.month === period)
  for (const month of selectedMonths) {
    for (const product of month.products ?? []) {
      const id = String(product.product_id)
      const quantity = Number(product.total_sold)
      if (!Number.isFinite(quantity) || quantity <= 0) continue
      const row = totals.get(id) ?? { id, name: product.name, total: 0 }
      row.total += quantity
      totals.set(id, row)
    }
  }
  const products = [...totals.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, 'id') || a.id.localeCompare(b.id))
  return {
    products,
    total: products.reduce((sum, product) => sum + product.total, 0),
    maximum: products[0]?.total ?? 0,
  }
}
