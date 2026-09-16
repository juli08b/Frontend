import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/sena-info', label: '¿Quiénes Somos?' },
  { to: '/news', label: 'Noticias' },
  { to: '/courses', label: 'Cursos' },
];

const supportLinks = [
  { to: '/areas', label: 'Áreas de formación' },
  { to: '/instructors', label: 'Instructores' },
  { to: '/apprentices', label: 'Aprendices' },
  { to: '/computers', label: 'Computadores' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4 className="footer-title">AdminSENA</h4>
          <p>
            Panel institucional para la gestión académica del SENA: áreas,
            cursos, instructores, aprendices, equipos de cómputo y centros de
            formación.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              className="footer-social"
              href="#"
              aria-label="Facebook"
              onClick={(e) => e.preventDefault()}
            >
              f
            </a>
            <a
              className="footer-social"
              href="#"
              aria-label="Instagram"
              onClick={(e) => e.preventDefault()}
            >
              ig
            </a>
            <a
              className="footer-social"
              href="#"
              aria-label="X"
              onClick={(e) => e.preventDefault()}
            >
              x
            </a>
          </div>
        </div>

        <div
          className="footer-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          <div>
            <h4 className="footer-title">Explorar</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Gestión</h4>
            <ul className="footer-links">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-text">
          © 2026 AdminSENA · Servicio Nacional de Aprendizaje. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
}
