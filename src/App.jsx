import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/reusable/Navbar';
import Footer from './components/reusable/Footer';

import Home from './components/reusable/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';

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

function RequireAuth({ children }) {
  const location = useLocation();
  const session = localStorage.getItem('admin-sena-session');
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/sena-info"
            element={
              <RequireAuth>
                <SenaInfoIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/sena-info/create"
            element={
              <RequireAuth>
                <SenaInfoCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/sena-info/:id"
            element={
              <RequireAuth>
                <SenaInfoShow />
              </RequireAuth>
            }
          />

          <Route
            path="/areas"
            element={
              <RequireAuth>
                <AreasIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/areas/create"
            element={
              <RequireAuth>
                <AreasCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/areas/:id"
            element={
              <RequireAuth>
                <AreasShow />
              </RequireAuth>
            }
          />

          <Route
            path="/courses"
            element={
              <RequireAuth>
                <CoursesIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/create"
            element={
              <RequireAuth>
                <CoursesCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <RequireAuth>
                <CoursesShow />
              </RequireAuth>
            }
          />

          <Route
            path="/instructors"
            element={
              <RequireAuth>
                <InstructorsIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/instructors/create"
            element={
              <RequireAuth>
                <InstructorsCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/instructors/:id"
            element={
              <RequireAuth>
                <InstructorsShow />
              </RequireAuth>
            }
          />

          <Route
            path="/apprentices"
            element={
              <RequireAuth>
                <ApprenticesIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/apprentices/create"
            element={
              <RequireAuth>
                <ApprenticesCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/apprentices/:id"
            element={
              <RequireAuth>
                <ApprenticesShow />
              </RequireAuth>
            }
          />

          <Route
            path="/computers"
            element={
              <RequireAuth>
                <ComputersIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/computers/create"
            element={
              <RequireAuth>
                <ComputersCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/computers/:id"
            element={
              <RequireAuth>
                <ComputersShow />
              </RequireAuth>
            }
          />

          <Route
            path="/training-centers"
            element={
              <RequireAuth>
                <TrainingCentersIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/training-centers/create"
            element={
              <RequireAuth>
                <TrainingCentersCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/training-centers/:id"
            element={
              <RequireAuth>
                <TrainingCentersShow />
              </RequireAuth>
            }
          />

          <Route
            path="/course-teachers"
            element={
              <RequireAuth>
                <CourseTeachersIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/course-teachers/create"
            element={
              <RequireAuth>
                <CourseTeachersCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/course-teachers/:id"
            element={
              <RequireAuth>
                <CourseTeachersShow />
              </RequireAuth>
            }
          />

          <Route
            path="/news"
            element={
              <RequireAuth>
                <NewsIndex />
              </RequireAuth>
            }
          />
          <Route
            path="/news/create"
            element={
              <RequireAuth>
                <NewsCreate />
              </RequireAuth>
            }
          />
          <Route
            path="/news/:id"
            element={
              <RequireAuth>
                <NewsShow />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;