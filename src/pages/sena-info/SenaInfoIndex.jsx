import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Header from '../../components/reusable/Header';
import useCollection from '../../hooks/useCollection';
import { formatDate } from '../../utils/helpers';

export default function SenaInfoIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, error, message, setMessage, remove } =
    useCollection('senaInfos');

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar este contenido "${item.title}"?`)) {
      return;
    }
    const ok = await remove(item.id);
    if (ok) setMessage(`El contenido "${item.title}" fue eliminado.`);
  };

  return (
    <div className="page-container">
      <Header
        title="El SENA que construimos juntos"
        subtitle="Conoce la misión, la visión y los principios que orientan nuestro trabajo por el talento humano de Colombia."
        actions={
          user && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/sena-info/create')}
            >
              + Agregar información
            </button>
          )
        }
      />

      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando información…</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-title">Aún no hay información institucional</h2>
          <p>Registra los contenidos que quieras compartir desde el panel.</p>
          {user && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/sena-info/create')}
            >
              Agregar información
            </button>
          )}
        </div>
      ) : (
        <div className="sena-grid">
          {items.map((item, index) => (
            <article key={item.id} className="card sena-card">
              <span className="sena-badge">SENA / {index + 1}</span>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="sena-card-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              <h2 className="sena-card-title">{item.title}</h2>
              <p className="sena-card-desc">{item.description}</p>
              <p className="sena-card-date">
                Publicado el {formatDate(item.createdAt)}
              </p>

              <div className="sena-card-actions">
                <Link
                  to={`/sena-info/${item.id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Ver
                </Link>
                {user && (
                  <>
                    <Link
                      to={`/sena-info/create?id=${item.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
