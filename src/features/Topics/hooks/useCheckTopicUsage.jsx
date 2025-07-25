"use client"

import { useState } from "react"
import { fetchWithAutoRenew } from "../../../shared/utils/authHeader"

// ✅ NUEVO HOOK: Para verificar si un tema está en uso antes de intentar eliminarlo
function useCheckTopicUsage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkTopicUsage = async (topicId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchWithAutoRenew(`http://localhost:3000/api/topic/${topicId}/usage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al verificar el uso del tema")
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { checkTopicUsage, loading, error }
}

export { useCheckTopicUsage }