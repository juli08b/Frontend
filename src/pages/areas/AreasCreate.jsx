import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function AreasCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadArea() {
      try {
        const res = await fetch(`${API_URL}/areas/${editingId}`);
        if (!res.ok) throw new Error('No encontrada');
        const data = await res.json();
        if (active) setName(data.name || '');
      } catch {
        if (active) setError('No se pudo cargar el área.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadArea();
    return () => {
      active = false;
    };
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError(null);
    setError(null);

    if (!name.trim()) {
      setFieldError('El nombre es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `${API_URL}/areas/${editingId}` : `${API_URL}/areas`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = { name: name.trim(), createdAt: new Date().toISOString() };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/areas');
    } catch {
      setError('No se pudo guardar el área.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar área' : 'Nueva área'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del área.'
            : 'Registra una nueva área de formación.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nombre del área
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Tecnología y Desarrollo"
              />
              {fieldError && <span className="form-error">{fieldError}</span>}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/areas')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear área'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
