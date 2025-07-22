"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import GenericTable from "../../../shared/components/Table"
import ProgramDetailModal from "./ProgramDetailModal"
import MassiveUpdateModal from "../componentes/MassiveUpdateModal"

// Hooks
import { useGetPrograms } from "../hooks/useGetPrograms"
import UserMenu from "../../../shared/components/userMenu"

const columns = [
  {
  key: "name",
  label: "Nombre",
  render: (item) => (
    <div className="whitespace-normal break-words max-w-xs">{item.name}</div>
  ),
},

  { key: "code", label: "Código" },
  {
    key: "fk_level",
    label: "Nivel",
    render: (item) => {
      const levelMap = {
        TECNICO: "Técnico",
        TECNÓLOGO: "Tecnólogo",
        ESPECIALIZACION: "Especialización",
        AUXILIAR: "Auxiliar",
        OPERARIO: "Operario",
      }
      return levelMap[item.fk_level] || item.fk_level
    },
  },
  {
    key: "fk_modality",
    label: "Modalidad",
    render: (item) => {
      const modalityMap = {
        PRESENCIAL: "Presencial",
        "A DISTANCIA": "A Distancia",
        VIRTUAL: "Virtual",
        COMBINADO: "Combinado",
      }
      return modalityMap[item.fk_modality] || item.fk_modality
    },
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {item.status ? "Activo" : "Inactivo"}
      </span>
    ),
  },
]

export default function Programs() {
  // Estados principales
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showMassiveUpdateModal, setShowMassiveUpdateModal] = useState(false)

  // Hooks de datos
  const { programs, loading, error, refetch } = useGetPrograms()

  // Handlers de modales
  const handleShowProgram = (program) => {
    setSelectedProgram(program)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedProgram(null)
  }

  const handleMassiveUpdate = () => {
    setShowMassiveUpdateModal(true)
  }

  const handleMassiveUpdateComplete = (results) => {
    console.log("Actualización masiva completada:", results)
    // Refrescar la lista de programas
    refetch()
  }

  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando programas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Programas</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Mostrar errores si los hay */}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        {/* Botón de Actualización Masiva */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleMassiveUpdate}
            className="flex items-center gap-2 bg-[#1f384c] text-white px-4 py-2 rounded-lg hover:bg-[#2a4a5e] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualización Masiva
          </button>
        </div>

        <GenericTable
          data={programs}
          columns={columns}
          onShow={handleShowProgram}
          title="LISTA DE PROGRAMAS"
          showActions={{ show: true, edit: false, delete: false, add: false }}
          tooltipText="Ver detalle del programa"
        />

        {/* Modal de detalle del programa */}
        {selectedProgram && (
          <ProgramDetailModal program={selectedProgram} isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} />
        )}

        {/* Modal de actualización masiva */}
        <MassiveUpdateModal
          isOpen={showMassiveUpdateModal}
          onClose={() => setShowMassiveUpdateModal(false)}
          onComplete={handleMassiveUpdateComplete}
        />
      </div>
    </div>
  )
}
