
"use client"

import { useState } from "react"
import CourseDetailModal from "./CourseDetailModal"
import MassiveUpdateModal from "../componentes/MassiveUpdateModal"

// Hooks
import { useGetCourses } from "../hooks/useGetCourses"
import UserMenu from "../../../shared/components/userMenu"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import { formatDate } from "../../../shared/utils/dateFormatter"
import ProtectedAction from "../../../shared/components/ProtectedAction"

const columns = [
  { key: "code", label: "Código" },
  {
  key: "fk_programs",
  label: "Programa",
  render: (item) => (
    <div className="whitespace-normal break-words max-w-md">{item.fk_programs}</div>
  ),
  width: "20%",
},
{
  key: "area",
  label: "Área",
  render: (item) => (
    <div className="whitespace-normal break-words max-w-md">{item.area}</div>
  ),
},

  {
    key: "offer_type",
    label: "Tipo de Oferta",
    render: (item) => {
      const typeMap = {
        ABIERTA: "Abierta",
        CERRADA: "Cerrada",
        ESPECIAL: "Especial",
      }
      return typeMap[item.offer_type] || item.offer_type
    },
  },
  {
    key: "start_date",
    label: "Fecha Inicio",
    render: (item) => formatDate(item.start_date),
  },
  {
    key: "end_date",
    label: "Fecha Fin",
    render: (item) => formatDate(item.end_date),
  },
  {
    key: "course_status",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.course_status === "EN EJECUCION"
            ? "bg-green-100 text-green-800"
            : item.course_status === "TERMINADO"
              ? "bg-blue-100 text-blue-800"
              : item.course_status === "SUSPENDIDO"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
        }`}
      >
        {item.course_status}
      </span>
    ),
  },
]

export default function Courses() {
  // Estados principales
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showMassiveUpdateModal, setShowMassiveUpdateModal] = useState(false)

  // Hooks de datos
  const { courses, loading, error, refetch } = useGetCourses()

  // Handlers de modales
  const handleShowCourse = (course) => {
    setSelectedCourse(course)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedCourse(null)
  }

  const handleMassiveUpdate = () => {
    setShowMassiveUpdateModal(true)
  }

  const handleMassiveUpdateComplete = (results) => {
    console.log("Actualización masiva completada:", results)
    // Refrescar la lista de cursos
    refetch()
  }

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Fichas</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Mostrar errores si los hay */}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <ProtectedTable
            data={courses}
            columns={columns}
            module="Fichas" // Nombre del módulo para verificar permisos
            onShow={handleShowCourse}
            showActions={{ show: true, massiveUpdate: true, edit: false, delete: false, add: false }}
            tooltipText="Ver detalle de la ficha"
            onMassiveUpdate={handleMassiveUpdate}
            massiveUpdate={{ enabled: true, buttonText: "Actualización Masiva" }}
        />

        <ProtectedAction module="Fichas" privilege="read">
        {/* Modal de detalle del curso */}
        {selectedCourse && (
          <CourseDetailModal course={selectedCourse} isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} />
        )}
        </ProtectedAction>

        <ProtectedAction module="Fichas" privilege="update">
        {/* Modal de actualización masiva */}
        <MassiveUpdateModal
          isOpen={showMassiveUpdateModal}
          onClose={() => setShowMassiveUpdateModal(false)}
          onComplete={handleMassiveUpdateComplete}
        />
        </ProtectedAction>
      </div>
    </div>
  )
}
