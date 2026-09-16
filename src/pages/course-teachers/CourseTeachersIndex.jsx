import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { API_URL } from '../../utils/helpers';

export default function CourseTeachersIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('courseTeachers');
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [cRes, tRes] = await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/teachers`),
        ]);
        const [cData, tData] = await Promise.all([cRes.json(), tRes.json()]);
        if (active) {
          setCourses(cData);
          setTeachers(tData);
        }
      } catch {
        // Los nombres referenciados se mostrarán como "-"
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, []);

  const courseName = (id) =>
    courses.find((c) => c.id === id)?.courseNumber || '-';
  const teacherName = (id) => teachers.find((t) => t.id === id)?.name || '-';

  const handleDelete = async (ct) => {
    if (
      !window.confirm(
        `¿Seguro que deseas quitar al instructor "${teacherName(
          ct.teacherId
        )}" del curso "${courseName(ct.courseId)}"?`
      )
    ) {
      return;
    }
    const ok = await remove(ct.id);
    if (ok) setMessage('Asignación eliminada correctamente.');
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'courseId', label: 'Curso', render: (row) => courseName(row.courseId) },
    { key: 'teacherId', label: 'Instructor', render: (row) => teacherName(row.teacherId) },
  ];

  return (
    <div className="page-container">
      <Header
        title="Asignación Curso - Instructor"
        subtitle="Asigna instructores a los cursos del SENA."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/course-teachers/create')}
          >
            + Nueva asignación
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando asignaciones…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay asignaciones registradas. Crea una nueva para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(ct) => (
            <RowActions
              entity={ct}
              basePath="course-teachers"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}
