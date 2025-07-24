"use client"

import { useEffect, useCallback, useState } from "react"

export function useGetModules() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchModules = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:3000/api/module")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los módulos")
      }

      setModules(data.data || [])
    } catch (err) {
      setError(err.message || "Error desconocido al obtener los módulos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return { modules, loading, error, refetch: fetchModules }
}
