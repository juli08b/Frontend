import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_URL } from '../../utils/helpers';

const todayLabel = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const events = [
  {
    time: '08:00 - 10:00',
    text: 'Revisión de planillas',
    tag: 'Gestión académica',
    color: '#1f9d55',
  },
  {
    time: '10:30 - 11:30',
    text: 'Atención en coordinación',
    tag: 'Matrícula/Fichas',
    color: '#1f9d55',
  },
  {
    time: '02:00 - 04:00',
    text: 'Verificación de pólizas',
    tag: 'Gestión administrativa',
    color: '#1f9d55',
  },
];

const notifications = [
  { text: 'Se publicó el edicto de estudiantes desertados.', time: 'Hace 2 horas' },
  { text: 'Nueva ficha disponible para tu revisión.', time: 'Hace 4 horas' },
  { text: 'Solicitud de retiro voluntario de aprendiz.', time: 'Hace 6 horas' },
  { text: 'Publicación de planillas de instructores.', time: 'Hace 1 día' },
];

const quickLinks = [
  { to: '/apprentices/create', icon: '👤', label: 'Registrar aprendiz' },
  { to: '/courses', icon: '📄', label: 'Consultar ficha' },
  { to: '/apprentices', icon: '📑', label: 'Gestionar matrícula' },
  { to: '/courses', icon: '📈', label: 'Ver reportes' },
  { to: '/instructors', icon: '👨‍🏫', label: 'Consultar instructores' },
  { to: '/training-centers', icon: '🏢', label: 'Ver ambientes' },
];

function statusBadge(className, label) {
  return <span className={`badge ${className}`}>{label}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [coursePage, setCoursePage] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        const [aRes, tRes, cRes, tcRes, arRes, ctRes] = await Promise.all([
          fetch(`${API_URL}/apprentices`),
          fetch(`${API_URL}/teachers`),
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/trainingCenters`),
          fetch(`${API_URL}/areas`),
          fetch(`${API_URL}/courseTeachers`),
        ]);
        const [apprentices, teachers, courses, centers, areas, relations] =
          await Promise.all([
            aRes.json(),
            tRes.json(),
            cRes.json(),
            tcRes.json(),
            arRes.json(),
            ctRes.json(),
          ]);
        if (active) {
          setData({
            apprentices,
            teachers,
            courses,
            centers,
            areas,
            relations,
          });
        }
      } catch {
        if (active) setData([]);
      }
    }
    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando…</span>
        </div>
      </div>
    );
  }

  const { apprentices, teachers, courses, centers, areas, relations } = data;

  const teacherById = new Map(teachers.map((t) => [t.id, t]));
  const areaById = new Map(areas.map((a) => [a.id, a]));
  const apprenticeCountByCourse = new Map();
  apprentices.forEach((a) => {
    apprenticeCountByCourse.set(
      a.courseId,
      (apprenticeCountByCourse.get(a.courseId) || 0) + 1
    );
  });
  const teacherByCourse = new Map();
  relations.forEach((r) => {
    if (!teacherByCourse.has(r.courseId)) {
      teacherByCourse.set(r.courseId, r.teacherId);
    }
  });

  const kpis = [
    {
      icon: '👥',
      value: apprentices.length,
      label: 'Aprendices activos',
      trend: '±5% vs. mes anterior',
    },
    {
      icon: '👨‍🏫',
      value: teachers.length,
      label: 'Instructores',
      trend: '±2% vs. mes anterior',
    },
    {
      icon: '📄',
      value: courses.length,
      label: 'Fichas en ejecución',
      trend: '±1% vs. mes anterior',
    },
    {
      icon: '🏢',
      value: centers.length,
      label: 'Ambientes de formación',
      trend: 'Sin cambios',
    },
  ];

  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(courses.length / pageSize));
  const visibleCourses = courses.slice(
    coursePage * pageSize,
    coursePage * pageSize + pageSize
  );

  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="row g-4">
      {/* ── Columna principal ── */}
      <div className="col-lg-8">
        {/* Banner de bienvenida */}
        <section className="dash-banner">
          <div className="dash-banner-overlay" />
          <div className="dash-banner-content">
            <p className="dash-banner-name">¡Hola, {user?.name}!</p>
            <h1 className="dash-banner-title">Bienvenido al Admin-Sena</h1>
            <p className="dash-banner-desc">
              Tu apoyo hace posible la formación de miles de colombianos.
            </p>
            <div className="dash-banner-dots">
              <span className="active" />
              <span />
              <span />
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="row row-cols-2 row-cols-md-4 g-3 mt-1">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="col">
              <div className="kpi-card">
                <div className="kpi-card-top">
                  <span className="kpi-icon">{kpi.icon}</span>
                </div>
                <div className="kpi-value">{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-trend mt-1">▲ {kpi.trend}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Mis cursos / Programas */}
        <section className="mt-4">
          <div className="panel-section-head">
            <h2 className="panel-section-title">Mis cursos / Programas</h2>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="carousel-nav-btn"
                aria-label="Anterior"
                disabled={coursePage === 0}
                onClick={() => setCoursePage((p) => Math.max(0, p - 1))}
              >
                ‹
              </button>
              <button
                type="button"
                className="carousel-nav-btn"
                aria-label="Siguiente"
                disabled={coursePage >= pageCount - 1}
                onClick={() => setCoursePage((p) => Math.min(pageCount - 1, p + 1))}
              >
                ›
              </button>
              <Link to="/courses" className="btn btn-secondary btn-sm">
                Ver todos
              </Link>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">Aún no hay fichas registradas.</div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3">
              {visibleCourses.map((course) => {
                const percent = ((course.id * 31) % 41) + 55;
                return (
                  <div key={course.id} className="col">
                    <Link to={`/courses/${course.id}`} className="text-decoration-none">
                      <div className="course-card">
                        <div className="course-card-media">🎓</div>
                        <div className="course-card-body">
                          <div className="course-card-title">
                            {course.courseNumber}
                          </div>
                          <div className="course-card-meta mb-2">
                            Ficha {course.courseNumber}
                          </div>
                          <div className="course-progress mb-1">
                            <div
                              className="course-progress-bar"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="course-status">{percent}%</span>
                            <span className="badge bg-success-subtle text-success">
                              En ejecución
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Últimas fichas registradas */}
        <section className="mt-4">
          <div className="panel-section-head">
            <h2 className="panel-section-title">Últimas fichas registradas</h2>
            <Link to="/courses" className="btn btn-secondary btn-sm">
              Ver todos
            </Link>
          </div>

          <div className="panel-card p-0">
            <div className="table-responsive">
              <table className="table dash-table mb-0">
                <thead>
                  <tr>
                    <th>Ficha</th>
                    <th>Programa de formación</th>
                    <th>Estado</th>
                    <th className="text-center">Aprendices</th>
                    <th>Instructor</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map((course) => {
                    const area = areaById.get(course.areaId);
                    const count = apprenticeCountByCourse.get(course.id) || 0;
                    const teacher = teacherById.get(
                      teacherByCourse.get(course.id)
                    );
                    return (
                      <tr key={course.id}>
                        <td className="fw-bold">{course.courseNumber}</td>
                        <td>{area ? area.name : '—'}</td>
                        <td>
                          {count > 0
                            ? statusBadge(
                                'bg-success-subtle text-success',
                                'En ejecución'
                              )
                            : statusBadge(
                                'bg-warning-subtle text-warning-emphasis',
                                'En revisión'
                              )}
                        </td>
                        <td className="text-center">{count}</td>
                        <td>{teacher ? teacher.name : '—'}</td>
                        <td className="text-end">
                          <Link
                            to={`/courses/${course.id}`}
                            className="btn btn-light btn-sm"
                            aria-label={`Acciones de ${course.courseNumber}`}
                          >
                            ⋯
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* ── Columna derecha (widgets) ── */}
      <div className="col-lg-4">
        {/* Calendario de hoy */}
        <section className="panel-card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h2 className="widget-title">Hoy</h2>
              <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                {todayLabel}
              </div>
            </div>
            <span style={{ fontSize: '1.25rem' }}>📅</span>
          </div>
          {events.map((event) => (
            <div key={event.text} className="event-item">
              <span className="event-dot" style={{ background: event.color }} />
              <div>
                <div className="event-time">{event.time}</div>
                <div className="event-text">{event.text}</div>
                <span className="event-tag">{event.tag}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Formación */}
        <section className="formacion-banner">
          <div className="formacion-banner-icon mb-2">🎓</div>
          <h2 className="widget-title" style={{ color: '#fff' }}>
            Formación para el trabajo y la vida
          </h2>
          <Link to="/sena-info" className="btn btn-outline-light btn-sm mt-3">
            Ver más
          </Link>
        </section>

        {/* Notificaciones */}
        <section className="panel-card widget-card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="widget-title">Notificaciones</h2>
            <Link to="/news" className="btn btn-link btn-sm p-0">
              Ver todas
            </Link>
          </div>
          {notifications.map((notif) => (
            <div key={notif.text} className="notif-item">
              <span className="notif-dot" />
              <div>
                <div className="notif-text">{notif.text}</div>
                <div className="notif-time">{notif.time}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Accesos rápidos */}
        <section className="panel-card widget-card p-3">
          <h2 className="widget-title mb-3">Accesos rápidos</h2>
          <div className="row row-cols-2 g-2">
            {quickLinks.map((link) => (
              <div key={link.label} className="col">
                <Link to={link.to} className="quick-btn">
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}