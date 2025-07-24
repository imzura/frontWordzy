"use client"

import { useEffect, useCallback, useState } from "react"

export function useGetPrivileges() {
  const [privileges, setPrivileges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPrivileges = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:3000/api/privilege")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los privilegios")
      }

      setPrivileges(data.data || [])
    } catch (err) {
      setError(err.message || "Error desconocido al obtener los privilegios")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrivileges()
  }, [fetchPrivileges])

  return { privileges, loading, error, refetch: fetchPrivileges }
}
