import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';



export default function SenaInfoCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadInfo() {
      try {
        const res = await fetch(`${API_URL}/senaInfos/${editingId}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setImage(data.image || '');
        }
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
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!title.trim()) next.title = 'El título es obligatorio.';
    if (!description.trim())
      next.description = 'La descripción es obligatoria.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/senaInfos/${editingId}`
        : `${API_URL}/senaInfos`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        title: title.trim(),
        description: description.trim(),
        image: image.trim() || '',
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/sena-info');
    } catch {
      setError('No se pudo guardar la información.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card form-card-wide" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar información institucional' : 'Nueva información institucional'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza el contenido institucional.'
            : 'Agrega una sección para mostrarla en la página institucional.'}
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
                placeholder="Ej. Misión del SENA"
              />
              {fieldErrors.title && (
                <span className="form-error">{fieldErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Descripción
              </label>
              <textarea
                id="description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escribe el contenido institucional…"
              />
              {fieldErrors.description && (
                <span className="form-error">{fieldErrors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Ruta de imagen (opcional)
              </label>
              <input
                id="image"
                type="text"
                className="form-input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/sena-info')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Guardar información'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}