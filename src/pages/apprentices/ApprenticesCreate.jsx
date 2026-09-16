import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/helpers';

export default function ApprenticesCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const editingId = params.get('id');

  const isEditing = Boolean(editingId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [courseId, setCourseId] = useState('');
  const [computerId, setComputerId] = useState('');
  const [courses, setCourses] = useState([]);
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;
    async function loadOptions() {
      try {
        const [cRes, coRes] = await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/computers`),
        ]);
        const cData = await cRes.json();
        const coData = await coRes.json();
        if (!active) return;
        setCourses(cData);
        setComputers(coData);
        if (isEditing) {
          const aRes = await fetch(`${API_URL}/apprentices/${editingId}`);
          if (aRes.ok) {
            const data = await aRes.json();
            setName(data.name || '');
            setEmail(data.email || '');
            setNumber(data.number != null ? String(data.number) : '');
            setCourseId(data.courseId != null ? String(data.courseId) : '');
            setComputerId(data.computerId != null ? String(data.computerId) : '');
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
    if (!email.trim()) next.email = 'El correo electrónico es obligatorio.';
    if (!number.trim()) next.number = 'El número de contacto es obligatorio.';
    if (!courseId) next.courseId = 'Selecciona un curso.';
    setFieldErrors(next);
    setError(null);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      const url = isEditing
        ? `${API_URL}/apprentices/${editingId}`
        : `${API_URL}/apprentices`;
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        name: name.trim(),
        email: email.trim(),
        number: Number(number.trim()),
        courseId: Number(courseId),
        computerId: computerId ? Number(computerId) : null,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar');
      navigate('/apprentices');
    } catch {
      setError('No se pudo guardar el aprendiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form-card form-card-wide" onSubmit={handleSubmit}>
        <h1 className="page-title">
          {isEditing ? 'Editar aprendiz' : 'Nuevo aprendiz'}
        </h1>
        <p className="page-subtitle">
          {isEditing
            ? 'Actualiza la información del aprendiz.'
            : 'Registra un nuevo aprendiz.'}
        </p>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="empty-state">Cargando datos…</div>
        ) : (
          <>
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
                {fieldErrors.name && (
                  <span className="form-error">{fieldErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aprendiz@sena.edu.co"
                />
                {fieldErrors.email && (
                  <span className="form-error">{fieldErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="number">
                  Número de contacto
                </label>
                <input
                  id="number"
                  type="number"
                  className="form-input"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ej. 3001234567"
                />
                {fieldErrors.number && (
                  <span className="form-error">{fieldErrors.number}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="courseId">
                  Curso
                </label>
                <select
                  id="courseId"
                  className="form-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Selecciona un curso…</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseNumber}
                    </option>
                  ))}
                </select>
                {fieldErrors.courseId && (
                  <span className="form-error">{fieldErrors.courseId}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="computerId">
                  Computador asignado
                </label>
                <select
                  id="computerId"
                  className="form-select"
                  value={computerId}
                  onChange={(e) => setComputerId(e.target.value)}
                >
                  <option value="">Sin asignar</option>
                  {computers.map((computer) => (
                    <option key={computer.id} value={computer.id}>
                      #{computer.number} ({computer.brand || 'Sin marca'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/apprentices')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear aprendiz'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
