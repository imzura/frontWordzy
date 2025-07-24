"use client"

import { usePermissions } from "../hooks/usePermissions"

const ProtectedAction = ({
  module,
  privilege,
  children,
  fallback = null,
  requireAll = false,
  permissions = [], // Para múltiples permisos: [{ module: "temas", privilege: "read" }]
}) => {
  const { hasPermission, hasAnyPermission, loading } = usePermissions()

  // Si está cargando, no mostrar nada (o mostrar un loader)
  if (loading) return fallback

  let hasAccess = false

  if (permissions.length > 0) {
    // Verificar múltiples permisos
    if (requireAll) {
      hasAccess = permissions.every(({ module, privilege }) => hasPermission(module, privilege))
    } else {
      hasAccess = hasAnyPermission(permissions)
    }
  } else if (module && privilege) {
    // Verificar un solo permiso
    hasAccess = hasPermission(module, privilege)
  }

  return hasAccess ? children : fallback
}

export default ProtectedAction
