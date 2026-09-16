import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function NewsCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadNews() {
      try {
        const res = await fetch(`${API_URL}/news/${editingId}`);
        if (!res.ok) throw new Error('No encontrada');
        const data = await res.json();
        if (active) {
          setTitle(data.title || '');
          setContent(data.content || '');
          setImageUrl(data.imageUrl || '');
          setImageError(false);
          setVideoUrl(data.videoUrl || '');
        }
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
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!title.trim()) next.title = 'El título es obligatorio.';
    if (!content.trim())
      next.content = 'El contenido de la noticia es obligatorio.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/news/${editingId}`
        : `${API_URL}/news`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || '',
        videoUrl: videoUrl.trim() || '',
        videoPath: '',
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/news');
    } catch {
      setError('No se pudo guardar la noticia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card form-card-wide" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar noticia' : 'Nueva noticia'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información de la noticia.'
            : 'Publica una nueva noticia institucional.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Título
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Inicio del nuevo periodo de formación"
              />
              {fieldErrors.title && (
                <span className="form-error">{fieldErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">
                Contenido
              </label>
              <textarea
                id="content"
                className="form-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe el contenido de la noticia…"
              />
              {fieldErrors.content && (
                <span className="form-error">{fieldErrors.content}</span>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">
                  URL de la imagen
                </label>
                <input
                  id="imageUrl"
                  type="text"
                  className="form-input"
                  value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError(false);
                    }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                  <span className="form-hint">
                    Usa la dirección directa de la imagen, no la URL de la página
                    de Google, Pinterest o Instagram.
                  </span>
                  {imageUrl.trim() && !imageError && (
                    <img
                      src={imageUrl.trim()}
                      alt="Vista previa de la noticia"
                      className="image-url-preview"
                      onError={() => setImageError(true)}
                    />
                  )}
                  {imageError && (
                    <span className="form-error">
                      Esta URL no apunta a una imagen accesible. Copia la opción
                      “Copiar dirección de imagen” desde el navegador.
                    </span>
                  )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="videoUrl">
                  URL del video
                </label>
                <input
                  id="videoUrl"
                  type="text"
                  className="form-input"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/…"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/news')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Publicar noticia'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
