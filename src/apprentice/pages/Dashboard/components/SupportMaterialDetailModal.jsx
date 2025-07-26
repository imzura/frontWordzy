"use client"
import { FileText, X, AlertCircle } from "lucide-react"

// Función de utilidad para formatear la fecha (aunque ya no se usa en el modal simplificado, la mantengo por si acaso)
const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha"
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Fecha inválida"
  }
}

const SupportMaterialDetailModal = ({ isOpen, onClose, material, isLoading }) => {
  if (!isOpen) return null

  // Determina el título a mostrar en el encabezado
  const headerTitle = isLoading ? "Cargando..." : material?.titulo || material?.name || "Detalle de Material de Apoyo"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0 relative">
          <h2 className="text-2xl font-bold text-[#1f384c] flex items-center">
            <FileText className="mr-2 h-6 w-6 text-[#1f384c]" />
            {headerTitle}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mb-4"></div>
              <p>Cargando detalles del material...</p>
            </div>
          ) : !material || !material._id ? ( // Verifica si material es nulo o no tiene ID (indicando error o no encontrado)
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-600">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p>No se pudo cargar el material o no hay información disponible.</p>
            </div>
          ) : (
            <>
              {/* Contenido */}
              <div className="">
                <div className="border border-gray-200 rounded-md bg-white p-4 min-h-[200px] shadow-inner">
                  <div
                    className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: material.contenido || "<p>No hay contenido disponible para este material.</p>",
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer fijo */}
        <div className="p-4 border-t border-gray-200 flex justify-center flex-shrink-0">
          <button
            className="px-6 py-2 bg-[#1f384c] text-white rounded-lg hover:bg-[#2d4a5c] transition-colors"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default SupportMaterialDetailModal
