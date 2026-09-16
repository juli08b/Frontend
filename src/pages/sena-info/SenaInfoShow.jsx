import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL, formatDate } from '../../utils/helpers';

export default function SenaInfoShow() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadInfo() {
      try {
        const res = await fetch(`${API_URL}/senaInfos/${id}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) setItem(data);
      } catch {
        if (active) setError('No se pudo cargar la información.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInfo();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/sena-info" className="back-link">
        ← Volver a información institucional
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando información…</div>
      ) : !item ? (
        <div className="empty-state">El contenido solicitado no existe.</div>
      ) : (
        <article className="card news-show">
          <span className="sena-badge">Información institucional</span>

          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="news-show-image"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          <h1 className="page-title">{item.title}</h1>

          <p className="news-show-meta">Publicado el {formatDate(item.createdAt)}</p>

          <hr className="news-divider" />

          <p className="news-show-content">{item.description}</p>

          <div className="detail-actions">
            {user && (
              <Link
                to={`/sena-info/create?id=${item.id}`}
                className="btn btn-secondary btn-sm"
              >
                Editar
              </Link>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
