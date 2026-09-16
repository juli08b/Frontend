import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL, formatDate } from '../../utils/helpers';

function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}

function extractInstagram(url) {
  const match = url.match(/instagram\.com\/(reels?|p|tv)\/([\w-]+)/);
  return match ? { type: match[1], id: match[2] } : null;
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|ogv|mov)(\?.*)?$/i.test(url);
}

function VideoEmbed({ item }) {
  const { videoUrl, videoPath } = item;
  if (!videoUrl && !videoPath) return null;

  if (videoPath) {
    return (
      <div className="video-wrapper">
        <video src={`/videos/${videoPath}`} controls className="news-video" />
      </div>
    );
  }

  const youtubeId = extractYouTubeId(videoUrl);
  if (youtubeId) {
    return (
      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video de la noticia"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const instagram = extractInstagram(videoUrl);
  if (instagram) {
    return (
      <div className="video-wrapper">
        <iframe
          src={`https://www.instagram.com/${instagram.type}/${instagram.id}/embed/`}
          title="Video de la noticia"
          allowFullScreen
        />
      </div>
    );
  }

  if (isVideoFile(videoUrl)) {
    return (
      <div className="video-wrapper">
        <video src={videoUrl} controls className="news-video" />
      </div>
    );
  }

  return null;
}

export default function NewsShow() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadNews() {
      try {
        const res = await fetch(`${API_URL}/news/${id}`);
        if (!res.ok) throw new Error('No encontrada');
        const data = await res.json();
        if (active) setItem(data);
      } catch {
        if (active) setError('No se pudo cargar la noticia.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadNews();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="page-container">
      <Link to="/news" className="back-link">
        ← Volver a novedades
      </Link>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando noticia…</div>
      ) : !item ? (
        <div className="empty-state">La noticia solicitada no existe.</div>
      ) : (
        <article className="card news-show">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="news-show-image"
              onError={(e) => {
                e.currentTarget.src = '/images/sena1.jpg';
              }}
            />
          )}

          <div className="news-show-meta">
            <span className="news-show-badge">Novedad</span>
            <span>Publicado el {formatDate(item.createdAt)}</span>
          </div>

          <h1 className="page-title">{item.title}</h1>

          <VideoEmbed item={item} />

          <hr className="news-divider" />

          <p className="news-show-content">{item.content}</p>

          <div className="detail-actions">
            <Link
              to={`/news/create?id=${item.id}`}
              className="btn btn-secondary btn-sm"
            >
              Editar
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
