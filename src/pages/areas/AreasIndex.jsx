import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { formatDate } from '../../utils/helpers';

export default function AreasIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('areas');

  const handleDelete = async (area) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el área "${area.name}"?`)) {
      return;
    }
    const ok = await remove(area.id);
    if (ok) setMessage(`Área "${area.name}" eliminada correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    {
      key: 'createdAt',
      label: 'Fecha de creación',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Áreas"
        subtitle="Administra las áreas de formación del SENA."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/areas/create')}
          >
            + Nueva área
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando áreas…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay áreas registradas. Crea una nueva área para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(area) => (
            <RowActions entity={area} basePath="areas" onDelete={handleDelete} />
          )}
        />
      )}
    </div>
  );
}