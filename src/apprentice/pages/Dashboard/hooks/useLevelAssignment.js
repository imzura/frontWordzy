"use client"

import { useState, useEffect } from "react"

export const useLevelAssignment = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLevelAssignment = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3000/api/level-assignment")

        if (!response.ok) {
          throw new Error("Error al obtener las asignaciones de nivel")
        }

        const data = await response.json()
        setAssignments(data.assignments)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchLevelAssignment()
  }, [])

  const getAssignmentByCourseCode = (courseCode) => {
    return assignments.find((assignment) => assignment.courseCode === courseCode)
  }

  return { assignments, loading, error, getAssignmentByCourseCode }
}
