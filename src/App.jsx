"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./shared/components/Navbar"
import routes from "./routes"
import { useAuth } from "./features/auth/hooks/useAuth"
import { Navigate } from "react-router-dom"

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {isAuthenticated && <Navbar />}
        <div className={`flex-1 overflow-auto ${!isAuthenticated ? "w-full" : ""}`}>
          <div className="container mx-auto p-4">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    // Permitir acceso sin autenticación a login y forgot-password
                    route.path === "/" || route.path === "/login" || route.path === "/forgot-password" ? (
                      // Si está autenticado y trata de ir a login o forgot-password, redirigir a dashboard
                      isAuthenticated && (route.path === "/login" || route.path === "/forgot-password") ? (
                        <Navigate to="/dashboard" />
                      ) : (
                        route.element
                      )
                    ) : isAuthenticated ? (
                      route.element
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              ))}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
