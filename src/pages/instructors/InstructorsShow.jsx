import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function InstructorsShow() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [areas, setAreas] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadTeacher() {
      try {
        const [tRes, aRes, cRes] = await Promise.all([
          fetch(`${API_URL}/teachers/${id}`),
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/trainingCenters`),
        ]);
        const tData = await tRes.json();
        const aData = await aRes.json();
        const cData = await cRes.json();
        if (active) {
          setTeacher(tData);
          setAreas(aData);
          setCenters(cData);
        }
      } catch {
        if (active) setError('No se pudo cargar el instructor.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadTeacher();
    return () => {
      active = false;
    };
  }, [id]);

  const areaName = (areaId) => areas.find((a) => a.id === areaId)?.name || '—';
  const centerName = (centerId) =>
    centers.find((c) => c.id === centerId)?.name || '—';

  return (
    <div className="page-container">
      <Link to="/instructors" className="back-link">
        ← Volver a instructores
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando instructor…</div>
      ) : !teacher ? (
        <div className="empty-state">El instructor solicitado no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Instructor Registrado</h1>
          <p className="page-subtitle">Detalle de la información del instructor.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={teacher.id} />
            <DetailRow label="Nombre" value={teacher.name} />
            <DetailRow label="Sede / Ubicación" value={teacher.location} />
            <DetailRow label="Área" value={areaName(teacher.areaId)} />
            <DetailRow
              label="Centro de formación"
              value={centerName(teacher.trainingCenterId)}
            />
            <DetailRow label="Creado" value={formatDate(teacher.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/instructors/create?id=${teacher.id}`}
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
