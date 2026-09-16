import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function ComputersShow() {
  const { id } = useParams();
  const [computer, setComputer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadComputer() {
      try {
        const res = await fetch(`${API_URL}/computers/${id}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) setComputer(data);
      } catch {
        if (active) setError('No se pudo cargar el computador.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadComputer();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/computers" className="back-link">
        ← Volver a computadores
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando computador…</div>
      ) : !computer ? (
        <div className="empty-state">El computador solicitado no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Computador Registrado</h1>
          <p className="page-subtitle">Detalle de la información del computador.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={computer.id} />
            <DetailRow label="Número" value={computer.number} />
            <DetailRow label="Marca" value={computer.brand} />
            <DetailRow label="Creado" value={formatDate(computer.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/computers/create?id=${computer.id}`}
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
