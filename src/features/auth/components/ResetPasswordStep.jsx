"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { resetPassword } from "../services/passwordResetService"
import { useNavigate } from "react-router-dom"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"

const ResetPasswordStep = ({ email, code, onPasswordReset, onGoBack }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showExpirationModal, setShowExpirationModal] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validatePasswords = () => {
    if (formData.newPassword.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return "Las contraseñas no coinciden"
    }
    return null
  }

  const handleExpirationConfirm = () => {
    setShowExpirationModal(false)
    navigate("/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validatePasswords()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await resetPassword(email, code, formData.newPassword, formData.confirmPassword)
      onPasswordReset()
    } catch (err) {
      // Verificar si el error es por código expirado
      if (err.message.includes("expirado") || err.message.includes("inválido")) {
        setShowExpirationModal(true)
        return
      }
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F384C] mb-2">Nueva contraseña</h2>
          <p className="text-gray-600">Crea una nueva contraseña segura para tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirma tu nueva contraseña"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Requisitos de la contraseña:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? "bg-green-500" : "bg-gray-300"}`}
                ></span>
                <span>Al menos 6 caracteres</span>
              </li>
              <li className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${formData.newPassword === formData.confirmPassword && formData.newPassword ? "bg-green-500" : "bg-gray-300"}`}
                ></span>
                <span>Las contraseñas deben coincidir</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
              className="w-full py-3 px-4 bg-[#1F384C] text-white rounded-lg font-semibold text-base hover:bg-[#162A3A] focus:outline-none focus:ring-2 focus:ring-[#1F384C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Cambiando contraseña...</span>
                </div>
              ) : (
                "Cambiar contraseña"
              )}
            </button>

            <button
              type="button"
              onClick={onGoBack}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold text-base hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal de código expirado */}
      <ConfirmationModal
        isOpen={showExpirationModal}
        onClose={() => setShowExpirationModal(false)}
        onConfirm={handleExpirationConfirm}
        title="Código de recuperación expirado"
        message="El tiempo para cambiar tu contraseña ha expirado. Por favor, inicia el proceso de recuperación nuevamente."
        confirmText="Ir al inicio de sesión"
        confirmColor="bg-[#1F384C] hover:bg-[#162A3A]"
        showButtonCancel={false}
      />
    </>
  )
}

export default ResetPasswordStep
