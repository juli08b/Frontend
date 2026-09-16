import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function AreasShow() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadArea() {
      try {
        const res = await fetch(`${API_URL}/areas/${id}`);
        if (!res.ok) throw new Error('No encontrada');
        const data = await res.json();
        if (active) setArea(data);
      } catch {
        if (active) setError('No se pudo cargar el área.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadArea();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/areas" className="back-link">
        ← Volver a áreas
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando área…</div>
      ) : !area ? (
        <div className="empty-state">El área solicitada no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Área Registrada</h1>
          <p className="page-subtitle">Detalle de la información del área.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={area.id} />
            <DetailRow label="Nombre" value={area.name} />
            <DetailRow label="Creado" value={formatDate(area.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link to={`/areas/create?id=${area.id}`} className="btn btn-secondary btn-sm">
              Editar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
