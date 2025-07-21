"use client"

import { useState, useEffect } from "react"
import { getRankingMetrics, getFichasByPrograma, getProgramasByFicha } from "../services/rankingService"

export const useGetRankingMetrics = () => {
  const [metrics, setMetrics] = useState({ aprendices: 0, fichas: 0, programas: 0 })
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [fichas, setFichas] = useState([])
  const [programas, setProgramas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [allStudents, setAllStudents] = useState([]) // Guardar todos los estudiantes para filtros

  const fetchRankingMetrics = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🚀 useGetRankingMetrics: Starting fetch...")

      const response = await getRankingMetrics()

      if (response.success) {
        console.log("✅ useGetRankingMetrics: Data received successfully")
        console.log("📊 Metrics:", response.data)
        console.log("👥 Students received:", response.students?.length || 0)
        console.log("🏫 Fichas received:", response.fichas?.length || 0)
        console.log("📚 Programas received:", response.programas?.length || 0)

        setMetrics(response.data)
        setCourses(response.fichas || []) // Para compatibilidad
        setStudents(response.students || [])
        setPrograms(response.programas || []) // Para compatibilidad
        setFichas(response.fichas || [])
        setProgramas(response.programas || [])
        setAllStudents(response.students || []) // Guardar todos los estudiantes
      } else {
        throw new Error(response.message || "Error al obtener métricas del ranking")
      }
    } catch (err) {
      console.error("❌ useGetRankingMetrics error:", err)
      setError(err.message || "Error al cargar las métricas del ranking")

      // Establecer datos de prueba si hay error
      console.log("🔧 Setting test data due to API error...")
      const testStudents = [
        {
          nombre: "ADRIANA",
          apellido: "GOMEZ",
          puntos: 200,
          ficha: ["2875155"],
          programa: "COORDINACION DE SERVICIOS HOTELEROS",
          tipoUsuario: "aprendiz",
        },
        {
          nombre: "ALBA NURIS",
          apellido: "MORALES",
          puntos: 195,
          ficha: ["2875156"],
          programa: "ADSO",
          tipoUsuario: "aprendiz",
        },
        {
          nombre: "ALEJANDRA",
          apellido: "BOTERO",
          puntos: 190,
          ficha: ["2875155"],
          programa: "COORDINACION DE SERVICIOS HOTELEROS",
          tipoUsuario: "aprendiz",
        },
      ]

      setMetrics({ aprendices: testStudents.length, fichas: 2, programas: 2 })
      setFichas([
        { id: "2875155", name: "Ficha 2875155", code: "2875155" },
        { id: "2875156", name: "Ficha 2875156", code: "2875156" },
      ])
      setProgramas([
        { id: "COORDINACION DE SERVICIOS HOTELEROS", name: "COORDINACION DE SERVICIOS HOTELEROS" },
        { id: "ADSO", name: "ADSO" },
      ])
      setStudents(testStudents)
      setAllStudents(testStudents)
      setCourses([
        { id: "2875155", name: "Ficha 2875155", code: "2875155" },
        { id: "2875156", name: "Ficha 2875156", code: "2875156" },
      ])
      setPrograms([
        { id: "COORDINACION DE SERVICIOS HOTELEROS", name: "COORDINACION DE SERVICIOS HOTELEROS" },
        { id: "ADSO", name: "ADSO" },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar fichas basado en programa seleccionado
  const updateFichasByPrograma = (programa) => {
    if (!programa) {
      setFichas(getUniqueFichas(allStudents))
      setCourses(getUniqueFichas(allStudents))
    } else {
      const fichasRelacionadas = getFichasByPrograma(allStudents, programa)
      setFichas(fichasRelacionadas)
      setCourses(fichasRelacionadas)
    }
  }

  // Función para actualizar programas basado en ficha seleccionada
  const updateProgramasByFicha = (ficha) => {
    if (!ficha) {
      setProgramas(getUniqueProgramas(allStudents))
      setPrograms(getUniqueProgramas(allStudents))
    } else {
      const programasRelacionados = getProgramasByFicha(allStudents, ficha)
      setProgramas(programasRelacionados)
      setPrograms(programasRelacionados)
    }
  }

  // Función helper para obtener fichas únicas
  const getUniqueFichas = (students) => {
    const uniqueFichas = new Set()
    students.forEach((student) => {
      if (student.ficha && Array.isArray(student.ficha)) {
        student.ficha.forEach((f) => uniqueFichas.add(f))
      }
    })
    return Array.from(uniqueFichas)
      .sort()
      .map((ficha) => ({
        id: ficha,
        name: `Ficha ${ficha}`,
        code: ficha,
      }))
  }

  // Función helper para obtener programas únicos
  const getUniqueProgramas = (students) => {
    const uniqueProgramas = new Set()
    students.forEach((student) => {
      if (student.programa) {
        uniqueProgramas.add(student.programa)
      }
    })
    return Array.from(uniqueProgramas)
      .sort()
      .map((programa) => ({
        id: programa,
        name: programa,
        code: programa.replace(/\s+/g, "_").toUpperCase(),
      }))
  }

  useEffect(() => {
    fetchRankingMetrics()
  }, [])

  return {
    metrics,
    courses,
    students,
    programs,
    fichas,
    programas,
    allStudents,
    loading,
    error,
    refetch: fetchRankingMetrics,
    updateFichasByPrograma,
    updateProgramasByFicha,
  }
}
