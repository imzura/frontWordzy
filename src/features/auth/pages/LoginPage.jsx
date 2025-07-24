"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoginForm from "../components/LoginForm"
import logo from "../../../assets/logo.png"

const LoginPage = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // 🆕 Función para obtener la ruta por defecto según el rol
  const getDefaultRouteByRole = (userRole) => {
    const normalizedRole = typeof userRole === "string" ? userRole.toLowerCase() : userRole?.name?.toLowerCase()

    switch (normalizedRole) {
      case "aprendiz":
        return "/apprentice/dashboard" // 🔄 Dashboard para aprendices
      case "administrador":
        return "/dashboard"
      case "instructor":
        return "/dashboard"
      default:
        return "/dashboard"
    }
  }

  const handleLoginSuccess = (userData) => {
    setIsSuccess(true)

    // Obtener la ruta por defecto según el rol
    const defaultRoute = getDefaultRouteByRole(userData.role)

    // Show success alert with improved styling and animation
    const alert = document.createElement("div")
    alert.className =
      "fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-white border border-green-200 rounded-xl shadow-lg z-50 transform transition-all duration-300 ease-out translate-y-[-100%] opacity-0"
    alert.innerHTML = `
      <div class="flex items-center p-4">
        <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div class="ml-4">
          <p class="font-medium text-gray-800">¡Inicio de sesión exitoso!</p>
          <p class="text-sm text-gray-500">Bienvenido ${userData.role}...</p>
        </div>
      </div>
    `
    document.body.appendChild(alert)

    // Trigger animation
    setTimeout(() => {
      alert.style.transform = "translateY(0)"
      alert.style.opacity = "1"
    }, 100)

    // Remove alert and navigate to role-specific route
    setTimeout(() => {
      alert.style.transform = "translateY(-100%)"
      alert.style.opacity = "0"
      setTimeout(() => {
        alert.remove()
        // 🆕 Usar replace para evitar volver al login
        navigate(defaultRoute, { replace: true })
      }, 300)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-40 lg:h-48 w-auto mx-auto" />
          </div>

          {/* Welcome Text */}
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a la
            <br />
            <span className="text-[#1F384C]">plataforma Wordzy</span>
          </h1>

          <p className="text-[#64748B] text-1lg">
            Mejora tu inglés con contenido personalizado, seguimiento de avances y retroalimentación para reforzar tus
            habilidades.
          </p>
        </div>
      </div>

      {/* Right Section - With animation */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-0 bg-white">
        {!isSuccess ? (
          <div
            className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-50 
            animate-[fadeIn_0.5s_ease-out] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-shadow duration-300"
          >
            <h2 className="text-xl lg:text-2xl font-bold text-[#1F384C] mb-6 text-center">Inicio de Sesión</h2>

            <LoginForm onLoginSuccess={handleLoginSuccess} login={login} />
          </div>
        ) : (
          <div className="text-center p-4 animate-[fadeIn_0.5s_ease-out] bg-white">
            <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-16 w-auto mx-auto" />
            <h2 className="mt-6 text-xl lg:text-2xl font-semibold text-green-600">¡Inicio de sesión exitoso!</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
