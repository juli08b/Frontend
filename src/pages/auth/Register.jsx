import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio.';
    if (!email.trim()) next.email = 'El correo electrónico es obligatorio.';
    if (password.length < 6)
      next.password = 'La contraseña debe tener al menos 6 caracteres.';
    if (password !== passwordConfirmation)
      next.passwordConfirmation = 'Las contraseñas no coinciden.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const ok = await register(name, email, password);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">Crear cuenta</h1>
        <p className="page-subtitle">
          Regístrate para acceder al panel de administración.
        </p>

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
            placeholder="Nombre y apellido"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
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
            placeholder="usuario@sena.edu.co"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="passwordConfirmation">
            Confirmar contraseña
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            className="form-input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Repite la contraseña"
          />
          {errors.passwordConfirmation && (
            <span className="form-error">{errors.passwordConfirmation}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando…' : 'Registrarse'}
          </button>
        </div>

        <p className="page-subtitle">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>.
        </p>
      </form>
    </div>
  );
}
