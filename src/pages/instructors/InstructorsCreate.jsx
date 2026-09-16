import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function InstructorsCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [areaId, setAreaId] = useState('');
  const [trainingCenterId, setTrainingCenterId] = useState('');
  const [areas, setAreas] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [aRes, cRes] = await Promise.all([
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/trainingCenters`),
        ]);
        const aData = await aRes.json();
        const cData = await cRes.json();
        if (!active) return;
        setAreas(aData);
        setCenters(cData);
        if (isEditing) {
          const tRes = await fetch(`${API_URL}/teachers/${editingId}`);
          if (tRes.ok) {
            const data = await tRes.json();
            setName(data.name || '');
            setPosition(data.location || '');
            setAreaId(data.areaId != null ? String(data.areaId) : '');
            setTrainingCenterId(
              data.trainingCenterId != null ? String(data.trainingCenterId) : ''
            );
          }
        }
      } catch {
        if (active) setError('No se pudieron cargar los datos.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadOptions();
    return () => {
      active = false;
    };
  }, [editingId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio.';
    if (!areaId) next.areaId = 'Selecciona un área.';
    if (!trainingCenterId)
      next.trainingCenterId = 'Selecciona un centro de formación.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/teachers/${editingId}`
        : `${API_URL}/teachers`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        name: name.trim(),
        location: position.trim() || null,
        areaId: Number(areaId),
        trainingCenterId: Number(trainingCenterId),
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/instructors');
    } catch {
      setError('No se pudo guardar el instructor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card form-card-wide" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar instructor' : 'Nuevo instructor'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del instructor.'
            : 'Registra un nuevo instructor.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Nombre del instructor
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carlos Ramírez"
                />
                {fieldErrors.name && (
                  <span className="form-error">{fieldErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="position">
                  Sede / Ubicación
                </label>
                <input
                  id="position"
                  type="text"
                  className="form-input"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Ej. Sede Norte"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="areaId">
                  Área
                </label>
                <select
                  id="areaId"
                  className="form-select"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                >
                  <option value="">Selecciona un área…</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.areaId && (
                  <span className="form-error">{fieldErrors.areaId}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="trainingCenterId">
                  Centro de formación
                </label>
                <select
                  id="trainingCenterId"
                  className="form-select"
                  value={trainingCenterId}
                  onChange={(e) => setTrainingCenterId(e.target.value)}
                >
                  <option value="">Selecciona un centro…</option>
                  {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.trainingCenterId && (
                  <span className="form-error">
                    {fieldErrors.trainingCenterId}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/instructors')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear instructor'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
