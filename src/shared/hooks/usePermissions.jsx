"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../features/auth/hooks/useAuth"

export function usePermissions() {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener el rol del usuario de manera más flexible
  const getUserRole = useCallback(() => {
    if (!user) return null

    // Si el user tiene la estructura anidada: user.user.role
    if (user.user?.role) {
      return typeof user.user.role === "string" ? user.user.role : user.user.role.name
    }

    // Si el user tiene role directamente: user.role
    if (user.role) {
      return typeof user.role === "string" ? user.role : user.role.name
    }

    // Si tiene userType como fallback
    if (user.userType) {
      return user.userType
    }

    return null
  }, [user])

  // Obtener el ID del rol para consultar permisos
  const getRoleId = useCallback(async () => {
    const roleName = getUserRole()
    if (!roleName) return null

    try {
      // Normalizar el nombre del rol (primera letra mayúscula)
      const normalizedRoleName = roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()

      // Buscar el rol por nombre para obtener su ID
      const response = await fetch("http://localhost:3000/api/role")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener roles")
      }

      const roles = Array.isArray(data) ? data : data.data || []
      const role = roles.find((r) => r.name === normalizedRoleName)

      return role?._id || null
    } catch (error) {
      console.error("Error getting role ID:", error)
      return null
    }
  }, [getUserRole])

  const fetchUserPermissions = useCallback(async () => {
    const roleName = getUserRole()

    if (!roleName) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const roleId = await getRoleId()

      if (!roleId) {
        console.warn("No se pudo obtener el ID del rol")
        setPermissions([])
        setLoading(false)
        return
      }

      const response = await fetch(`http://localhost:3000/api/permission/role/${roleId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener permisos")
      }

      setPermissions(data.data || [])
    } catch (err) {
      console.error("Error fetching permissions:", err)
      setError(err.message)
      setPermissions([])
    } finally {
      setLoading(false)
    }
  }, [getUserRole, getRoleId])

  useEffect(() => {
    fetchUserPermissions()
  }, [fetchUserPermissions])

  // Función para verificar si el usuario tiene un permiso específico
  const hasPermission = useCallback(
    (moduleName, privilegeName) => {
      const roleName = getUserRole()

      if (!roleName || !permissions.length) return false

      // Administrador tiene todos los permisos
      const normalizedRoleName = roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()
      if (normalizedRoleName === "Administrador") return true

      // Buscar el permiso específico
      return permissions.some((permission) => {
        const moduleMatch = permission.moduleId?.name === moduleName || permission.permissionId?.name === moduleName

        const privilegeMatch = permission.privilegeId?.name === privilegeName

        return moduleMatch && privilegeMatch && permission.isActive
      })
    },
    [permissions, getUserRole],
  )

  // Función para verificar múltiples permisos
  const hasAnyPermission = useCallback(
    (checks) => {
      return checks.some(({ module, privilege }) => hasPermission(module, privilege))
    },
    [hasPermission],
  )

  // Función para obtener todos los permisos de un módulo
  const getModulePermissions = useCallback(
    (moduleName) => {
      const roleName = getUserRole()
      const normalizedRoleName = roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase() : ""

      if (normalizedRoleName === "Administrador") {
        return {
          create: true,
          read: true,
          update: true,
          delete: true,
          export: true,
          
        }
      }

      const modulePermissions = permissions.filter((permission) => {
        return (
          (permission.moduleId?.name === moduleName || permission.permissionId?.name === moduleName) &&
          permission.isActive
        )
      })

      return {
        create: modulePermissions.some((p) => p.privilegeId?.name === "create"),
        read: modulePermissions.some((p) => p.privilegeId?.name === "read"),
        update: modulePermissions.some((p) => p.privilegeId?.name === "update"),
        delete: modulePermissions.some((p) => p.privilegeId?.name === "delete"),
        export: modulePermissions.some((p) => p.privilegeId?.name === "export"),
      }
    },
    [permissions, getUserRole],
  )

  const roleName = getUserRole()
  const normalizedRoleName = roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase() : ""

  return {
    permissions,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    getModulePermissions,
    refetch: fetchUserPermissions,
    userRole: normalizedRoleName,
    isAdmin: normalizedRoleName === "Administrador",
  }
}
