"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import routes from "./routes"
import { useAuth } from "./features/auth/hooks/useAuth"
import ProtectedNavbar from "./shared/components/ProtectedNavbar"
import ApprenticeNavbar from "./apprentice/components/ApprenticeNavbar"

function App() {
  const { isAuthenticated, isAuthResolved, user } = useAuth()

  // Espera a que se resuelva la autenticación antes de renderizar rutas
  if (!isAuthResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Función para obtener el rol del usuario
  const getUserRole = () => {
    if (!user) return null
    const role = user?.role || user?.user?.role || user?.userType
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : role?.name?.toLowerCase()
    return normalizedRole
  }

  const userRole = getUserRole()
  const isApprentice = userRole === "aprendiz"

  // 🆕 Función para obtener la ruta por defecto según el rol
  const getDefaultRoute = () => {
    if (isApprentice) return "/apprentice/dashboard" // 🔄 Cambiado de ranking a dashboard
    return "/dashboard"
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Mostrar navbar según el rol */}
        {isAuthenticated && <>{isApprentice ? <ApprenticeNavbar /> : <ProtectedNavbar />}</>}

        <div className={`flex-1 overflow-auto ${!isAuthenticated ? "w-full" : ""}`}>
          {/* Solo agregar container y padding para admin/instructor */}
          <div className={isApprentice ? "" : "container mx-auto p-4"}>
            <Routes>
              {routes.map((route, index) => {
                const isPublicRoute = route.path === "/" || route.path === "/login" || route.path === "/forgot-password"

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      isPublicRoute ? (
                        isAuthenticated && (route.path === "/login" || route.path === "/forgot-password") ? (
                          <Navigate to={getDefaultRoute()} replace />
                        ) : (
                          route.element
                        )
                      ) : isAuthenticated ? (
                        route.element
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                )
              })}

              {/* Ruta por defecto según el rol */}
              {isAuthenticated && <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
