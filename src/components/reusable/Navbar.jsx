import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const baseLinks = [
  { to: '/areas', label: 'Áreas' },
  { to: '/courses', label: 'Cursos' },
  { to: '/course-teachers', label: 'Curso-Prof' },
];

const operationLinks = [
  { to: '/instructors', label: 'Instructores' },
  { to: '/apprentices', label: 'Aprendices' },
  { to: '/computers', label: 'Computadores' },
  { to: '/training-centers', label: 'Centro de formación' },
  { to: '/news', label: 'Noticias' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setOpenMobile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setOpenMobile(false);
    setOpenDropdown(null);
  };

  const toggle = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleLogout = async () => {
    await logout();
    closeAll();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    closeAll();
    navigate('/');
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeAll}>
          <img src="/images/LogoSena.jpg" alt="Logo SENA" className="brand-logo" />
          <span>
            Admin<span className="brand-accent">SENA</span>
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Abrir menú"
          onClick={() => setOpenMobile((v) => !v)}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <nav ref={navRef} className={`navbar-nav ${openMobile ? 'open' : ''}`}>
          {/* ── Zona central (solo sesión iniciada) ── */}
          {user && (
            <div className="nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeAll}
              >
                Inicio
              </NavLink>
              <NavLink
                to="/sena-info"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeAll}
              >
                ¿Quiénes Somos?
              </NavLink>

              <div className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${
                    openDropdown === 'base' ? 'active' : ''
                  }`}
                  onClick={() => toggle('base')}
                >
                  Gestión Base <span className="chevron">▼</span>
                </button>
                {openDropdown === 'base' && (
                  <div className="nav-dropdown-menu left">
                    {baseLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="nav-dropdown">
                <button
                  type="button"
                  className={`nav-dropdown-trigger ${
                    openDropdown === 'operation' ? 'active' : ''
                  }`}
                  onClick={() => toggle('operation')}
                >
                  Operación Académica <span className="chevron">▼</span>
                </button>
                {openDropdown === 'operation' && (
                  <div className="nav-dropdown-menu left">
                    {operationLinks.slice(0, 2).map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="nav-dropdown-divider" />
                    {operationLinks.slice(2).map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Derecha: buscador + sesión ── */}
          <div className="navbar-right">
            <form className="nav-search" onSubmit={handleSearch}>
              <input
                type="search"
                name="q"
                placeholder="Buscar…"
                aria-label="Buscar"
              />
              <button type="submit" aria-label="Buscar">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.5" y2="16.5" />
                </svg>
              </button>
            </form>

            {user ? (
              <div className="navbar-auth">
                <div className="nav-dropdown">
                  <button
                    type="button"
                    className="btn-session"
                    onClick={() => toggle('session')}
                  >
                    {user.name} <span className="chevron">▼</span>
                  </button>
                  {openDropdown === 'session' && (
                    <div className="nav-dropdown-menu">
                      <Link
                        to="/profile"
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        Mi perfil
                      </Link>
                      <div className="nav-dropdown-divider" />
                      <button
                        type="button"
                        className="nav-dropdown-item btn-logout-sena"
                        onClick={handleLogout}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="navbar-auth">
                <div className="nav-dropdown">
                  <button
                    type="button"
                    className="btn-session"
                    onClick={() => toggle('guest')}
                  >
                    <span>Iniciar sesión</span>
                    <span className="chevron">▼</span>
                  </button>
                  {openDropdown === 'guest' && (
                    <div className="nav-dropdown-menu">
                      <Link
                        to="/login"
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        Iniciar sesión
                      </Link>
                      <div className="nav-dropdown-divider" />
                      <Link
                        to="/register"
                        className="nav-dropdown-item"
                        onClick={closeAll}
                      >
                        Registrarse
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
