"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import InstructorDetailModal from "./InstructorDetailModal"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import useGetInstructors from "../hooks/useGetInstructors"
import useDeleteInstructor from "../hooks/useDeleteInstructor"
import UserMenu from "../../../shared/components/userMenu"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import ProtectedAction from "../../../shared/components/ProtectedAction"

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "tipoDocumento", label: "Tipo Documento" },
  { key: "documento", label: "Documento" },
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

const InstructorsPage = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFichasAlert, setShowFichasAlert] = useState(false)
  const [instructorToDelete, setInstructorToDelete] = useState(null)
  const navigate = useNavigate()

  // Hooks para API
  const { instructors, loading, error, refetch } = useGetInstructors()
  const { deleteInstructor, loading: deleting } = useDeleteInstructor()

  const handleShowInstructor = (instructor) => {
    setSelectedInstructor(instructor)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
  }

  const handleCreateInstructor = () => {
    navigate("/formacion/instructores/crear")
  }

  const handleEditInstructor = (instructor) => {
    const instructorId = instructor._id || instructor.id
    navigate(`/formacion/instructores/editar/${instructorId}`)
  }

  const handleDeleteInstructor = (instructorData) => {
    console.log("Datos recibidos para eliminar:", instructorData)

    let instructorToDelete
    if (typeof instructorData === "string") {
      instructorToDelete = instructors.find((inst) => inst._id === instructorData || inst.id === instructorData)
      console.log("Instructor encontrado por ID:", instructorToDelete)
    } else {
      instructorToDelete = instructorData
    }

    if (!instructorToDelete) {
      console.error("No se pudo encontrar el instructor")
      return
    }

    // Verificar si el instructor tiene fichas asociadas
    const hasFichas = instructorToDelete.fichas && instructorToDelete.fichas.length > 0

    if (hasFichas) {
      console.log("Instructor tiene fichas asociadas:", instructorToDelete.fichas.length)
      setInstructorToDelete(instructorToDelete)
      setShowFichasAlert(true)
    } else {
      console.log("Instructor no tiene fichas asociadas, procediendo con eliminación")
      setInstructorToDelete(instructorToDelete)
      setShowDeleteConfirm(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (instructorToDelete) {
      try {
        let instructorId
        if (typeof instructorToDelete === "object") {
          instructorId = instructorToDelete._id || instructorToDelete.id
        } else {
          instructorId = instructorToDelete
        }

        console.log("ID del instructor a eliminar:", instructorId)

        if (!instructorId) {
          console.error("No se encontró ID del instructor:", instructorToDelete)
          return
        }

        await deleteInstructor(instructorId)
        refetch()
        setShowDeleteConfirm(false)
        setInstructorToDelete(null)
      } catch (error) {
        console.error("Error al eliminar instructor:", error)
      }
    }
  }

  const handleCloseFichasAlert = () => {
    setShowFichasAlert(false)
    setInstructorToDelete(null)
  }

  if (loading) {
    return (
      <div className="max-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto mb-4"></div>
          <p className="text-[#1f384c] font-medium">Cargando instructores...</p>
        </div>
      </div>
    )
  }

  const displayError = error && !instructors.length ? error : null

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Instructores</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {displayError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {displayError}</div>
        )}

        <ProtectedTable
          data={instructors}
          columns={columns}
          module="Instructores" // Nombre del módulo para verificar permisos
          onAdd={handleCreateInstructor}
          onShow={handleShowInstructor}
          onEdit={handleEditInstructor}
          onDelete={handleDeleteInstructor}
          tooltipText="Ver detalle del instructor"
        />

        <ProtectedAction module="Instructores" privilege="read">
          {selectedInstructor && (
            <InstructorDetailModal
              instructor={selectedInstructor}
              isOpen={isDetailModalOpen}
              onClose={handleCloseDetailModal}
            />
          )}
        </ProtectedAction>
      </div>

      {/* Modal de confirmación para eliminación normal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Instructor"
        message={`¿Está seguro de que desea eliminar al instructor ${instructorToDelete?.nombre} ${instructorToDelete?.apellido}?`}
        confirmText="Eliminar"
        confirmColor="bg-[#f44144] hover:bg-red-600"
        loading={deleting}
      />

      {/* Modal de alerta para instructor con fichas asociadas */}
      <ConfirmationModal
        isOpen={showFichasAlert}
        onClose={handleCloseFichasAlert}
        onConfirm={handleCloseFichasAlert}
        title="No se puede eliminar el instructor"
        message={`No se puede eliminar el instructor ${instructorToDelete?.nombre} ${instructorToDelete?.apellido} porque tiene fichas asociadas.`}
        confirmText="Cerrar"
        confirmColor="bg-[#f44144] hover:bg-red-600"
        showCancel={false}
        showButtonCancel={false}
        loading={false}
      />
    </div>
  )
}

export default InstructorsPage
