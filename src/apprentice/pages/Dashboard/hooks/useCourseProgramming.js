"use client"

import { useState, useEffect } from "react"

export const useCourseProgramming = () => {
  const [programming, setProgramming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourseProgramming = async () => {
      try {
        setLoading(true)
        // Usar el endpoint que hace populate de los datos relacionados
        const response = await fetch("http://localhost:3000/api/course-programming")

        if (!response.ok) {
          throw new Error("Error al obtener la programación del curso")
        }

        const data = await response.json()
        console.log("📚 Programación con datos poblados:", data)
        setProgramming(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseProgramming()
  }, [])

  return { programming, loading, error }
}
