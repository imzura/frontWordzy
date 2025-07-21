"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../../shared/contexts/AuthContext"
import { loginUser } from "../services/authService"

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }

  const { user, setUser } = context
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [setUser])

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const userData = await loginUser(credentials)
      setUser(userData)

      // Guardar en localStorage si rememberMe está activado
      if (credentials.rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData))
      }

      return userData
    } catch (err) {
      setError(err.message || "Error de autenticación")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  }
}
