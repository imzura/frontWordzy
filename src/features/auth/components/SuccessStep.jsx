"use client"

import { CheckCircle, LogIn } from "lucide-react"

const SuccessStep = ({ onBackToLogin }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-gray-50">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F384C] mb-4">¡Contraseña actualizada!</h2>
        <p className="text-gray-600 text-lg">Tu contraseña ha sido cambiada exitosamente.</p>
      </div>

      {/* Success Animation */}
      <div className="flex justify-center mb-8">
        <div className="animate-bounce">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onBackToLogin}
        className="w-full py-4 px-4 bg-[#1F384C] text-white rounded-lg font-semibold text-base hover:bg-[#162A3A] focus:outline-none focus:ring-2 focus:ring-[#1F384C] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <LogIn className="w-5 h-5" />
        <span>Ir al inicio de sesión</span>
      </button>
    </div>
  )
}

export default SuccessStep
