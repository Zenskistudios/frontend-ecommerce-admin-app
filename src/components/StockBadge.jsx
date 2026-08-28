export default function StockBadge({ quantity }) {
  let tone = 'bg-ok/10 text-ok'
  let label = `${quantity} in stock`

  if (quantity === 0) {
    tone = 'bg-out/10 text-out'
    label = 'Out of stock'
  } else if (quantity <= 5) {
    tone = 'bg-low/10 text-low'
    label = `${quantity} left`
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium ${tone}`}>
      {label}
    </span>
  )
}
