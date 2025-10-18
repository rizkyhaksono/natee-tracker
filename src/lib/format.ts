const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export function formatCurrency(value: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return idrFormatter.format(0);
  return idrFormatter.format(value);
}