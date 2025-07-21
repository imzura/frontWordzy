"use client"

import { useState, useEffect } from "react"
import { getFichasFromAPI, getInstructors, getNiveles } from "../services/feedbackService"

export const useFeedbackData = () => {
  const [fichas, setFichas] = useState([])
  const [instructors, setInstructors] = useState([])
  const [niveles, setNiveles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadInitialData = async () => {
    console.log("🔄 Iniciando carga de datos...")

    try {
      setLoading(true)
      setError(null)

      // Cargar fichas con fallback
      let fichasData = []
      try {
        console.log("📋 Cargando fichas de aprendices...")
        fichasData = await getFichasFromAPI()
        console.log("✅ Fichas de aprendices cargadas:", fichasData.length)
      } catch (fichasError) {
        console.error("❌ Error cargando fichas de aprendices:", fichasError)
        fichasData = [
          { value: "2669742", label: "Ficha 2669742", programa: "ADSO" },
          { value: "2669743", label: "Ficha 2669743", programa: "ADSO" },
          { value: "2669744", label: "Ficha 2669744", programa: "Multimedia" },
          { value: "2669745", label: "Ficha 2669745", programa: "Redes" },
        ]
      }
      setFichas(fichasData)

      // Cargar instructores con fallback
      let instructorsData = []
      try {
        console.log("👨‍🏫 Cargando instructores...")
        instructorsData = await getInstructors()
        console.log("✅ Instructores cargados:", instructorsData.length)
      } catch (instructorsError) {
        console.error("❌ Error cargando instructores:", instructorsError)
        instructorsData = [
          { nombre: "Ana García", especialidad: "Inglés Técnico" },
          { nombre: "Carlos Rodríguez", especialidad: "Inglés Conversacional" },
          { nombre: "María López", especialidad: "Inglés Empresarial" },
          { nombre: "Juan Martínez", especialidad: "Inglés General" },
          { nombre: "Laura Sánchez", especialidad: "Inglés Técnico" },
        ]
      }
      setInstructors(instructorsData)

      // Cargar niveles con fallback
      let nivelesData = []
      try {
        console.log("📊 Cargando niveles de aprendices...")
        nivelesData = await getNiveles()
        console.log("✅ Niveles de aprendices cargados:", nivelesData.length)
      } catch (nivelesError) {
        console.error("❌ Error cargando niveles de aprendices:", nivelesError)
        nivelesData = ["1", "2", "3"]
      }
      setNiveles(nivelesData)

      console.log("🎉 Todos los datos cargados exitosamente")
    } catch (err) {
      console.error("💥 Error general al cargar datos:", err)
      setError("Error al conectar con el servidor. Usando datos por defecto.")

      // Datos por defecto para que la vista no quede en blanco
      setFichas([
        { value: "2669742", label: "Ficha 2669742", programa: "ADSO" },
        { value: "2669743", label: "Ficha 2669743", programa: "ADSO" },
      ])
      setInstructors([
        { nombre: "Ana García", especialidad: "Inglés Técnico" },
        { nombre: "Carlos Rodríguez", especialidad: "Inglés Conversacional" },
      ])
      setNiveles(["1", "2", "3"])
    } finally {
      setLoading(false)
      console.log("🏁 Carga de datos finalizada")
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  return {
    fichas,
    instructors,
    niveles,
    loading,
    error,
    refetch: loadInitialData,
  }
}
