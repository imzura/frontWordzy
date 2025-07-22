"use client"

import { useState } from "react"
import { User, Eye, EyeOff, Lock } from "lucide-react"

const LoginForm = ({ onLoginSuccess, login }) => {
  const [formData, setFormData] = useState({
    document: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Enviando formulario con datos:", formData)
      const userData = await login(formData)
      console.log("Login exitoso, llamando a onLoginSuccess con:", userData)

      // Verificar que el token existe antes de continuar
      if (!userData.token) {
        throw new Error("No se recibió token de autenticación")
      }

      onLoginSuccess(userData)
    } catch (err) {
      console.error("Error en handleSubmit:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    alert("Funcionalidad de recuperación de contraseña próximamente")
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Número de Documento */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              name="document"
              type="text"
              value={formData.document}
              onChange={handleChange}
              placeholder="Ingrese su número de documento"
              className="w-full pl-10 pr-4 py-3
                         border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-base text-gray-900
                         placeholder:text-gray-400
                         hover:border-gray-400 transition-colors"
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              className="w-full pl-10 pr-12 py-3
                         border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-base text-gray-900
                         placeholder:text-gray-400
                         hover:border-gray-400 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-gray-400 hover:text-gray-600 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4
                     bg-[#1F384C] text-white rounded-lg font-semibold text-base
                     hover:bg-[#162A3A] active:bg-[#0F1F2A]
                     focus:outline-none focus:ring-2 focus:ring-[#1F384C] focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1F384C]
                     transition-all duration-200
                     transform hover:scale-[1.02] active:scale-[0.98]
                     shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Verificando documento...</span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
