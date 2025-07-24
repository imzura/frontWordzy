"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthResolved, setIsAuthResolved] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("wordzy_user")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        console.log("Los datops del usuario son:", userData)
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
    setIsAuthResolved(true)
  }, [])

  const login = (userData) => {
    if (!userData || !userData.token) return

    const userWithToken = { ...userData, token: userData.token }
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
    isAuthenticated: !!user?.token,
    isAuthResolved,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
