export function sanitizeText(value: unknown, maxLength = 500) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[^\d+]/g, '').slice(0, 20);
}

export function clampNumber(value: unknown, min: number, max: number) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}
