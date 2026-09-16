import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const menuItems = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/apprentices', icon: '👥', label: 'Aprendices' },
  { to: '/instructors', icon: '👨‍🏫', label: 'Instructores' },
  { to: '/courses', icon: '📄', label: 'Fichas' },
  { to: '/training-centers', icon: '🏢', label: 'Ambientes de formación' },
  { to: '/areas', icon: '📦', label: 'Programas de formación' },
  { to: '/apprentices', icon: '📑', label: 'Matrícula' },
  { to: '/courses', icon: '📈', label: 'Reportes' },
];

const adminGroups = [
  {
    label: 'Gestión administrativa',
    icon: '💼',
    items: [
      { to: '/computers', icon: '🖥️', label: 'Computadores' },
      { to: '/news', icon: '📰', label: 'Noticias' },
      { to: '/course-teachers', icon: '📑', label: 'Curso-Prof' },
    ],
  },
  {
    label: 'Configuración',
    icon: '⚙️',
    items: [
      { to: '/profile', icon: '👤', label: 'Mi perfil' },
      { to: '/sena-info', icon: '🏛️', label: 'Información institucional' },
    ],
  },
];

function GroupMenu({ group }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="nav-item">
      <button
        type="button"
        className="admin-nav-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="admin-nav-toggle-inner">
          <span className="admin-nav-icon">{group.icon}</span>
          {group.label}
        </span>
        <span className={`admin-toggle-chevron ${open ? 'open' : ''}`}>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div className="admin-nav-sub">
          {group.items.map((item) => (
            <NavLink
              key={item.to + item.label}
              to={item.to}
              className="admin-nav-link"
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`admin-root ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={closeSidebar} />
      )}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <span className="sena-logo-mini">S</span>
          </div>
          <div>
            <div className="admin-sidebar-title">Admin-Sena</div>
            <div className="admin-sidebar-subtitle">Gestión Académica</div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="admin-nav-section">Principal</div>
          {menuItems.map((item) => (
            <div key={item.label} className="nav-item">
              <NavLink
                to={item.to}
                className="admin-nav-link"
                onClick={closeSidebar}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </div>
          ))}

          <div className="admin-nav-section">Administración</div>
          {adminGroups.map((group) => (
            <GroupMenu key={group.label} group={group} />
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <strong>SENA</strong>
          <span>Más formación, más oportunidades.</span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar-icon d-lg-none"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            ☰
          </button>

          <div className="admin-topbar-search">
            <input
              type="search"
              placeholder="Buscar aprendices, fichas, instructores, programas..."
              aria-label="Buscar"
            />
            <span className="admin-search-icon">🔎</span>
          </div>

          <NavLink to="/news" className="admin-topbar-icon ms-auto" title="Notificaciones">
            🔔
            <span className="admin-topbar-badge" />
          </NavLink>

          <div className="position-relative">
            <button
              type="button"
              className="admin-topbar-user btn"
              onClick={() => setUserMenu((o) => !o)}
            >
              <span className="admin-avatar">{avatarInitial}</span>
              <span className="text-start d-none d-sm-block">
                <span className="admin-user-name d-block">{user?.name}</span>
                <span className="admin-user-role d-block">Administrador</span>
              </span>
              <span className="admin-chevron">{userMenu ? '▲' : '▼'}</span>
            </button>

            {userMenu && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1039 }}
                  onClick={() => setUserMenu(false)}
                />
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1042 }}
                >
                  <NavLink to="/profile" className="dropdown-item" onClick={() => setUserMenu(false)}>
                    Mi perfil
                  </NavLink>
                  <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}