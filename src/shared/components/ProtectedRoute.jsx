"use client"

// Actualizar las importaciones
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { hasRouteAccess, getDefaultRouteByRole } from "../utils/rolePermissions"

const ProtectedRoute = ({ children, requiredRoute }) => {
  const { user, isLoading } = useContext(AuthContext)

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1f384c]"></div>
      </div>
    )
  }

  // Si no hay usuario o no hay token, redirigir al login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />
  }

  // Si se especifica una ruta requerida, verificar acceso
  if (requiredRoute && !hasRouteAccess(user.role, requiredRoute)) {
    // Redirigir a la ruta por defecto del rol
    const defaultRoute = getDefaultRouteByRole(user.role)
    return <Navigate to={defaultRoute} replace />
  }

  return children
}

export default ProtectedRoute