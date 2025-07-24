"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../../../shared/contexts/AuthContext"
import { loginUser } from "../services/authService"

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }

  const {
    user,
    login: contextLogin,
    logout: contextLogout,
    isAuthenticated,
    isAuthResolved,
  } = context

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await loginUser(credentials)
      if (!userData.token) {
        throw new Error("Error de autenticación: No se recibió token")
      }
      contextLogin(userData)
      return userData
    } catch (err) {
      setError(err.message || "Error de autenticación")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    contextLogout()
  }

  return {
    user,
    isAuthenticated,
    isAuthResolved,
    isLoading,
    error,
    login,
    logout,
  }
}
