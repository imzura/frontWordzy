"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import RequestEmailStep from "./RequestEmailStep"
import VerifyCodeStep from "./VerifyCodeStep"
import ResetPasswordStep from "./ResetPasswordStep"
import SuccessStep from "./SuccessStep"

const ForgotPasswordFlow = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const navigate = useNavigate()

  const handleEmailSubmit = (submittedEmail) => {
    setEmail(submittedEmail)
    setCurrentStep(2)
  }

  const handleCodeVerified = (code) => {
    setVerificationCode(code)
    setCurrentStep(3)
  }

  const handlePasswordReset = () => {
    setCurrentStep(4)
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RequestEmailStep onEmailSubmit={handleEmailSubmit} onBackToLogin={handleBackToLogin} />
      case 2:
        return <VerifyCodeStep email={email} onCodeVerified={handleCodeVerified} onGoBack={handleGoBack} />
      case 3:
        return (
          <ResetPasswordStep
            email={email}
            code={verificationCode}
            onPasswordReset={handlePasswordReset}
            onGoBack={handleGoBack}
          />
        )
      case 4:
        return <SuccessStep onBackToLogin={handleBackToLogin} />
      default:
        return null
    }
  }

  return <div className="w-full max-w-md">{renderStep()}</div>
}

export default ForgotPasswordFlow
