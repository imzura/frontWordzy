"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import EvaluationForm from "../components/EvaluationForm"
import usePostEvaluation from "../hooks/usePostEvaluation"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import UserMenu from "../../../shared/components/userMenu"

const CreateEvaluationPage = () => {
  const navigate = useNavigate()
  const { createEvaluation, loading, error } = usePostEvaluation()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      await createEvaluation(formData)
      setIsSuccessModalOpen(true)
    } catch (err) {
      console.error("Error al crear la evaluación:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate("/programacion/evaluaciones")
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
    navigate("/programacion/evaluaciones")
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Evaluaciones</h1>
          <UserMenu />
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6">
        <div className="max-w-full mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">Error: {error}</div>
          )}

          {/* Loading Overlay mejorado */}
          {(loading || isSubmitting) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#46ae69] mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-[#1f384c] mb-3">
                  {isSubmitting ? "Creando Evaluación" : "Cargando"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isSubmitting
                    ? "Estamos procesando los archivos y guardando la evaluación. Este proceso puede tomar unos momentos."
                    : "Preparando el formulario..."}
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-[#46ae69] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#46ae69] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#46ae69] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <EvaluationForm evaluation={null} onSubmit={handleSubmit} onCancel={handleCancel} isCreating={true} />
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        onConfirm={handleCloseSuccessModal}
        title="Operación Exitosa"
        message="Evaluación creada con éxito."
        confirmText="Aceptar"
        confirmColor="bg-[#46ae69] hover:bg-green-600"
        showButtonCancel={false}
      />
    </div>
  )
}

export default CreateEvaluationPage
