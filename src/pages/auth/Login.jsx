import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const demoCredentials = {
  email: 'admin@sena.edu.co',
  password: 'admin123',
};

export default function Login() {
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const ok = await login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1 className="page-title">Iniciar sesión</h1>
        <p className="page-subtitle">
          Ingresa con tus credenciales para acceder al panel.
        </p>

        <div className="demo-credentials">
          <span>Cuenta de prueba</span>
          <strong>{demoCredentials.email}</strong>
          <small>Contraseña: {demoCredentials.password}</small>
        </div>

        {(error || authError) && (
          <div className="alert-error">{error || authError}</div>
        )}

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
            required
          />
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
            placeholder="Tu contraseña"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </div>

        <p className="page-subtitle">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Regístrate aquí</Link>.
        </p>
      </form>
    </div>
  );
}
