"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { FiTrash } from "react-icons/fi"

const Ranking = () => {
  const navigate = useNavigate()
  const [badges, setBadges] = useState([])
  
  // Estado para las alertas de éxito
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load badges from localStorage on component mount
  useEffect(() => {
    const savedBadges = JSON.parse(localStorage.getItem('badges') || '[]')
    
    // If there are no saved badges, use default ones
    if (savedBadges.length === 0) {
      const defaultBadges = [
        {
          id: 1,
          name: "Insignia experto",
          points: 5000,
          description: "El máximo...",
          icon: "/public/experto.png",
          color: "rgba(255, 215, 0, 0.1)",
          startDate: "2023-01-01",
          endDate: "2023-12-31"
        },
        {
          id: 2,
          name: "Insignia intermedia",
          points: 3000,
          description: "Conseguiste...",
          icon: "/public/intermedia.png",
          color: "rgba(192, 192, 192, 0.1)",
          startDate: "2023-01-01",
          endDate: "2023-12-31"
        },
        {
          id: 3,
          name: "Insignia principiante",
          points: 1000,
          description: "Se obtiene...",
          icon: "/public/principiante.png",
          color: "rgba(205, 127, 50, 0.1)",
          startDate: "2023-01-01",
          endDate: "2023-12-31"
        },
      ]
      setBadges(defaultBadges)
    } else {
      // Map saved badges to match the expected format
      const formattedBadges = savedBadges.map(badge => ({
        id: badge.id,
        name: badge.name,
        points: badge.points,
        description: badge.description,
        icon: badge.image || "/placeholder.svg",
        color: badge.color || "rgba(205, 127, 50, 0.1)",
        startDate: badge.startDate || "",
        endDate: badge.endDate || ""
      }))
      setBadges(formattedBadges)
    }
  }, [])

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [badgeToDelete, setBadgeToDelete] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const handleInputChange = (id, field, value) => {
    setBadges(badges.map((badge) => (badge.id === id ? { ...badge, [field]: value } : badge)))
    
    // Clear error when user types
    if (formErrors[`${id}-${field}`]) {
      setFormErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[`${id}-${field}`]
        return newErrors
      })
    }
  }

  const validateBadges = () => {
    const errors = {}
    
    badges.forEach(badge => {
      if (!badge.name.trim()) {
        errors[`${badge.id}-name`] = "El nombre es requerido"
      }
      
      if (!badge.points) {
        errors[`${badge.id}-points`] = "Los puntos son requeridos"
      }
      
      if (!badge.description.trim()) {
        errors[`${badge.id}-description`] = "La descripción es requerida"
      }
      
      if (!badge.startDate) {
        errors[`${badge.id}-startDate`] = "La fecha de inicio es requerida"
      }
      
      if (!badge.endDate) {
        errors[`${badge.id}-endDate`] = "La fecha de fin es requerida"
      }
      
      if (badge.startDate && badge.endDate && new Date(badge.startDate) > new Date(badge.endDate)) {
        errors[`${badge.id}-endDate`] = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    })
    
    return errors
  }

  const handleDeleteClick = (id) => {
    setBadgeToDelete(id)
    setShowDeleteConfirm(true)
  }

  const handleDelete = () => {
    const updatedBadges = badges.filter((badge) => badge.id !== badgeToDelete)
    setBadges(updatedBadges)
    
    // Update localStorage
    localStorage.setItem('badges', JSON.stringify(updatedBadges.map(badge => ({
      id: badge.id,
      name: badge.name,
      points: badge.points,
      description: badge.description,
      image: badge.icon,
      color: badge.color,
      startDate: badge.startDate,
      endDate: badge.endDate
    }))))
    
    setShowDeleteConfirm(false)
    
    // Mostrar alerta de éxito personalizada en lugar del alert del navegador
    setSuccessMessage("Insignia eliminada exitosamente")
    setShowSuccessAlert(true)
    
    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)
  }

  const handleSaveClick = () => {
    const errors = validateBadges()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      
      // Mostrar alerta de error personalizada en lugar del alert del navegador
      setSuccessMessage("Por favor corrija los errores antes de guardar")
      setShowSuccessAlert(true)
      
      // Ocultar la alerta después de 3 segundos
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
      return
    }
    
    setShowSaveConfirm(true)
  }

  const handleSave = () => {
    // Save updated badges to localStorage
    localStorage.setItem('badges', JSON.stringify(badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      points: badge.points,
      description: badge.description,
      image: badge.icon,
      color: badge.color,
      startDate: badge.startDate,
      endDate: badge.endDate
    }))))
    
    setShowSaveConfirm(false)
    
    // Navegar directamente sin mostrar alerta
    navigate("/programacion/insigneas2")
  }

  const handleCancel = () => {
    navigate("/programacion/insigneas")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">EDITAR INSIGNIAS</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          {badges.map((badge, index) => (
            <div 
              key={badge.id} 
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 last:mb-0 p-4 border border-gray-100 rounded-lg"
            >
              {/* Badge Icon */}
              <div className="sm:col-span-1 flex justify-center sm:justify-start">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src={badge.icon || "/placeholder.svg"} 
                    alt={badge.name} 
                    className="w-14 h-14 object-contain"
                  />
                </div>
              </div>

              {/* Badge Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Nombre:
                </label>
                <input
                  type="text"
                  value={badge.name}
                  onChange={(e) => handleInputChange(badge.id, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Points */}
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Puntos:
                </label>
                <input
                  type="number"
                  value={badge.points}
                  onChange={(e) => handleInputChange(badge.id, "points", Number.parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Start Date */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Fecha inicio:
                </label>
                <input
                  type="date"
                  value={badge.startDate || ""}
                  onChange={(e) => handleInputChange(badge.id, "startDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Fecha fin:
                </label>
                <input
                  type="date"
                  value={badge.endDate || ""}
                  onChange={(e) => handleInputChange(badge.id, "endDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Descripción:
                </label>
                <textarea
                  value={badge.description}
                  onChange={(e) => handleInputChange(badge.id, "description", e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Delete Button - replaced with icon */}
              <div className="sm:col-span-1 flex flex-col">
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Acciones:
                </label>
                <div className="flex h-10 items-center">
                  <button
                    onClick={() => handleDeleteClick(badge.id)}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    aria-label="Eliminar"
                  >
                    <FiTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveClick}
            className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Modals remain unchanged */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#1f384c]">
                  Eliminar Insignia
                </h3>
                <p className="mt-2 text-[#627b87]">
                  ¿Está seguro de que desea eliminar esta insignia?
                </p>
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
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#1f384c]">
                  Guardar Cambios
                </h3>
                <p className="mt-2 text-[#627b87]">
                  ¿Está seguro de que desea guardar los cambios realizados?
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                <button
                  className="px-6 py-2.5 border border-[#d9d9d9] rounded-lg text-[#627b87] hover:bg-gray-50 font-medium transition-colors"
                  onClick={() => setShowSaveConfirm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  onClick={handleSave}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ranking

