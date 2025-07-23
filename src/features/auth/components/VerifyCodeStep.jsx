"use client"

import { useState, useRef, useEffect } from "react"
import { Shield, ArrowLeft, Loader2, RefreshCw } from "lucide-react"
import { verifyResetCode, requestPasswordReset } from "../services/passwordResetService"

const VerifyCodeStep = ({ email, onCodeVerified, onGoBack }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos en segundos
  const inputRefs = useRef([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newCode = [...code]

    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedText[i] || ""
    }

    setCode(newCode)

    // Enfocar el último input lleno o el siguiente vacío
    const lastFilledIndex = pastedText.length - 1
    const nextEmptyIndex = Math.min(pastedText.length, 5)
    inputRefs.current[nextEmptyIndex]?.focus()
  }

  const handleInputChange = (index, value) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fullCode = code.join("")

    if (fullCode.length !== 6) {
      setError("Por favor ingresa el código completo")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await verifyResetCode(email, fullCode)
      onCodeVerified(fullCode)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError("")

    try {
      await requestPasswordReset(email)
      setTimeLeft(600) // Reset timer
      setCode(["", "", "", "", "", ""]) // Clear code
    } catch (err) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-50">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F384C] mb-2">Verificar código</h2>
        <p className="text-gray-600 mb-2">Hemos enviado un código de 6 dígitos a:</p>
        <p className="text-[#1F384C] font-semibold">{email}</p>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500">
          El código expira en: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Código de verificación</label>
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>
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

        {/* Resend Code */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || timeLeft > 540} // Disable for first 1 minute
            className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-1 mx-auto"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reenviando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Reenviar código</span>
              </>
            )}
          </button>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || code.join("").length !== 6}
            className="w-full py-3 px-4 bg-[#1F384C] text-white rounded-lg font-semibold text-base hover:bg-[#162A3A] focus:outline-none focus:ring-2 focus:ring-[#1F384C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : (
              "Verificar código"
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
  )
}

export default VerifyCodeStep
