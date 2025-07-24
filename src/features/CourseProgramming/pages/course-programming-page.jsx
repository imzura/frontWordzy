import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import { useGetCourseProgrammings } from "../hooks/useGetCoursePrograming"
import { formatDate } from "../../../shared/utils/dateFormatter"
import { useDeleteCourseProgramming } from "../hooks/useDeleteCoursePrograming"
import UserMenu from "../../../shared/components/userMenu"
import ProtectedTable from "../../../shared/components/ProtectedTable"

const columns = [
  {
    key: "programId",
    label: "Programa",
    render: (item) => (
      <div className="whitespace-normal break-words max-w-md">
        {item.programId?.name}
      </div>
    ),
    width: "40%",
  },
  { key: "startDate", label: "Fecha Inicio" },
  {
    key: "endDate",
    label: "Fecha Fin",
    render: (item) => (
      <span className="text-gray-600">
        {item.endDate || "Sin fecha"}
      </span>
    )
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === true
          ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {item.status ? "Activo" : "Inactivo"}
      </span>
    ),
  },
]

const CourseProgrammingPage = () => {
  const navigate = useNavigate()
  const { programmings, loading: fetchLoading, error: fetchError, refetch } = useGetCourseProgrammings()
  const { deleteCourseProgramming } = useDeleteCourseProgramming()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  // Actualizar el estado de carga y error cuando cambien los hooks
  useEffect(() => {
    setIsLoading(fetchLoading)
  }, [fetchLoading])

  // Consolidar errores de los diferentes hooks
  useEffect(() => {
    const error = fetchError
    setErrorMessage(error ? `Error: ${error}` : "")
  }, [fetchError])

  const formattedPrograms = programmings.map(programming => ({
    ...programming,
    startDate: formatDate(programming.startDate),
    endDate: formatDate(programming.endDate ),
  }));

  // Cargar programaciones al montar el componente
  useEffect(() => {
    formattedPrograms
  }, [formattedPrograms])

  const handleAddProgramming = () => {
    navigate("/programacion/programacionCursos/registrarProgramacion")
  }
  

  const handleShowProgramming = (programming) => {
    navigate(`/programacion/programacionCursos/detalle/${programming._id}`)
  }

  const handleEditProgramming = (programming) => {
    navigate(`/programacion/programacionCursos/editar/${programming._id}`)
  }

  const handleDeleteProgramming = (id) => {
    setItemToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteProgramming = async () => {
    try {
      setIsDeleting(true)
      await deleteCourseProgramming(itemToDelete)
      await refetch();
      // Mostrar mensaje de éxito
      setSuccessMessage("Programación eliminada exitosamente")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage("Ocurrió un error al eliminar la programación")
      setShowSuccessModal(true)
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Programación de Cursos</h1>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Mostrar error si existe */}
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
            data={formattedPrograms}
            columns={columns}
            module="Programacion De Cursos" // Nombre del módulo para verificar permisos
            onAdd={handleAddProgramming}
            onShow={handleShowProgramming}
            onEdit={handleEditProgramming}
            onDelete={handleDeleteProgramming}
            tooltipText="Ver detalle del curso"
        />
        )}

        {/* Modal de confirmación para eliminar programación */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteProgramming}
          title="Eliminar Programación"
          message="¿Está seguro que desea eliminar esta programación? Esta acción no se puede deshacer."
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          confirmColor="bg-[#f44144] hover:bg-red-600"
        />

        {/* Modal de éxito */}
        <ConfirmationModal
          isOpen={showSuccessModal}
          onConfirm={() => setShowSuccessModal(false)}
          title="Operación Exitosa"
          message={successMessage}
          confirmText="Aceptar"
          confirmColor="bg-green-500 hover:bg-green-600"
          showButtonCancel={false}
        />
      </div>
    </div>
  )
}

export default CourseProgrammingPage
