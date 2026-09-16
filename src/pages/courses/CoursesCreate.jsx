import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';



export default function CoursesCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [courseNumber, setCourseNumber] = useState('');
  const [day, setDay] = useState('');
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
          const tRes = await fetch(`${API_URL}/courses/${editingId}`);
          if (tRes.ok) {
            const data = await tRes.json();
            setCourseNumber(data.courseNumber || '');
            setDay(data.day || '');
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
    if (!courseNumber.trim())
      next.courseNumber = 'El número de curso es obligatorio.';
    if (!areaId) next.areaId = 'Selecciona un área.';
    if (!trainingCenterId)
      next.trainingCenterId = 'Selecciona un centro de formación.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/courses/${editingId}`
        : `${API_URL}/courses`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        courseNumber: courseNumber.trim(),
        day: day.trim() || null,
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
      navigate('/courses');
    } catch {
      setError('No se pudo guardar el curso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card form-card-wide" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar curso' : 'Nuevo curso'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del curso.'
            : 'Registra un nuevo curso.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="courseNumber">
                  Número de curso
                </label>
                <input
                  id="courseNumber"
                  type="text"
                  className="form-input"
                  value={courseNumber}
                  onChange={(e) => setCourseNumber(e.target.value)}
                  placeholder="Ej. ADSO-2846255"
                />
                {fieldErrors.courseNumber && (
                  <span className="form-error">{fieldErrors.courseNumber}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="day">
                  Horario
                </label>
                <input
                  id="day"
                  type="text"
                  className="form-input"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="Ej. Lunes a Viernes"
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
                onClick={() => navigate('/courses')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear curso'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
