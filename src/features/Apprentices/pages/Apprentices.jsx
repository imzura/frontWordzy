"use client"

import { useState, useEffect } from "react"
import ApprenticeDetailModal from "./ApprenticeDetailModal"
import ApprenticeProgressModal from "./ApprenticeProgressModal"
import useGetApprentices from "../hooks/useGetApprentices"
import MassiveUpdateModal from "../components/MassiveUpdateModal"
import UserMenu from "../../../shared/components/userMenu"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import ProtectedAction from "../../../shared/components/ProtectedAction"

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "tipoDocumento", label: "Tipo Documento" },
  { key: "documento", label: "Documento" },
  { key: "ficha", label: "Ficha", render: (item) => (Array.isArray(item.ficha) ? item.ficha.join(", ") : item.ficha) },
  {
    key: "estado",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === "En formación"
            ? "bg-green-100 text-green-800"
            : item.estado === "Condicionado"
              ? "bg-yellow-100 text-yellow-800"
              : item.estado === "Graduado"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
        }`}
      >
        {item.estado}
      </span>
    ),
  },
]

const Apprentices = () => {
  const [selectedApprentice, setSelectedApprentice] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [showMassiveUpdateModal, setShowMassiveUpdateModal] = useState(false) // Inicializado explícitamente en false
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Solo hook para obtener datos
  const { apprentices, loading, error, refetch } = useGetApprentices()

  // Debug: Log del estado del modal
  useEffect(() => {
    console.log("🔍 Estado showMassiveUpdateModal:", showMassiveUpdateModal)
  }, [showMassiveUpdateModal])

  const handleShowApprentice = (apprentice) => {
    setSelectedApprentice(apprentice)
    setIsDetailModalOpen(true)
    setIsProgressModalOpen(false)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedApprentice(null)
  }

  const handleShowProgress = () => {
    setIsDetailModalOpen(false)
    setIsProgressModalOpen(true)
  }

  const handleCloseProgressModal = () => {
    setIsProgressModalOpen(false)
    setIsDetailModalOpen(true)
  }

  const handleMassiveUpdate = () => {
    console.log("🚀 Abriendo modal de actualización masiva")
    setShowMassiveUpdateModal(true)
  }

  const handleMassiveUpdateComplete = async (results) => {
    console.log("📊 Actualización masiva completada:", results)

    try {
      setIsRefreshing(true)
      console.log("🔄 Refrescando lista de aprendices...")

      // Delay para asegurar que los datos se hayan guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await refetch()
      console.log("✅ Lista refrescada exitosamente")

      // Delay adicional para mostrar el loading
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("❌ Error al refrescar lista:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleMassiveUpdateModalClose = () => {
    console.log("🔒 Cerrando modal de actualización masiva desde componente padre")
    setShowMassiveUpdateModal(false)
  }

  // Mostrar loading
  if (loading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isRefreshing ? "Actualizando lista de aprendices..." : "Cargando aprendices..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Aprendices</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Mostrar errores si los hay */}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <ProtectedTable
            data={apprentices}
            columns={columns}
            module="Aprendices" // Nombre del módulo para verificar permisos
            onShow={handleShowApprentice}
            showActions={{ show: true, massiveUpdate: true, edit: false, delete: false, add: false }}
            tooltipText="Ver detalle del aprendiz"
            onMassiveUpdate={handleMassiveUpdate}
            massiveUpdate={{ enabled: true, buttonText: "Actualización Masiva" }}
        />

        {/* Modales protegidos - Modal de detalle del aprendiz */}
        <ProtectedAction module="Aprendices" privilege="read">
        {selectedApprentice && (
          <>
            <ApprenticeDetailModal
              apprentice={selectedApprentice}
              isOpen={isDetailModalOpen}
              onClose={handleCloseDetailModal}
              onShowProgress={handleShowProgress}
            />

            <ApprenticeProgressModal
              isOpen={isProgressModalOpen}
              onClose={handleCloseProgressModal}
              progressData={selectedApprentice.progresoNiveles}
            />
          </>
        )}
        </ProtectedAction>

        {/* Modal de actualización masiva */}
        <ProtectedAction module="Aprendices" privilege="update">
        <MassiveUpdateModal
          isOpen={showMassiveUpdateModal}
          onClose={handleMassiveUpdateModalClose}
          onComplete={handleMassiveUpdateComplete}
        />
        </ProtectedAction>
      </div>
    </div>
  )
}

export default Apprentices
