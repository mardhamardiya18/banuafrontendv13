export function expenseDateRange(period, month, year) {
  if (period === 'all') return { start: '', end: '' }
  if (period === 'year') {
    if (!/^\d{4}$/.test(String(year)) || Number(year) < 1000) return null
    return { start: `${year}-01-01`, end: `${year}-12-31` }
  }
  if (period !== 'month' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || Number(month.slice(0, 4)) < 1000) return null
  const [y, m] = month.split('-').map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  return { start: `${month}-01`, end: `${month}-${lastDay}` }
}
