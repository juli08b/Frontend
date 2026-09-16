import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';

export default function CoursesShow() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [areas, setAreas] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadCourse() {
      try {
        const [cRes, aRes, tRes] = await Promise.all([
          fetch(`${API_URL}/courses/${id}`),
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/trainingCenters`),
        ]);
        const cData = await cRes.json();
        const aData = await aRes.json();
        const tData = await tRes.json();
        if (active) {
          setCourse(cData);
          setAreas(aData);
          setCenters(tData);
        }
      } catch {
        if (active) setError('No se pudo cargar el curso.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCourse();
    return () => {
      active = false;
    };
  }, [id]);

  const areaName = (areaId) => areas.find((a) => a.id === areaId)?.name || '—';
  const centerName = (centerId) =>
    centers.find((c) => c.id === centerId)?.name || '—';

  return (
    <div className="page-container">
      <Link to="/courses" className="back-link">
        ← Volver a cursos
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando curso…</div>
      ) : !course ? (
        <div className="empty-state">El curso solicitado no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Curso Registrado</h1>
          <p className="page-subtitle">Detalle de la información del curso.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={course.id} />
            <DetailRow label="Número de curso" value={course.courseNumber} />
            <DetailRow label="Día" value={course.day} />
            <DetailRow label="Área" value={areaName(course.areaId)} />
            <DetailRow
              label="Centro de formación"
              value={centerName(course.trainingCenterId)}
            />
            <DetailRow label="Creado" value={formatDate(course.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/courses/create?id=${course.id}`}
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
