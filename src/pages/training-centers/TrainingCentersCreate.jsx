import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function TrainingCentersCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadCenter() {
      try {
        const res = await fetch(`${API_URL}/trainingCenters/${editingId}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) {
          setName(data.name || '');
          setPosition(data.location || '');
        }
      } catch {
        if (active) setError('No se pudo cargar el centro.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCenter();
    return () => {
      active = false;
    };
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio.';
    if (!position.trim()) next.position = 'La ubicación es obligatoria.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/trainingCenters/${editingId}`
        : `${API_URL}/trainingCenters`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        name: name.trim(),
        location: position.trim(),
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/training-centers');
    } catch {
      setError('No se pudo guardar el centro.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar centro' : 'Nuevo centro de formación'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del centro.'
            : 'Registra un nuevo centro de formación.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Nombre del centro
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. SENA Bogotá Centro"
              />
              {fieldErrors.name && (
                <span className="form-error">{fieldErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position">
                Ubicación
              </label>
              <input
                id="position"
                type="text"
                className="form-input"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ej. Carrera 30 #17-67, Bogotá"
              />
              {fieldErrors.position && (
                <span className="form-error">{fieldErrors.position}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/training-centers')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear centro'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
