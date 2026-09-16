import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { API_URL } from '../../utils/helpers';

export default function CoursesIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('courses');
  const [areas, setAreas] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [aRes, cenRes] = await Promise.all([
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/trainingCenters`),
        ]);
        const [aData, cenData] = await Promise.all([aRes.json(), cenRes.json()]);
        if (active) {
          setAreas(aData);
          setCenters(cenData);
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

  const areaName = (id) => areas.find((a) => a.id === id)?.name || '-';
  const centerName = (id) => centers.find((c) => c.id === id)?.name || '-';

  const handleDelete = async (course) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el curso "${course.courseNumber}"?`
      )
    ) {
      return;
    }
    const ok = await remove(course.id);
    if (ok) setMessage(`Curso "${course.courseNumber}" eliminado correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'courseNumber', label: 'Número de curso' },
    { key: 'day', label: 'Horario' },
    { key: 'areaId', label: 'Área', render: (row) => areaName(row.areaId) },
    {
      key: 'trainingCenterId',
      label: 'Centro',
      render: (row) => centerName(row.trainingCenterId),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Cursos"
        subtitle="Administra los cursos del SENA."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/courses/create')}
          >
            + Nuevo curso
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando cursos…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay cursos registrados. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(course) => (
            <RowActions
              entity={course}
              basePath="courses"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}
