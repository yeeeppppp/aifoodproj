export function formatPrice(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('ru-RU').format(num);
}

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}









