import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { formatDate } from '../../utils/helpers';

export default function ComputersIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('computers');

  const handleDelete = async (computer) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el computador #${computer.number}?`
      )
    ) {
      return;
    }
    const ok = await remove(computer.id);
    if (ok)
      setMessage(`Computador #${computer.number} eliminado correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'number',
      label: 'Número',
      render: (row) => `#${row.number ?? '-'}`,
    },
    { key: 'brand', label: 'Marca' },
    {
      key: 'createdAt',
      label: 'Fecha de creación',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Computadores"
        subtitle="Administra el inventario de equipos de cómputo."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/computers/create')}
          >
            + Nuevo computador
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando computadores…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay computadores registrados. Crea uno nuevo para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(computer) => (
            <RowActions
              entity={computer}
              basePath="computers"
              onDelete={handleDelete}
            />
          )}
        />
      )}
    </div>
  );
}