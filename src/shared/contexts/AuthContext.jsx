"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("wordzy_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        if (userData.token) {
          setUser(userData)
        } else {
          localStorage.removeItem("wordzy_user")
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("wordzy_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    if (!userData || !userData.token) {
      return
    }

    const userWithToken = {
      ...userData,
      token: userData.token,
    }

    setUser(userWithToken)
    localStorage.setItem("wordzy_user", JSON.stringify(userWithToken))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wordzy_user")
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem("wordzy_user", JSON.stringify(updatedUser))
  }

  const value = {
    user,
    setUser,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user?.token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
