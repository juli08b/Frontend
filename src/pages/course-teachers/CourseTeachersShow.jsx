import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DetailRow from '../../components/DetailRow';
import { API_URL, formatDate } from '../../utils/helpers';




export default function CourseTeachersShow() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadAssignment() {
      try {
        const [cRes, cuRes, tRes] = await Promise.all([
          fetch(`${API_URL}/courseTeachers/${id}`),
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/teachers`),
        ]);
        const cData = await cRes.json();
        const cuData = await cuRes.json();
        const tData = await tRes.json();
        if (active) {
          setAssignment(cData);
          setCourses(cuData);
          setTeachers(tData);
        }
      } catch {
        if (active) setError('No se pudo cargar la asignación.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadAssignment();
    return () => {
      active = false;
    };
  }, [id]);

  const courseName = (courseId) =>
    courses.find((c) => c.id === courseId)?.courseNumber || '—';
  const teacherName = (teacherId) =>
    teachers.find((t) => t.id === teacherId)?.name || '—';

  return (
    <div className="page-container">
      <Link to="/course-teachers" className="back-link">
        ← Volver a asignaciones
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando asignación…</div>
      ) : !assignment ? (
        <div className="empty-state">La asignación solicitada no existe.</div>
      ) : (
        <div className="card detail-card">
          <h1 className="page-title">Curso - Profesor Registrado</h1>
          <p className="page-subtitle">Detalle de la asignación curso-instructor.</p>
          <div className="detail-rows">
            <DetailRow label="ID" value={assignment.id} />
            <DetailRow label="Curso" value={courseName(assignment.courseId)} />
            <DetailRow label="Profesor" value={teacherName(assignment.teacherId)} />
            <DetailRow label="Creado" value={formatDate(assignment.createdAt)} />
          </div>
          <div className="detail-actions">
            <Link
              to={`/course-teachers/create?id=${assignment.id}`}
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