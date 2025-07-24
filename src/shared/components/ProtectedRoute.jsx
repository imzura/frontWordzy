"use client"

import { useAuth } from "../../features/auth/hooks/useAuth"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredRoute, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // 🆕 Verificar roles permitidos si se especifican
  if (allowedRoles.length > 0) {
    const userRole = user?.role || user?.user?.role || user?.userType
    const normalizedUserRole = typeof userRole === "string" ? userRole.toLowerCase() : userRole?.name?.toLowerCase()

    const hasAllowedRole = allowedRoles.some((role) => role.toLowerCase() === normalizedUserRole)

    if (!hasAllowedRole) {
      // Redirigir según el rol del usuario
      const defaultRoute = normalizedUserRole === "aprendiz" ? "/apprentice/ranking" : "/dashboard"
      return <Navigate to={defaultRoute} />
    }
  }

  return children
}

export default ProtectedRoute
