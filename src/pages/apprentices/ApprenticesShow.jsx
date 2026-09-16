import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function ApprenticesShow() {
  const { id } = useParams();
  const [apprentice, setApprentice] = useState(null);
  const [courses, setCourses] = useState([]);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadApprentice() {
      try {
        const [aRes, cRes, pRes] = await Promise.all([
          fetch(`${API_URL}/apprentices/${id}`),
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/computers`),
        ]);
        const aData = await aRes.json();
        const cData = await cRes.json();
        const pData = await pRes.json();
        if (active) {
          setApprentice(aData);
          setCourses(cData);
          setComputers(pData);
        }
      } catch {
        if (active) setError('No se pudo cargar el aprendiz.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadApprentice();
    return () => {
      active = false;
    };
  }, [id]);

  const courseName = (courseId) =>
    courses.find((c) => c.id === courseId)?.courseNumber || '—';
  const computerNumber = (computerId) => {
    const comp = computers.find((c) => c.id === computerId);
    return comp ? `#${comp.number}` : '—';
  };

  return (
    <div className="page-container">
      <Link to="/apprentices" className="back-link">
        ← Volver a aprendices
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando aprendiz…</div>
      ) : !apprentice ? (
        <div className="empty-state">El aprendiz solicitado no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Aprendiz Registrado</h1>
          <p className="page-subtitle">Detalle de la información del aprendiz.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={apprentice.id} />
            <DetailRow label="Nombre" value={apprentice.name} />
            <DetailRow label="Correo" value={apprentice.email} />
            <DetailRow label="Teléfono" value={apprentice.number} />
            <DetailRow label="Curso" value={courseName(apprentice.courseId)} />
            <DetailRow
              label="Computador"
              value={computerNumber(apprentice.computerId)}
            />
            <DetailRow label="Creado" value={formatDate(apprentice.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/apprentices/create?id=${apprentice.id}`}
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
