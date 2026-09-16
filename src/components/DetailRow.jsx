export default function DetailRow({ label, value }) {
  return (
    <p className="detail-row">
      <strong>{label}:</strong>
      <span>{value != null && value !== '' ? value : '—'}</span>
    </p>
  );
}
