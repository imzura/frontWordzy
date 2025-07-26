"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import { formatDate } from "../../../shared/utils/dateFormatter"
import { useGetRoles } from "../hooks/useGetRoles"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import UserMenu from "../../../shared/components/userMenu"

const columns = [
  { key: "name", label: "Nombre" },
  {
    key: "description",
    label: "Descripción",
    width: "30%",
    render: (item) => (
      <span className="whitespace-normal break-words max-w-md">{item.description || "Sin descripción"}</span>
    ),
  },
  { key: "creationDate", label: "Fecha de creación" },
  {
    key: "status",
    label: "Estado",
    render: (item) => {
      // Usar isActive en lugar de status
      const isActive = item.isActive !== undefined ? item.isActive : item.status
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive === true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
      )
    },
  },
]

const RolesPage = () => {
  const navigate = useNavigate()
  const { roles, loading: fetchLoading, error: fetchError, refetch } = useGetRoles()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Actualizar el estado de carga y error cuando cambien los hooks
  useEffect(() => {
    setIsLoading(fetchLoading)
  }, [fetchLoading])

  // Consolidar errores de los diferentes hooks
  useEffect(() => {
    const error = fetchError
    setErrorMessage(error ? `Error: ${error}` : "")
  }, [fetchError])

  const formattedRoles = Array.isArray(roles)
    ? roles.map((role) => ({
        ...role,
        creationDate: formatDate(role.createdAt || role.creationDate),
        // Asegurar que el status esté disponible para la tabla
        status: role.isActive !== undefined ? role.isActive : role.status,
      }))
    : []

  const handleEditRole = (role) => {
    if (role.name === "Aprendiz") {
      setSuccessMessage("No se pueden editar los permisos del rol 'Aprendiz'.")
      setShowSuccessModal(true)
      return
    }
    const roleId = role._id || role.id
    navigate(`/configuracion/roles/editar/${roleId}`)
  }

  const handleViewRole = (role) => {
    const roleId = role._id || role.id
    navigate(`/configuracion/roles/detalle/${roleId}`)
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Roles</h1>
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
            data={formattedRoles}
            columns={columns}
            module="Roles" // Nombre del módulo para verificar permisos
            onEdit={handleEditRole}
            onShow={handleViewRole}
            showActions={{
              delete: false,
              add: false,
            }}
          />
        )}

        {/* Modal de éxito/error */}
        <ConfirmationModal
          isOpen={showSuccessModal}
          onConfirm={() => setShowSuccessModal(false)}
          title={successMessage.includes("exitosamente") ? "Operación Exitosa" : "Acción no permitida"}
          message={successMessage}
          confirmText="Aceptar"
          confirmColor={
            successMessage.includes("exitosamente")
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#f44144] hover:bg-red-600"
          }
          showButtonCancel={false}
        />
      </div>
    </div>
  )
}

export default RolesPage
