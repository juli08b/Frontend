import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';



export default function ComputersCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [number, setNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    let active = true;
    async function loadComputer() {
      try {
        const res = await fetch(`${API_URL}/computers/${editingId}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        if (active) {
          setNumber(data.number != null ? String(data.number) : '');
          setBrand(data.brand || '');
        }
      } catch {
        if (active) setError('No se pudo cargar el computador.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadComputer();
    return () => {
      active = false;
    };
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!number.trim()) next.number = 'El número es obligatorio.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/computers/${editingId}`
        : `${API_URL}/computers`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        number: Number(number.trim()),
        brand: brand.trim() || null,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/computers');
    } catch {
      setError('No se pudo guardar el computador.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar computador' : 'Nuevo computador'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del equipo.'
            : 'Registra un nuevo equipo de cómputo.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="number">
                Número del equipo
              </label>
              <input
                id="number"
                type="number"
                className="form-input"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ej. 101"
              />
              {fieldErrors.number && (
                <span className="form-error">{fieldErrors.number}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="brand">
                Marca
              </label>
              <input
                id="brand"
                type="text"
                className="form-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. HP, Dell, Lenovo"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/computers')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear computador'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
