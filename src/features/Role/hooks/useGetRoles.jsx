"use client"

import { useEffect, useCallback, useState } from "react"

export function useGetRoles() {
  const [roles, setRoles] = useState([]) // Inicializar como array vacío
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:3000/api/role")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los roles")
      }

      // Asegurar que siempre sea un array
      const rolesData = Array.isArray(data) ? data : data.data && Array.isArray(data.data) ? data.data : []
      setRoles(rolesData)
    } catch (err) {
      console.error("Error fetching roles:", err)
      setError(err.message || "Error desconocido al obtener los roles")
      setRoles([]) // Asegurar que sea array en caso de error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return { roles, loading, error, refetch: fetchRoles }
}
