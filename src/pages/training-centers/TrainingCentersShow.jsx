import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function TrainingCentersShow() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadCenter() {
      try {
        const res = await fetch(`${API_URL}/trainingCenters/${id}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) setCenter(data);
      } catch {
        if (active) setError('No se pudo cargar el centro de formación.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCenter();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/training-centers" className="back-link">
        ← Volver a centros de formación
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando centro de formación…</div>
      ) : !center ? (
        <div className="empty-state">El centro de formación solicitado no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Centro de Formación Registrado</h1>
          <p className="page-subtitle">Detalle de la información del centro.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={center.id} />
            <DetailRow label="Nombre" value={center.name} />
            <DetailRow label="Ubicación" value={center.location} />
            <DetailRow label="Creado" value={formatDate(center.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/training-centers/create?id=${center.id}`}
              className="btn btn-secondary btn-sm"
            >
              Editar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
