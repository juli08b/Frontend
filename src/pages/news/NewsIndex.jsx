import { useNavigate } from 'react-router-dom';
import Header from '../../components/reusable/Header';
import DataTable from '../../components/reusable/DataTable';
import RowActions from '../../components/reusable/RowActions';
import useCollection from '../../hooks/useCollection';
import { formatDate, excerpt } from '../../utils/helpers';

export default function NewsIndex() {
  const navigate = useNavigate();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('news');

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la noticia "${item.title}"?`)) {
      return;
    }
    const ok = await remove(item.id);
    if (ok) setMessage(`Noticia "${item.title}" eliminada correctamente.`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Título' },
    { key: 'content', label: 'Contenido', render: (row) => excerpt(row.content) },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="page-container">
      <Header
        title="Noticias"
        subtitle="Administra las noticias institucionales del SENA."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/news/create')}
          >
            + Nueva noticia
          </button>
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando noticias…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          No hay noticias registradas. Crea una nueva para comenzar.
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          actions={(item) => (
            <RowActions entity={item} basePath="news" onDelete={handleDelete} />
          )}
        />
      )}
    </div>
  );
}