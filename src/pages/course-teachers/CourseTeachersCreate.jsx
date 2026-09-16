import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function CourseTeachersCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [courseId, setCourseId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [cRes, tRes] = await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/teachers`),
        ]);
        const cData = await cRes.json();
        const tData = await tRes.json();
        if (!active) return;
        setCourses(cData);
        setTeachers(tData);
        if (isEditing) {
          const ctRes = await fetch(`${API_URL}/courseTeachers/${editingId}`);
          if (ctRes.ok) {
            const data = await ctRes.json();
            setCourseId(data.courseId != null ? String(data.courseId) : '');
            setTeacherId(
              data.teacherId != null ? String(data.teacherId) : ''
            );
          }
        }
      } catch {
        if (active) setError('No se pudieron cargar los datos.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!courseId) next.courseId = 'Selecciona un curso.';
    if (!teacherId) next.teacherId = 'Selecciona un instructor.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/courseTeachers/${editingId}`
        : `${API_URL}/courseTeachers`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        courseId: Number(courseId),
        teacherId: Number(teacherId),
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/course-teachers');
    } catch {
      setError('No se pudo guardar la asignación.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar asignación' : 'Nueva asignación'}
        </h1>
        <p className="page-subtitle">
          Asocia un instructor a un curso de formación.
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="courseId">
                Curso
              </label>
              <select
                id="courseId"
                className="form-select"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Selecciona un curso…</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseNumber} - {course.day || 'Sin horario'}
                  </option>
                ))}
              </select>
              {fieldErrors.courseId && (
                <span className="form-error">{fieldErrors.courseId}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="teacherId">
                Instructor
              </label>
              <select
                id="teacherId"
                className="form-select"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Selecciona un instructor…</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {fieldErrors.teacherId && (
                <span className="form-error">{fieldErrors.teacherId}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/course-teachers')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear asignación'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
