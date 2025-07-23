"use client"

import ForgotPasswordFlow from "../components/ForgotPasswordFlow"
import logo from "../../../assets/logo.png"

const ForgotPasswordPage = () => {
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
            Recupera tu acceso a la
            <br />
            <span className="text-[#1F384C]">Plataforma Wordzy</span>
          </h1>

          <p className="text-[#64748B] text-lg">
            No te preocupes, es normal olvidar las contraseñas. Te ayudaremos a recuperar el acceso a tu cuenta de forma
            segura.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-0 bg-white">
        <ForgotPasswordFlow />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
