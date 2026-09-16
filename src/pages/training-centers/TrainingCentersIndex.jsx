import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { formatDate } from '../../utils/helpers';

export default function TrainingCentersIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('trainingCenters');

  const handleDelete = async (center) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el centro "${center.name}"?`
      )
    ) {
      return;
    }
    const ok = await remove(center.id);
    if (ok) setMessage(`Centro "${center.name}" eliminado correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'location', label: 'Ubicación' },
    {
      key: 'createdAt',
      label: 'Fecha de creación',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Centros de Formación"
        subtitle="Administra los centros de formación y su ubicación."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/training-centers/create')}
          >
            + Nuevo centro
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando centros…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay centros registrados. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(center) => (
            <RowActions
              entity={center}
              basePath="training-centers"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}
