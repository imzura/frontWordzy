"use client"

import { useState, useEffect } from "react"

/**
 * Hook para obtener los detalles de un material de apoyo por su título.
 * @param {string | null} materialTitle - El título del material a buscar. Si es null, no se realiza la búsqueda.
 * @returns {{ material: Object | null, isLoading: boolean, error: string | null }}
 */
const useSupportMaterialDetail = (materialTitle) => {
  const [material, setMaterial] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      if (!materialTitle) {
        setMaterial(null)
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      setMaterial(null) // Limpiar el material anterior

      try {
        const response = await fetch(`http://localhost:3000/api/support-materials`)
        if (!response.ok) {
          throw new Error(`Error al cargar materiales: ${response.statusText}`)
        }
        const result = await response.json()

        if (result.success && result.data && Array.isArray(result.data.materials)) {
          // Busca el material por su propiedad 'titulo' que coincide con 'materialTitle'
          const foundMaterial = result.data.materials.find((m) => m.titulo === materialTitle)

          if (foundMaterial) {
            setMaterial(foundMaterial)
          } else {
            setError(`Material con título "${materialTitle}" no encontrado.`)
            setMaterial({
              _id: "not-found",
              name: "Material no encontrado",
              titulo: "Material no encontrado",
              fecha_creacion: new Date().toISOString(),
              estado: "inactivo",
              contenido: "<p>Lo sentimos, el detalle de este material no está disponible.</p>",
            })
          }
        } else {
          throw new Error("Formato de respuesta de API inesperado.")
        }
      } catch (err) {
        console.error("Error al cargar el detalle del material:", err)
        setError(`Hubo un error al intentar cargar el material: ${err.message}`)
        setMaterial({
          _id: "error",
          name: "Error de carga",
          titulo: "Error al cargar",
          fecha_creacion: new Date().toISOString(),
          estado: "inactivo",
          contenido: `<p>Hubo un error al intentar cargar el material: ${err.message}</p>`,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterialDetail()
  }, [materialTitle]) // Dependencia del título del material

  return { material, isLoading, error }
}

export default useSupportMaterialDetail
