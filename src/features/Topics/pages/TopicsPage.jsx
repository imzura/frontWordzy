"use client"

import { useState, useEffect } from "react"
import ProtectedTable from "../../../shared/components/ProtectedTable"
import ProtectedAction from "../../../shared/components/ProtectedAction"
import TopicModal from "../components/TopicModal"
import EditTopicModal from "../components/EditTopicModal"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import { useGetTopics } from "../hooks/useGetTopics"
import { usePostTopic } from "../hooks/usePostTopic"
import { usePutTopic } from "../hooks/usePutTopic"
import { useDeleteTopic } from "../hooks/useDeleteTopic"
import { useCheckTopicUsage } from "../hooks/useCheckTopicUsage"
import { useCheckTopicStatusChange } from "../hooks/useCheckTopicStatusChange"
import UserMenu from "../../../shared/components/userMenu"

const columns = [
  {
    key: "name",
    label: "Nombre",
    render: (item) => <div className="whitespace-normal break-words max-w-md">{item.name}</div>,
    width: "30%",
  },
  {
    key: "description",
    label: "Descripción",
    render: (item) => <span className="text-gray-600">{item.description || "Sin descripción"}</span>,
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === true ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {item.status ? "Activo" : "Inactivo"}
      </span>
    ),
  },
]

const TopicsPage = () => {
  // HOOKS (mantener los mismos)
  const { topics, loading: fetchLoading, error: fetchError, refetch } = useGetTopics()
  const { postTopic, loading: createLoading, error: createError } = usePostTopic()
  const { putTopic, loading: updateLoading, error: updateError } = usePutTopic()
  const { deleteTopic, loading: deleteLoading, error: deleteError } = useDeleteTopic()
  const { checkTopicUsage, loading: checkLoading } = useCheckTopicUsage()
  const { checkStatusChange, loading: checkStatusLoading } = useCheckTopicStatusChange()

  // Estados (mantener los mismos)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [pendingChanges, setPendingChanges] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showUsageWarning, setShowUsageWarning] = useState(false)
  const [topicUsageInfo, setTopicUsageInfo] = useState(null)
  const [showStatusWarning, setShowStatusWarning] = useState(false)
  const [statusChangeInfo, setStatusChangeInfo] = useState(null)

  // Effects (mantener los mismos)
  useEffect(() => {
    setIsLoading(fetchLoading || createLoading || updateLoading || deleteLoading || checkLoading || checkStatusLoading)
  }, [fetchLoading, createLoading, updateLoading, deleteLoading, checkLoading, checkStatusLoading])

  useEffect(() => {
    const error = fetchError || createError || updateError || deleteError
    setErrorMessage(error ? `Error: ${error}` : "")
  }, [fetchError, createError, updateError, deleteError])

  // Handlers (mantener los mismos)
  const handleAddTopic = () => {
    setIsModalOpen(true)
  }

  const handleSubmitTopic = async (newTopic) => {
    try {
      setIsSaving(true)
      await postTopic(newTopic)
      setIsModalOpen(false)
      await refetch()
      setSuccessMessage(`Tema "${newTopic.name}" creado exitosamente`)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error al crear el tema:", error)
      setSuccessMessage(error.message || "Ocurrió un error al crear el tema")
      setShowSuccessModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditTopic = (topic) => {
    setCurrentTopic(topic)
    setIsEditModalOpen(true)
  }

  const handleUpdateTopic = async (updatedTopic) => {
    try {
      const isStatusChanging = currentTopic.status !== updatedTopic.status

      if (isStatusChanging) {
        const statusCheck = await checkStatusChange(currentTopic._id, updatedTopic.status)

        if (!statusCheck.canChange && statusCheck.reason === "in_use") {
          setStatusChangeInfo({
            topic: currentTopic,
            newStatus: updatedTopic.status,
            usageInfo: statusCheck.usageInfo,
          })
          setShowStatusWarning(true)
          return
        }
      }

      setPendingChanges(updatedTopic)
      setShowSaveConfirm(true)
    } catch (error) {
      console.error("Error al verificar cambio de estado:", error)
      setSuccessMessage("Error al verificar si el tema puede cambiar de estado")
      setShowSuccessModal(true)
    }
  }

  const confirmSaveChanges = async () => {
    try {
      setIsSaving(true)
      if (!currentTopic || !pendingChanges) {
        throw new Error("No hay tema seleccionado para editar")
      }

      const topicToUpdate = {
        name: pendingChanges.name,
        description: pendingChanges.description,
        status: pendingChanges.status,
      }

      await putTopic(currentTopic._id, topicToUpdate)
      await refetch()

      setIsEditModalOpen(false)
      setShowSaveConfirm(false)
      setPendingChanges(null)
      setSuccessMessage("Tema actualizado exitosamente")
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error al actualizar el tema:", error)
      setSuccessMessage(error.message || "Ocurrió un error al actualizar el tema")
      setShowSuccessModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTopic = async (id) => {
    try {
      const usageInfo = await checkTopicUsage(id)

      if (usageInfo.isInUse) {
        setTopicUsageInfo(usageInfo)
        setShowUsageWarning(true)
      } else {
        setItemToDelete(id)
        setShowDeleteConfirm(true)
      }
    } catch (error) {
      console.error("Error al eliminar el tema:", error)
      setSuccessMessage("Error al eliminar el tema")
      setShowSuccessModal(true)
    }
  }

  const confirmDeleteTopic = async () => {
    try {
      setIsDeleting(true)
      await deleteTopic(itemToDelete)
      await refetch()
      setSuccessMessage("Tema eliminado exitosamente")
      setShowSuccessModal(true)
    } catch (error) {
      setSuccessMessage(error.message || "Error al eliminar el tema")
      setShowSuccessModal(true)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Temas</h1>
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
            data={topics}
            columns={columns}
            module="Temas" // Nombre del módulo para verificar permisos
            onAdd={handleAddTopic}
            onEdit={handleEditTopic}
            onDelete={handleDeleteTopic}
          />
        )}

        {/* Modales protegidos */}
        <ProtectedAction module="Temas" privilege="create">
          <TopicModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitTopic}
            topic={currentTopic}
            existingTopics={topics}
            loading={isLoading}
          />
        </ProtectedAction>

        <ProtectedAction module="Temas" privilege="update">
          <EditTopicModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleUpdateTopic}
            topic={currentTopic}
            existingTopics={topics}
          />
        </ProtectedAction>

        {/* Resto de modales (mantener iguales) */}
        <ConfirmationModal
          isOpen={showUsageWarning}
          onClose={() => {
            setShowUsageWarning(false)
            setTopicUsageInfo(null)
          }}
          onConfirm={() => {
            setShowUsageWarning(false)
            setTopicUsageInfo(null)
          }}
          title="Acción no permitida"
          message={
            <div className="space-y-3">
              <p>
                El tema <strong>"{topicUsageInfo?.topicName}"</strong> no puede ser eliminado porque está siendo
                utilizado en las siguientes programaciones de cursos:
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <ul className="list-disc list-inside space-y-1">
                  {topicUsageInfo?.usedInPrograms?.map((programName, index) => (
                    <li key={index} className="text-sm text-red-800">
                      {programName}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Para eliminar este tema, primero debe removerlo de todas las programaciones donde se encuentra.
              </p>
            </div>
          }
          confirmText="Cerrar"
          confirmColor="bg-red-500 hover:bg-red-600"
          showButtonCancel={false}
        />

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteTopic}
          title="Eliminar Tema"
          message="¿Está seguro que desea eliminar este tema? Esta acción no se puede deshacer."
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          confirmColor="bg-[#f44144] hover:bg-red-600"
          isLoading={isDeleting}
        />

        <ConfirmationModal
          isOpen={showSaveConfirm}
          onClose={() => {
            setShowSaveConfirm(false)
            setIsEditModalOpen(false)
          }}
          onConfirm={confirmSaveChanges}
          title="Confirmar Cambios"
          message="¿Estás seguro que deseas guardar los cambios del tema?"
          confirmText={isSaving ? "Guardando..." : "Guardar"}
          confirmColor="bg-green-500 hover:bg-green-600"
          isLoading={isSaving}
        />

        <ConfirmationModal
          isOpen={showSuccessModal}
          onConfirm={() => setShowSuccessModal(false)}
          title={
            successMessage.includes("exitosamente") ? "Operación Exitosa" : "Error en la Operación" 
          }
          message={successMessage}
          confirmText="Aceptar"
          confirmColor={
            successMessage.includes("exitosamente")
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#f44144] hover:bg-red-600" // Color dinámico
          }
          showButtonCancel={false}
        />

        <ConfirmationModal
          isOpen={showStatusWarning}
          onClose={() => {
            setShowStatusWarning(false)
            setStatusChangeInfo(null)
          }}
          onConfirm={() => {
            setShowStatusWarning(false)
            setStatusChangeInfo(null)
          }}
          title="No se puede cambiar el estado del tema"
          message={
            <div className="space-y-3">
              <p>
                No se puede cambiar el estado del tema <strong>"{statusChangeInfo?.topic?.name}"</strong> a{" "}
                <strong>{statusChangeInfo?.newStatus ? "Activo" : "Inactivo"}</strong> porque está siendo utilizado en
                las siguientes programaciones de cursos:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <ul className="list-disc list-inside space-y-1">
                  {statusChangeInfo?.usageInfo?.usedInPrograms?.map((programName, index) => (
                    <li key={index} className="text-sm text-yellow-800">
                      {programName}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">
                Para cambiar el estado de este tema, primero debe removerlo de todas las programaciones donde se
                encuentra.
              </p>
            </div>
          }
          confirmText="Entendido"
          confirmColor="bg-blue-500 hover:bg-blue-600"
          showButtonCancel={false}
        />
      </div>
    </div>
  )
}

export default TopicsPage
