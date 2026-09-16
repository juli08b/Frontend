import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../utils/helpers';
import NewsPreviews from './NewsPreviews';

const slides = [
  {
    image: '/images/sena1.jpg',
    badge: 'Recuerda nuestros principios',
    title: 'La formación integral es nuestro objetivo',
    desc: 'Investigación, innovación y pensamiento crítico al servicio de Colombia.',
  },
  {
    image: '/images/img1.png',
    badge: 'Tu progreso es nuestra meta',
    title: 'Formamos con calidad',
    desc: 'Talento humano competente para el desarrollo del país.',
  },
  {
    image: 'https://elestudiodeactores.com/wp-content/uploads/2023/04/el-sena-certifica-nuestros-actores.jpeg',
    badge: 'SENA',
    title: 'Unidos por la investigación aplicada',
    desc: 'Conectamos la academia con las realidades del sector productivo.',
  },
  {
    image: '/images/sena6.png',
    badge: 'SENA',
    title: 'Somos entidad de conocimiento',
    desc: 'Inclusión social y desarrollo tecnológico para todos los colombianos.',
  },

];

const quickCards = [
  {
    to: '/areas',
    icon: '🗂️',
    title: 'Áreas',
    description: 'Gestiona las áreas de formación del SENA.',
  },
  {
    to: '/courses',
    icon: '📚',
    title: 'Cursos',
    description: 'Controla los programas y oferta académica.',
  },
  {
    to: '/instructors',
    icon: '👨‍🏫',
    title: 'Instructores',
    description: 'Administra los docentes y su asignación.',
  },
  {
    to: '/apprentices',
    icon: '🎓',
    title: 'Aprendices',
    description: 'Consulta y organiza los aprendices.',
  },
];

const features = [
  {
    icon: '🎯',
    title: 'Gestión académica',
    description: 'Áreas, cursos y Curso-Prof en un solo lugar.',
  },
  {
    icon: '💻',
    title: 'Inventario tecnológico',
    description: 'Control de computadores y equipos de cómputo.',
  },
  {
    icon: '📰',
    title: 'Comunicación institucional',
    description: 'Publica noticias y novedades para toda la comunidad.',
  },
];

function Counter({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start;
    let raf;
    const duration = 900;
    const animate = (timestamp) => {
      if (start === undefined) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadHome() {
      try {
        const [aRes, cRes, tRes, pRes, nRes] = await Promise.all([
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/teachers`),
          fetch(`${API_URL}/apprentices`),
          fetch(`${API_URL}/news`),
        ]);
        const [areas, courses, teachers, apprentices, news] =
          await Promise.all([
            aRes.json(),
            cRes.json(),
            tRes.json(),
            pRes.json(),
            nRes.json(),
          ]);
        if (!active) return;
        setStats({
          areas: areas.length,
          courses: courses.length,
          teachers: teachers.length,
          apprentices: apprentices.length,
        });
        setRecentNews(
          [...news]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        );
      } catch {
        // La página no debe bloquearse si el servidor no responde
      }
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setSlideIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  const goSlide = (index) =>
    setSlideIndex((index + slides.length) % slides.length);

  const statsData = [
    { label: 'Áreas', value: stats?.areas ?? 0 },
    { label: 'Cursos', value: stats?.courses ?? 0 },
    { label: 'Instructores', value: stats?.teachers ?? 0 },
    { label: 'Aprendices', value: stats?.apprentices ?? 0 },
  ];

  return (
    <div className="page-container home-page">
      {/* ── Carrusel hero ── */}
      <section className="hero-carousel">
        <div style={{ position: 'relative' }}>
          {slides.map((slide, i) => (
            <div
              key={slide.image}
              style={{ display: i === slideIndex ? 'block' : 'none' }}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="hero-caption">
                <span className="hero-badge">{slide.badge}</span>
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="hero-controls prev"
            aria-label="Anterior"
            onClick={() => goSlide(slideIndex - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-controls next"
            aria-label="Siguiente"
            onClick={() => goSlide(slideIndex + 1)}
          >
            ›
          </button>
          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                className={`hero-dot ${i === slideIndex ? 'active' : ''}`}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                onClick={() => goSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bienvenida ── */}
      <section className="card home-welcome">
        <h2 className="home-welcome-title">
          {user ? `¡Bienvenido de nuevo, ${user.name}!` : 'Panel de Administración SENA'}
        </h2>
        <p className="home-welcome-desc">
          Gestiona de forma centralizada la información académica y
          administrativa de tu centro de formación.
        </p>
        {user ? (
          <Link to="/dashboard" className="btn btn-primary">
            Ir al panel
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Iniciar sesión
          </Link>
        )}
      </section>

      {/* ── Estadísticas ── */}
      <section className="home-stats">
        {statsData.map((s) => (
          <div key={s.label} className="home-stat">
            <span className="home-stat-value">
              <Counter value={s.value} />
            </span>
            <span className="home-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Tarjetas de acceso rápido ── */}
      <section className="cards-grid">
        {quickCards.map((card) => (
          <Link key={card.to} to={card.to} className="entity-card">
            <span className="entity-card-icon">{card.icon}</span>
            <span className="entity-card-title">{card.title}</span>
            <span className="entity-card-desc">{card.description}</span>
          </Link>
        ))}
      </section>

      {/* ── Características ── */}
      <section className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="card feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>

      {/* ── Novedades ── */}
      <NewsPreviews items={recentNews} />

      {/* ── Banner institucional ── */}
      <section className="institution-banner">
        <span className="eyebrow">Acerca del panel</span>
        <h2>¿Quiénes Somos?</h2>
        <p>
          Conoce la misión y visión institucional del Servicio Nacional de
          Aprendizaje y el propósito de este panel administrativo.
        </p>
        <Link to="/sena-info" className="btn">
          Conoce más
        </Link>
      </section>
    </div>
  );
}
