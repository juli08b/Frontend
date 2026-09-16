import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/reusable/Navbar';
import Footer from './components/reusable/Footer';
import AdminLayout from './layouts/AdminLayout';

import Home from './components/reusable/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import Dashboard from './pages/dashboard/Dashboard';

import AreasIndex from './pages/areas/AreasIndex';
import AreasCreate from './pages/areas/AreasCreate';
import AreasShow from './pages/areas/AreasShow';

import CoursesIndex from './pages/courses/CoursesIndex';
import CoursesCreate from './pages/courses/CoursesCreate';
import CoursesShow from './pages/courses/CoursesShow';

import InstructorsIndex from './pages/instructors/InstructorsIndex';
import InstructorsCreate from './pages/instructors/InstructorsCreate';
import InstructorsShow from './pages/instructors/InstructorsShow';

import ApprenticesIndex from './pages/apprentices/ApprenticesIndex';
import ApprenticesCreate from './pages/apprentices/ApprenticesCreate';
import ApprenticesShow from './pages/apprentices/ApprenticesShow';

import ComputersIndex from './pages/computers/ComputersIndex';
import ComputersCreate from './pages/computers/ComputersCreate';
import ComputersShow from './pages/computers/ComputersShow';

import TrainingCentersIndex from './pages/training-centers/TrainingCentersIndex';
import TrainingCentersCreate from './pages/training-centers/TrainingCentersCreate';
import TrainingCentersShow from './pages/training-centers/TrainingCentersShow';

import CourseTeachersIndex from './pages/course-teachers/CourseTeachersIndex';
import CourseTeachersCreate from './pages/course-teachers/CourseTeachersCreate';
import CourseTeachersShow from './pages/course-teachers/CourseTeachersShow';

import NewsIndex from './pages/news/NewsIndex';
import NewsCreate from './pages/news/NewsCreate';
import NewsShow from './pages/news/NewsShow';

import SenaInfoIndex from './pages/sena-info/SenaInfoIndex';
import SenaInfoCreate from './pages/sena-info/SenaInfoCreate';
import SenaInfoShow from './pages/sena-info/SenaInfoShow';

// sirve para crear un componente de rutas protegidas en React, donde se verifica si el usuario está autenticado antes de permitir el acceso a ciertas rutas. Si no está autenticado, se redirige al usuario a la página de inicio de sesión.
function RequireAuth({ children }) {
  const location = useLocation();
  const session = localStorage.getItem('admin-sena-session');
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// sirve para crear un componente de shell público en React, donde se muestra la barra de navegación y el pie de página, y se renderiza el contenido principal de la página.
function PublicShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}

// sirve para crear el componente principal de la aplicación en React, donde se definen las rutas y se renderizan los componentes correspondientes según la ruta actual.
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicShell>
            <Home />
          </PublicShell>
        }
      />
      <Route
        path="/login"
        element={
          <PublicShell>
            <Login />
          </PublicShell>
        }
      />
      <Route
        path="/register"
        element={
          <PublicShell>
            <Register />
          </PublicShell>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Sena Info */}
        <Route path="/sena-info" element={<SenaInfoIndex />} />
        <Route path="/sena-info/create" element={<SenaInfoCreate />} />
        <Route path="/sena-info/:id" element={<SenaInfoShow />} />

        {/* Areas */}
        <Route path="/areas" element={<AreasIndex />} />
        <Route path="/areas/create" element={<AreasCreate />} />
        <Route path="/areas/:id" element={<AreasShow />} />

        {/* Courses */}
        <Route path="/courses" element={<CoursesIndex />} />
        <Route path="/courses/create" element={<CoursesCreate />} />
        <Route path="/courses/:id" element={<CoursesShow />} />

        {/* Instructors */}
        <Route path="/instructors" element={<InstructorsIndex />} />
        <Route path="/instructors/create" element={<InstructorsCreate />} />
        <Route path="/instructors/:id" element={<InstructorsShow />} />

        {/* Apprentices */}
        <Route path="/apprentices" element={<ApprenticesIndex />} />
        <Route path="/apprentices/create" element={<ApprenticesCreate />} />
        <Route path="/apprentices/:id" element={<ApprenticesShow />} />

        {/* Computers */}
        <Route path="/computers" element={<ComputersIndex />} />
        <Route path="/computers/create" element={<ComputersCreate />} />
        <Route path="/computers/:id" element={<ComputersShow />} />

        {/* Training Centers */}
        <Route path="/training-centers" element={<TrainingCentersIndex />} />
        <Route path="/training-centers/create" element={<TrainingCentersCreate />} />
        <Route path="/training-centers/:id" element={<TrainingCentersShow />} />

        {/* Course Teachers */}
        <Route path="/course-teachers" element={<CourseTeachersIndex />} />
        <Route path="/course-teachers/create" element={<CourseTeachersCreate />} />
        <Route path="/course-teachers/:id" element={<CourseTeachersShow />} />

        {/* News */}
        <Route path="/news" element={<NewsIndex />} />
        <Route path="/news/create" element={<NewsCreate />} />
        <Route path="/news/:id" element={<NewsShow />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;