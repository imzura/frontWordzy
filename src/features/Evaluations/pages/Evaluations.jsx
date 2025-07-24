"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import EvaluationDetailModal from "../components/EvaluationDetailModal"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"

// Importar los hooks y el nuevo servicio
import useGetEvaluations from "../hooks/useGetEvaluations"
import useDeleteEvaluation from "../hooks/useDeleteEvaluation"
import { normalizeEvaluations } from "../services/evaluationService"
import { isEvaluationInUse } from "../services/courseProgrammingService"
import UserMenu from "../../../shared/components/userMenu"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import ProtectedAction from "../../../shared/components/ProtectedAction"

const columns = [
  { key: "nombre", label: "Nombre" },
  {
    key: "tematica",
    label: "Temática",
    render: (item) => <span className="text-[14px] capitalize">{item.tematica || "No especificada"}</span>,
  },
  {
    key: "tipoEvaluacion",
    label: "Tipo Evaluación",
    render: (item) => <span className="text-[14px] text-gray-700">{item.tipoEvaluacion}</span>,
  },
  {
    key: "estado",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {item.estado}
      </span>
    ),
  },
]

const Evaluations = () => {
  const navigate = useNavigate()

  const { evaluations: rawEvaluations, loading: fetchLoading, error: fetchError, refetch } = useGetEvaluations()
  const { deleteEvaluation, loading: deleteLoading, error: deleteError } = useDeleteEvaluation()

  const evaluationsData = normalizeEvaluations(rawEvaluations)

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isInUseModalOpen, setIsInUseModalOpen] = useState(false) // Nuevo estado para la alerta
  const [successMessage, setSuccessMessage] = useState("")
  const [successTitle, setSuccessTitle] = useState("")
  const [currentEvaluation, setCurrentEvaluation] = useState(null)
  const [evaluationToDelete, setEvaluationToDelete] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setIsLoading(fetchLoading || deleteLoading)
  }, [fetchLoading, deleteLoading])

  useEffect(() => {
    const error = fetchError || deleteError
    setErrorMessage(error ? `Error: ${error}` : "")
  }, [fetchError, deleteError])

  const handleAddEvaluation = () => {
    navigate("/programacion/evaluaciones/crear")
  }

  const handleEditEvaluation = (evaluation) => {
    navigate(`/programacion/evaluaciones/editar/${evaluation.id}`)
  }

  const handleDeleteEvaluation = async (id) => {
    setIsLoading(true)
    const inUse = await isEvaluationInUse(id)
    setIsLoading(false)

    if (inUse) {
      setIsInUseModalOpen(true)
    } else {
      const evaluation = evaluationsData.find((e) => e.id === id)
      setEvaluationToDelete(evaluation)
      setIsDeleteModalOpen(true)
    }
  }

  const handleShowEvaluation = (evaluation) => {
    setCurrentEvaluation(evaluation)
    setIsDetailModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (evaluationToDelete) {
      try {
        setIsLoading(true)
        setErrorMessage("")

        await deleteEvaluation(evaluationToDelete.id)

        refetch()

        setIsDeleteModalOpen(false)
        setSuccessTitle("Evaluación Eliminada")
        setSuccessMessage("La evaluación ha sido eliminada con éxito")
        setIsSuccessModalOpen(true)
        setEvaluationToDelete(null)
      } catch (error) {
        console.error("Error al eliminar la evaluación:", error)
        setErrorMessage(`Error: ${error.message || "Ocurrió un error al eliminar la evaluación"}`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Evaluaciones</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{errorMessage}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-2">Cargando...</span>
          </div>
        ) : (
          <ProtectedTable
            data={evaluationsData}
            columns={columns}
            module="Evaluaciones" // Nombre del módulo para verificar permisos
            onAdd={handleAddEvaluation}
            onShow={handleShowEvaluation}
            onEdit={handleEditEvaluation}
            onDelete={handleDeleteEvaluation}
            tooltipText="Ver detalle de la evaluación"
        />
        )}
      </div>

      {/* Modales */}
      <ProtectedAction module="Evaluaciones" privilege="read">
      <EvaluationDetailModal
        evaluation={currentEvaluation}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      </ProtectedAction>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Evaluación"
        message={
          evaluationToDelete
            ? `¿Estás seguro de que deseas eliminar la evaluación "${evaluationToDelete.nombre}"?`
            : "¿Estás seguro de que deseas eliminar esta evaluación?"
        }
        confirmText="Confirmar Eliminación"
        confirmColor="bg-[#f44144] hover:bg-red-600"
      />

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => setIsSuccessModalOpen(false)}
        title={successTitle}
        message={successMessage}
        confirmText="Cerrar"
        confirmColor="bg-[#46ae69] hover:bg-green-600"
        showButtonCancel={false}
      />

      {/* Nuevo modal de alerta */}
      <ConfirmationModal
        isOpen={isInUseModalOpen}
        onClose={() => setIsInUseModalOpen(false)}
        onConfirm={() => setIsInUseModalOpen(false)}
        title="Acción no permitida"
        message="No se puede eliminar esta evaluación pues se encuentra asociada a una programación."
        confirmText="Cerrar"
        confirmColor="bg-[#f44144] hover:bg-red-600"
        showButtonCancel={false}
      />
    </div>
  )
}

export default Evaluations
