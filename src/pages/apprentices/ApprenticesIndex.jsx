import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { API_URL } from '../../utils/helpers';

export default function ApprenticesIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('apprentices');
  const [courses, setCourses] = useState([]);
  const [computers, setComputers] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [cRes, coRes] = await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/computers`),
        ]);
        const [cData, coData] = await Promise.all([cRes.json(), coRes.json()]);
        if (active) {
          setCourses(cData);
          setComputers(coData);
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

  const courseNumber = (id) =>
    courses.find((c) => c.id === id)?.courseNumber || '-';

  const computerNumber = (id) => {
    const comp = computers.find((c) => c.id === id);
    return comp ? `#${comp.number}` : '-';
  };

  const handleDelete = async (apprentice) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar al aprendiz "${apprentice.name}"?`
      )
    ) {
      return;
    }
    const ok = await remove(apprentice.id);
    if (ok)
      setMessage(`Aprendiz "${apprentice.name}" eliminado correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'number', label: 'Teléfono' },
    { key: 'courseId', label: 'Curso', render: (row) => courseNumber(row.courseId) },
    {
      key: 'computerId',
      label: 'Computador',
      render: (row) => computerNumber(row.computerId),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Aprendices"
        subtitle="Administra la información de los aprendices."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/apprentices/create')}
          >
            + Nuevo aprendiz
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando aprendices…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay aprendices registrados. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(apprentice) => (
            <RowActions
              entity={apprentice}
              basePath="apprentices"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}
