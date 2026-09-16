import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { API_URL } from '../../utils/helpers';

export default function InstructorsIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('teachers');
  const [areas, setAreas] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [aRes, cRes] = await Promise.all([
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/trainingCenters`),
        ]);
        const [aData, cData] = await Promise.all([aRes.json(), cRes.json()]);
        if (active) {
          setAreas(aData);
          setCenters(cData);
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

  const handleDelete = async (teacher) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar al instructor "${teacher.name}"?`
      )
    ) {
      return;
    }
    const ok = await remove(teacher.id);
    if (ok) setMessage(`Instructor "${teacher.name}" eliminado correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'location', label: 'Sede' },
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
        title="Instructores"
        subtitle="Administra a los instructores del SENA."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/instructors/create')}
          >
            + Nuevo instructor
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando instructores…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay instructores registrados. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(teacher) => (
            <RowActions
              entity={teacher}
              basePath="instructors"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}
