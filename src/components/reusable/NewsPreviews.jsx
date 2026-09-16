import { Link } from 'react-router-dom';
import { formatDate, excerpt } from '../../utils/helpers';

export default function NewsPreviews({ items }) {
  return (
    <section className="home-section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Comunicación</span>
          <h2 className="section-title">Novedades</h2>
          <p className="section-subtitle">
            Las publicaciones más recientes de la institución.
          </p>
        </div>
        <Link to="/news" className="btn btn-secondary">
          Ver todas
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">Aún no hay novedades publicadas.</div>
      ) : (
        <div className="news-preview-grid">
          {items.map((item) => (
            <article key={item.id} className="card news-preview-card">
              <div className="news-preview-media">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="news-preview-image"
                    onError={(e) => {
                      e.currentTarget.src = '/images/sena1.jpg';
                    }}
                  />
                ) : (
                  <img
                    src="/images/sena1.jpg"
                    alt={item.title}
                    className="news-preview-image"
                  />
                )}
                {(item.videoUrl || item.videoPath) && (
                  <span className="news-preview-video-badge">Video</span>
                )}
              </div>
              <div className="news-preview-body">
                <span className="news-preview-date">
                  {formatDate(item.createdAt)}
                </span>
                <h3 className="news-preview-title">{item.title}</h3>
                <p className="news-preview-excerpt">{excerpt(item.content)}</p>
                <Link
                  to={`/news/${item.id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Leer más
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}