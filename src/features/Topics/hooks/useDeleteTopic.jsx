"use client"

import { useState } from "react"
import { fetchWithAutoRenew } from "../../../shared/utils/authHeader";

function useDeleteTopic() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteTopic = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithAutoRenew(`http://localhost:3000/api/topic/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // ✅ MEJORADO: Manejo específico de errores de validación
        if (response.status === 400 && data.usedInPrograms) {
          // Error específico cuando el tema está en uso
          throw new Error(data.message)
        }
        throw new Error(data.message || "Error al eliminar el tema")
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteTopic, loading, error }
}

export { useDeleteTopic }