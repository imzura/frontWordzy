"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProgrammingDetails from "./programming-details"
import { useGetCourseProgrammingById } from "../../hooks/useGetCourseProgrammingById"
import EvaluationDetailModal from "../../../Evaluations/components/EvaluationDetailModal"
import SupportMaterialDetailModal from "../../../SupportMaterials/componentes/SupportMaterialDetailModal"
import UserMenu from "../../../../shared/components/userMenu"

export default function CourseProgrammingDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { programming, loading: isLoading } = useGetCourseProgrammingById(id)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState(null)

  const handleShowEvaluationDetail = (evaluation) => {
    setSelectedDetail(evaluation)
    setShowDetailModal(true)
  }

  // Para mostrar el detalle
  const handleView = (material) => {
    setSelectedMaterial(material)
    setShowDetail(true)
  }

  const handleBackClick = () => {
    navigate("/programacion/programacionCursos")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!programming) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Programación no encontrada</h2>
        <button onClick={handleBackClick} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Volver al listado
        </button>
      </div>
    )
  }

  const adaptedProgramming = {
    nombre: programming.programId.name,
    estado: programming.status ? "Activo" : "Inactivo",
    fechaInicio: new Date(programming.startDate).toLocaleDateString(),
    fechaFin: programming.endDate ? new Date(programming.endDate).toLocaleDateString() : null,
    levels: (programming.levels || []).map((level) => ({
      ...level,
      id: level._id,
      themes: (level.topics || []).map((topic) => ({
        id: topic._id,
        selectedTheme: topic.topicId, // ya poblado
        progress: topic.value,
        activities: [
          ...(topic.activities || []).map((act) => ({
            id: act._id,
            value: act.value,
            type: "Actividades",
            evaluationId: act.evaluationId,
            onDetail: () => handleShowEvaluationDetail(act.evaluationId),
            name: act.name || act.evaluationId?.nombre, // Asegurar que el nombre esté disponible
          })),
          ...(topic.exams || []).map((exam) => ({
            id: exam._id,
            value: exam.value,
            type: "Exámenes",
            evaluationId: exam.evaluationId,
            onDetail: () => handleShowEvaluationDetail(exam.evaluationId),
            name: exam.name || exam.evaluationId?.nombre, // Asegurar que el nombre esté disponible
          })),
          ...(topic.materials || []).map((mat) => ({
            id: mat._id,
            value: "-",
            type: "Material",
            materialId: mat.materialId,
            onDetail: () => handleView(mat.materialId),
            name: mat.name || mat.materialId?.titulo, // Asegurar que el nombre esté disponible
          })),
        ],
      })),
    })),
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Programación de Cursos</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        <ProgrammingDetails programming={adaptedProgramming} />

        <EvaluationDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          evaluation={selectedDetail}
        />

        <SupportMaterialDetailModal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          material={selectedMaterial}
        />
      </div>
    </div>
  )
}
