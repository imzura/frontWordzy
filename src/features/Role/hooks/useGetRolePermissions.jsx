"use client"

import { useEffect, useCallback, useState } from "react"

export function useGetRolePermissions(roleId) {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPermissions = useCallback(async () => {
    if (!roleId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:3000/api/permission/role/${roleId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los permisos del rol")
      }

      setPermissions(data.data || [])
    } catch (err) {
      setError(err.message || "Error desconocido al obtener los permisos")
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  return { permissions, loading, error, refetch: fetchPermissions }
}
