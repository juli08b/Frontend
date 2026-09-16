export const API_URL = 'http://localhost:3001';

export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function excerpt(text, max = 110) {
  if (!text) return '-';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}