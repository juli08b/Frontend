// esto sirve para definir la URL base de la API y funciones auxiliares para formatear fechas y generar extractos de texto.

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
