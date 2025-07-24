"use client"

import { useState } from "react"
import { Search, Upload, X, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserMenu from "../../../shared/components/userMenu"

const Badges = () => {
  const navigate = useNavigate()
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    badgeName: "",
    points: "",
    description: "",
    file: null,
    filePreview: null,
    fileSize: null,
    startDate: "",
    endDate: ""
  })
  
  // Estado para las alertas de éxito
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const validateForm = () => {
    const errors = {}
    if (!formData.badgeName.trim()) errors.badgeName = "El nombre es requerido"
    if (!formData.points) errors.points = "Los puntos son requeridos"
    if (!formData.description.trim()) errors.description = "La descripción es requerida"
    if (!formData.file) errors.file = "La imagen es requerida"
    if (!formData.startDate) errors.startDate = "La fecha de inicio es requerida"
    if (!formData.endDate) errors.endDate = "La fecha de fin es requerida"
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio"
    }
    return errors
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFormData(prev => ({
        ...prev,
        file: selectedFile,
        filePreview: URL.createObjectURL(selectedFile),
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(1)
      }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Create new badge object
    const newBadge = {
      id: Date.now(),
      name: formData.badgeName,
      points: Number(formData.points),
      description: formData.description,
      color: getRandomColor(),
      image: formData.filePreview || "/placeholder.svg?height=60&width=60",
      startDate: formData.startDate,
      endDate: formData.endDate
    }

    // Get existing badges from localStorage or use empty array
    const existingBadges = JSON.parse(localStorage.getItem('badges') || '[]')
    
    // Add new badge to the array
    const updatedBadges = [...existingBadges, newBadge]
    
    // Save to localStorage
    localStorage.setItem('badges', JSON.stringify(updatedBadges))

    console.log('Badge created:', newBadge)
    
    // Navegar directamente sin mostrar alerta
    navigate("/programacion/insigneas2")
    
    // Reset form after successful submission
    setFormData({
      badgeName: "",
      points: "",
      description: "",
      file: null,
      filePreview: null,
      fileSize: null,
      startDate: "",
      endDate: ""
    })
  }

  // Function to generate a random color for the badge
  const getRandomColor = () => {
    const colors = ["#ff5a87", "#9747ff", "#ffcc33", "#33cc99", "#3399ff"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

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
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre de la insignia */}
            <div>
              <label className="block text-sm font-medium text-[#1f384c] mb-1">
                Nombre de la insignia:
              </label>
              <input
                type="text"
                name="badgeName"
                value={formData.badgeName}
                onChange={handleInputChange}
                className={`w-full p-2 border ${formErrors.badgeName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Nombre"
              />
              {formErrors.badgeName && (
                <p className="text-xs text-red-500 mt-1">{formErrors.badgeName}</p>
              )}
            </div>

            {/* Subir imagen - simplified layout */}
            <div>
              <label className="block text-sm font-medium text-[#1f384c] mb-1">
                Subir imagen:
              </label>
              <div className="border border-gray-300 border-dashed rounded-md p-4">
                {!formData.file ? (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 text-center">Haga clic para cargar o arrastrar y soltar</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (MAX. 800x400px)</p>
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                ) : (
                  <div className="flex flex-col items-center">
                    {formData.filePreview && (
                      <img 
                        src={formData.filePreview} 
                        alt="Preview" 
                        className="h-24 w-24 object-contain mb-2" 
                      />
                    )}
                    <div className="flex items-center justify-between w-full mt-2">
                      <p className="text-sm text-gray-700 truncate max-w-[200px]">
                        {formData.file.name}
                      </p>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          file: null,
                          filePreview: null,
                          fileSize: null
                        }))}
                        className="p-1 hover:bg-red-50 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {formErrors.file && (
                <p className="text-xs text-red-500 mt-1">{formErrors.file}</p>
              )}
            </div>

            {/* Points and Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Puntos:
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.points ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Puntos"
                />
                {formErrors.points && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.points}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Descripción:
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Descripción"
                  rows="3"
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>

            {/* Date fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Fecha de inicio:
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.startDate && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f384c] mb-1">
                  Fecha de fin:
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formErrors.endDate && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all z-50">
          <div className="p-4 flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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

export default Badges

