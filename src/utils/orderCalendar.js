export const localDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// API delivery dates are local business times (YYYY-MM-DD HH:mm).
export function deliveryParts(order) {
  const value = order.delivery?.date || ''
  const match = value.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/)
  return match ? { date: match[1], time: match[2] } : { date: value.slice(0, 10), time: '' }
}

export function calendarDays(anchor, orders = []) {
  const monday = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7)
  return Array.from({ length: 8 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + index)
    const key = localDateKey(date)
    return { date, key, orders: orders.filter(order => deliveryParts(order).date === key && ['pending', 'processing'].includes(order.status?.order))
      .sort((a, b) => (deliveryParts(a).time || '99:99').localeCompare(deliveryParts(b).time || '99:99') || String(a.created_at || '').localeCompare(String(b.created_at || '')) || String(a.id).localeCompare(String(b.id))) }
  })
}

export async function fetchScheduledOrders(getPage) {
  const groups = await Promise.all(['pending', 'processing'].map(async status => {
    const orders = []
    let page = 1, lastPage = 1
    do {
      const response = await getPage(page, 100, '', status)
      if (response.status !== 'success' || !Array.isArray(response.data)) throw new Error('Jadwal gagal dimuat')
      orders.push(...response.data)
      lastPage = Number(response.meta?.last_page || 1)
      page++
    } while (page <= lastPage)
    return orders
  }))
  return [...new Map(groups.flat().map(order => [order.id, order])).values()]
}
