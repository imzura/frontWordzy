"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import GenericTable from "../../../shared/components/Table"
import UserMenu from "../../../shared/components/userMenu"

const Badges = () => {
  // Hook de navegación de React Router
  const navigate = useNavigate()

  // Estado para controlar la vista (formulario o lista)
  const [view, setView] = useState("list") // "list" o "form"
  const [showEditConfirm, setShowEditConfirm] = useState(false)

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [badgeToDelete, setBadgeToDelete] = useState(null)

  // Estado para las alertas de éxito
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Estado para los campos del formulario
  const [badgeName, setBadgeName] = useState("")
  const [points, setPoints] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [fileSize, setFileSize] = useState(null)

  // Estado para almacenar las insignias creadas
  const [badges, setBadges] = useState(() => {
    // Get badges from localStorage or use default badges if none exist
    const savedBadges = JSON.parse(localStorage.getItem("badges") || "[]")

    // If there are no saved badges, use the default ones
    if (savedBadges.length === 0) {
      return [
        {
          id: 1,
          name: "Insignia Experto",
          points: 5000,
          description:
            "¡El máximo reconocimiento! Otorgado al reunir 5,000 puntos. ¡Felicidades por ser un experto indiscutible!",
          color: "#ff5a87",
          image: "/Experto.png",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
        },
        {
          id: 2,
          name: "Insignia Intermedio",
          points: 3000,
          description: "¡Excelente progreso! Has alcanzado 3,000 puntos. Representa un nivel avanzado de logros.",
          color: "#9747ff",
          image: "/Intermedia.png",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
        },
        {
          id: 3,
          name: "Insignia Principiante",
          points: 1000,
          description: "Se obtiene al alcanzar 1,000 puntos en tu progreso. ¡Es el primer paso para destacar!",
          color: "#ffcc33",
          image: "/Principiante.png",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
        },
      ]
    }

    return savedBadges
  })

  // Define columns for the table
  const columns = [
    {
      key: "name",
      label: "Nombre",
      width: "15%",
      align: "left",
      headerAlign: "left",
      render: (item) => <div className="flex items-center py-2">{item.name}</div>,
    },
    {
      key: "points",
      label: "Puntos",
      width: "10%",
      align: "left",
      headerAlign: "left",
      render: (item) => <div className="flex items-center py-2">{item.points}</div>,
    },
    {
      key: "startDate",
      label: "Fecha inicio",
      width: "15%",
      align: "left",
      headerAlign: "left",
      render: (item) => <div className="flex items-center py-2">{item.startDate || "N/A"}</div>,
    },
    {
      key: "endDate",
      label: "Fecha fin",
      width: "15%",
      align: "left",
      headerAlign: "left",
      render: (item) => <div className="flex items-center py-2">{item.endDate || "N/A"}</div>,
    },
    {
      key: "description",
      label: "Descripción",
      width: "25%",
      align: "left",
      headerAlign: "left",
      render: (item) => (
        <div className="flex items-center py-2">
          <div className="truncate max-w-xs" title={item.description}>
            {item.description}
          </div>
        </div>
      ),
    },
    {
      key: "image",
      label: "Imagen",
      width: "20%",
      align: "center",
      headerAlign: "left",
      render: (item) => (
        <div className="flex items-center py-2 justify-center">
          <img
            src={item.image || "/placeholder.png"}
            alt={item.name}
            className="w-10 h-10 object-contain rounded-full"
            onError={(e) => {
              e.target.src = "/placeholder.png"
            }}
          />
        </div>
      ),
    },
  ]

  // Handle actions
  const handleShowBadge = (item) => {
    console.log("Ver detalles de:", item)
    // You could implement a modal to show badge details
  }

  const handleEditBadge = (item) => {
    console.log("Editar:", item)
    // Mostrar alerta de confirmación en lugar de redirección inmediata
    setSuccessMessage("¿Está seguro de que desea editar esta insignia?")
    setShowEditConfirm(true)
  }

  const handleDeleteClick = (id) => {
    setBadgeToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteBadge = () => {
    console.log("Eliminar ID:", badgeToDelete)
    const updatedBadges = badges.filter((badge) => badge.id !== badgeToDelete)
    setBadges(updatedBadges)
    localStorage.setItem("badges", JSON.stringify(updatedBadges))
    setShowDeleteConfirm(false)

    // Mostrar alerta de éxito
    setSuccessMessage("Insignia eliminada exitosamente")
    setShowSuccessAlert(true)

    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)
  }

  const handleAddBadge = () => {
    // Navegar directamente sin mostrar alerta
    navigate("/programacion/insigneas")
  }

  // Función para manejar el cambio de archivo
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFilePreview(URL.createObjectURL(selectedFile))
      setFileSize((selectedFile.size / (1024 * 1024)).toFixed(1))
    }
  }

  // Función para eliminar el archivo
  const removeFile = () => {
    setFile(null)
    setFilePreview(null)
    setFileSize(null)
  }

  // Función para generar un color aleatorio para la insignia
  const getRandomColor = () => {
    const colors = ["#ff5a87", "#9747ff", "#ffcc33", "#33cc99", "#3399ff"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Crear nueva insignia
    const newBadge = {
      id: Date.now(),
      name: badgeName,
      points: Number(points),
      description: description,
      color: getRandomColor(),
      image: filePreview || "/placeholder.png",
    }

    // Añadir la nueva insignia al array
    setBadges([...badges, newBadge])

    // Resetear el formulario
    setBadgeName("")
    setPoints("")
    setDescription("")
    setFile(null)
    setFilePreview(null)
    setFileSize(null)

    // Cambiar a la vista de lista
    setView("list")
  }

  // Función para navegar a la página de edición de insignias
  const handleEditClick = () => {
    setShowEditConfirm(true)
  }

  const handleEditConfirm = () => {
    setShowEditConfirm(false)

    // Navegar directamente sin mostrar alerta
    navigate("/programacion/insigneas3")
  }

  // Función para renderizar el formulario de insignias (placeholder)
  const renderBadgeForm = () => {
    return (
      <div className="max-h-screen bg-white">
        <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Insignias</h1>
          <UserMenu />
        </div>
      </header>
      
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
          <p>Formulario de creación de insignias (por implementar)</p>
          <button
            onClick={() => setView("list")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  // Renderizar la vista de lista de insignias
  const renderBadgesList = () => {
    return (
      <div className="max-h-screen bg-white">
        {/* Header */}
        <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Insignias</h1>
          <UserMenu />
        </div>
      </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
          <GenericTable
            data={badges}
            columns={columns}
            onShow={handleShowBadge}
            onEdit={handleEditBadge}
            onDelete={handleDeleteClick}
            onAdd={handleAddBadge}
            defaultItemsPerPage={5}
            showActions={{ show: false, edit: true, delete: true, add: true }}
            tooltipText="Ver insignia"
            showSearch={true}
            showPagination={true}
          />
        </div>

        {/* Edit Confirmation Modal */}
        {showEditConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-[#1f384c]">Editar Insignias</h3>
                  <p className="mt-2 text-[#627b87]">¿Está seguro de que desea editar las insignias?</p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    className="px-6 py-2.5 border border-[#d9d9d9] rounded-lg text-[#627b87] hover:bg-gray-50 font-medium transition-colors"
                    onClick={() => setShowEditConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                    onClick={handleEditConfirm}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-[#1f384c]">Eliminar Insignia</h3>
                  <p className="mt-2 text-[#627b87]">¿Está seguro de que desea eliminar esta insignia?</p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    className="px-6 py-2.5 border border-[#d9d9d9] rounded-lg text-[#627b87] hover:bg-gray-50 font-medium transition-colors"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-6 py-2.5 bg-[#f44144] text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                    onClick={handleDeleteBadge}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all z-50">
            <div className="p-4 flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                <svg
                  className="h-5 w-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{successMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccessAlert(false)}
                className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Renderizar la vista correspondiente
  return view === "list" ? renderBadgesList() : renderBadgeForm()
}

export default Badges
