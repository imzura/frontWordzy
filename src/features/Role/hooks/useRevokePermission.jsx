"use client"

import { useState } from "react"

export function useRevokePermission() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const revokePermission = async (permissionData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3000/api/permission/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al revocar el permiso")
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { revokePermission, loading, error }
}
