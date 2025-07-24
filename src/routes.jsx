import { Navigate } from "react-router-dom"
import ProtectedRoute from "./shared/components/ProtectedRoute"
import Apprentices from "./features/Apprentices/pages/Apprentices"
import Files from "./features/File/pages/Files"
import InstructorsPage from "./features/Instructors/pages/InstructorsPage"
import Programs from "./features/Programs/pages/Programs"
import TopicsPage from "./features/Topics/pages/TopicsPage"
import SupportMaterials from "./features/SupportMaterials/pages/SupportMaterials"
import Evaluations from "./features/Evaluations/pages/Evaluations"
import Feedback from "./features/Feedback/pages/Feedback"
import FeedbackDetails from "./features/Feedback/pages/FeedbackDetails"
import StudentDetails from "./features/Feedback/pages/StudentDetails"
import ScheduledCoursesPage from "./features/ScheduledCourses/pages/ScheduledCoursesPage"
import Badges from "./features/Badges/pages/Badges"
import Badges2 from "./features/Badges/pages/Badges2"
import Badges3 from "./features/Badges/pages/Badges3"
import Ranking from "./features/Ranking/pages/Ranking"
import Dashboard from "./features/Dashboard/pages/Dashboard"
import LoginPage from "./features/auth/pages/LoginPage"
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage"
import RolesPage from "./features/Role/pages/RolesPage"
import EditarRolePage from "./features/Role/pages/EditarRolePage"
import RoleDetailPage from "./features/Role/pages/RoleDetailPage"
import CourseProgrammingPage from "./features/CourseProgramming/pages/course-programming-page"
import CourseProgramming from "./features/CourseProgramming/components/course-programming"
import CourseProgrammingDetail from "./features/CourseProgramming/components/course-programming-detail"
import LevelAssignmentPage from "./features/LevelAssignment/pages/LevelAssignmentPage"
import CreateEvaluationPage from "./features/Evaluations/pages/CreateEvaluationPage"
import EditEvaluationPage from "./features/Evaluations/pages/EditEvaluationPage"
import CreateInstructorPage from "./features/Instructors/pages/CreateInstructorPage"
import EditInstructorPage from "./features/Instructors/pages/EditInstructorPage"
import LevelsPageUpdated from "./features/ScheduledCourses/pages/LevelsPage"
import TraineesPageUpdated from "./features/ScheduledCourses/pages/TraineesPage"
import ProgressViewWithRealData from "./features/ScheduledCourses/pages/ProgressView"

// 🆕 Importar páginas de aprendiz

import ApprenticeProfile from "./apprentice/pages/ApprenticeProfile"
import Home from "./apprentice/pages/Dashboard/pages/Inicio"
import ApprenticeFeedbackView from "./apprentice/pages/Feedback/pages/Feedback"
import ApprenticeRanking from "./apprentice/pages/Ranking/pages/Ranking"

// Definición de rutas
const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRoute="/dashboard">
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  // 🆕 RUTAS ESPECÍFICAS PARA APRENDICES
  {
    path: "/apprentice/dashboard",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/dashboard" allowedRoles={["aprendiz"]}>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/apprentice/ranking",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/ranking" allowedRoles={["aprendiz"]}>
        <ApprenticeRanking />
      </ProtectedRoute>
    ),
  },
  {
    path: "/apprentice/feedback",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/feedback" allowedRoles={["aprendiz"]}>
        <ApprenticeFeedbackView />
      </ProtectedRoute>
    ),
  },
  /* {
    path: "/apprentice/courses",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/courses" allowedRoles={["aprendiz"]}>
        <ApprenticeCourses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/apprentice/achievements",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/achievements" allowedRoles={["aprendiz"]}>
        <ApprenticeAchievements />
      </ProtectedRoute>
    ),
  }, */
  {
    path: "/apprentice/profile",
    element: (
      <ProtectedRoute requiredRoute="/apprentice/profile" allowedRoles={["aprendiz"]}>
        <ApprenticeProfile />
      </ProtectedRoute>
    ),
  },

  // Formación (Admin/Instructor)
  {
    path: "/formacion/programas",
    element: (
      <ProtectedRoute requiredRoute="/formacion/programas">
        <Programs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/formacion/fichas",
    element: (
      <ProtectedRoute requiredRoute="/formacion/fichas">
        <Files />
      </ProtectedRoute>
    ),
  },
  {
    path: "/formacion/instructores",
    element: (
      <ProtectedRoute requiredRoute="/formacion/instructores">
        <InstructorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/formacion/instructores/crear",
    element: <CreateInstructorPage />,
  },
  {
    path: "/formacion/instructores/editar/:id",
    element: <EditInstructorPage />,
  },
  {
    path: "/formacion/aprendices",
    element: (
      <ProtectedRoute requiredRoute="/formacion/aprendices">
        <Apprentices />
      </ProtectedRoute>
    ),
  },
  // Programación
  {
    path: "/programacion/temas",
    element: (
      <ProtectedRoute requiredRoute="/programacion/temas">
        <TopicsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/materiales",
    element: (
      <ProtectedRoute requiredRoute="/programacion/materiales">
        <SupportMaterials />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/evaluaciones",
    element: (
      <ProtectedRoute requiredRoute="/programacion/evaluaciones">
        <Evaluations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/evaluaciones/crear",
    element: <CreateEvaluationPage />,
  },
  {
    path: "/programacion/evaluaciones/editar/:id",
    element: <EditEvaluationPage />,
  },
  {
    path: "/programacion/programacionCursos",
    element: (
      <ProtectedRoute requiredRoute="/programacion/programacionCursos">
        <CourseProgrammingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/programacionCursos/registrarProgramacion",
    element: (
      <ProtectedRoute requiredRoute="/programacion/programacionCursos">
        <CourseProgramming />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/programacionCursos/editar/:id",
    element: (
      <ProtectedRoute requiredRoute="/programacion/programacionCursos">
        <CourseProgramming />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/programacionCursos/detalle/:id",
    element: (
      <ProtectedRoute requiredRoute="/programacion/programacionCursos">
        <CourseProgrammingDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/asignacionNiveles",
    element: <LevelAssignmentPage />,
  },
  {
    path: "/programacion/insigneas",
    element: (
      <ProtectedRoute requiredRoute="/programacion/insigneas">
        <Badges />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/insigneas2",
    element: (
      <ProtectedRoute requiredRoute="/programacion/insigneas2">
        <Badges2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/programacion/insigneas3",
    element: (
      <ProtectedRoute requiredRoute="/programacion/insigneas3">
        <Badges3 />
      </ProtectedRoute>
    ),
  },
  // Progreso
  {
    path: "/progreso/cursosProgramados",
    element: (
      <ProtectedRoute requiredRoute="/progreso/cursosProgramados">
        <ScheduledCoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/cursosProgramados/niveles",
    element: (
      <ProtectedRoute requiredRoute="/progreso/cursosProgramados">
        <LevelsPageUpdated />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/cursosProgramados/niveles/aprendices",
    element: (
      <ProtectedRoute requiredRoute="/progreso/cursosProgramados">
        <TraineesPageUpdated />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/cursosProgramados/niveles/aprendices/progreso/:nombre",
    element: (
      <ProtectedRoute requiredRoute="/progreso/cursosProgramados">
        <ProgressViewWithRealData />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/ranking",
    element: (
      <ProtectedRoute requiredRoute="/progreso/ranking">
        <Ranking />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/retroalimentacion",
    element: (
      <ProtectedRoute requiredRoute="/progreso/retroalimentacion">
        <Feedback />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/retroalimentacion/:id",
    element: (
      <ProtectedRoute requiredRoute="/progreso/retroalimentacion">
        <FeedbackDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progreso/retroalimentacion/detallesaprendiz",
    element: (
      <ProtectedRoute requiredRoute="/progreso/retroalimentacion">
        <StudentDetails />
      </ProtectedRoute>
    ),
  },
  // Configuración - ROLES ACTUALIZADOS
  {
    path: "/configuracion/roles",
    element: (
      <ProtectedRoute requiredRoute="/configuracion/roles">
        <RolesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/configuracion/roles/editar/:id",
    element: (
      <ProtectedRoute requiredRoute="/configuracion/roles">
        <EditarRolePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/configuracion/roles/detalle/:id",
    element: (
      <ProtectedRoute requiredRoute="/configuracion/roles">
        <RoleDetailPage />
      </ProtectedRoute>
    ),
  },
]

export default routes
