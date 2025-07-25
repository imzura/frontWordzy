"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2 } from "lucide-react"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import useGetInstructors from "../hooks/useGetInstructors"
import usePutInstructor from "../hooks/usePutInstructor"
import useGetCourses from "../hooks/useGetCourses"
import {
  validateInstructorData,
  processServerError,
  validateDocumento,
  validateTelefono,
  validateCorreo,
  validateNombre,
  validateApellido,
  checkDocumentUniqueness,
  checkEmailUniqueness,
} from "../services/instructorValidationService"
import UserMenu from "../../../shared/components/userMenu"

const useDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay],
  )
}

const EditInstructorPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { instructors, loading: loadingInstructors } = useGetInstructors()
  const { updateInstructor, loading: updating } = usePutInstructor()
  const { courses, loading: coursesLoading, error: coursesError, hasLoaded, loadCoursesOnDemand } = useGetCourses()

  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [asyncValidation, setAsyncValidation] = useState({
    documento: { status: "idle", message: "" },
    correo: { status: "idle", message: "" },
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (instructors.length > 0 && id && !formData) {
      const foundInstructor = instructors.find((inst) => inst.id === id || inst._id === id)
      if (foundInstructor) {
        const fichasArray = Array.isArray(foundInstructor.fichas)
          ? foundInstructor.fichas.map((ficha) => (typeof ficha === "object" ? ficha._id || ficha.id : ficha))
          : []
        setFormData({
          nombre: foundInstructor.nombre || "",
          apellido: foundInstructor.apellido || "",
          documento: foundInstructor.documento || "",
          tipoDocumento: foundInstructor.tipoDocumento || "CC",
          telefono: foundInstructor.telefono || "",
          correo: foundInstructor.correo || "",
          fichas: fichasArray,
          estado: foundInstructor.estado || "Activo",
        })
        if (fichasArray.length > 0 && !hasLoaded) {
          loadCoursesOnDemand()
        }
      } else {
        navigate("/formacion/instructores")
      }
    }
  }, [instructors, id, formData, navigate, hasLoaded, loadCoursesOnDemand])

  // --- Lógica de Validación ---

  useEffect(() => {
    if (!formData) return
    const { nombre, apellido, documento, tipoDocumento, telefono, correo } = formData
    setErrors({
      nombre: validateNombre(nombre),
      apellido: validateApellido(apellido),
      documento: validateDocumento(documento, tipoDocumento),
      telefono: validateTelefono(telefono),
      correo: validateCorreo(correo),
    })
  }, [formData])

  const checkDocumentCallback = useCallback(
    async (doc, docType) => {
      if (validateDocumento(doc, docType)) {
        setAsyncValidation((prev) => ({ ...prev, documento: { status: "idle", message: "" } }))
        return
      }
      setAsyncValidation((prev) => ({ ...prev, documento: { status: "checking", message: "" } }))
      const result = await checkDocumentUniqueness(doc, id)
      setAsyncValidation((prev) => ({
        ...prev,
        documento: { status: result.unique ? "idle" : "error", message: result.message || "" },
      }))
    },
    [id],
  )

  const checkEmailCallback = useCallback(
    async (email) => {
      if (validateCorreo(email)) {
        setAsyncValidation((prev) => ({ ...prev, correo: { status: "idle", message: "" } }))
        return
      }
      setAsyncValidation((prev) => ({ ...prev, correo: { status: "checking", message: "" } }))
      const result = await checkEmailUniqueness(email, id)
      setAsyncValidation((prev) => ({
        ...prev,
        correo: { status: result.unique ? "idle" : "error", message: result.message || "" },
      }))
    },
    [id],
  )

  const debouncedCheckDocument = useDebouncedCallback(checkDocumentCallback, 500)
  const debouncedCheckEmail = useDebouncedCallback(checkEmailCallback, 500)

  useEffect(() => {
    if (formData?.documento) {
      debouncedCheckDocument(formData.documento, formData.tipoDocumento)
    }
  }, [formData?.documento, formData?.tipoDocumento, debouncedCheckDocument])

  useEffect(() => {
    if (formData?.correo) {
      debouncedCheckEmail(formData.correo)
    }
  }, [formData?.correo, debouncedCheckEmail])

  // --- Fin de la Lógica de Validación ---

  const isFormValid = useCallback(() => {
    if (!formData) return false
    const requiredFields = ["nombre", "apellido", "documento", "telefono", "correo"]
    if (requiredFields.some((field) => !formData[field]?.trim())) return false
    if (Object.values(errors).some((error) => error !== null)) return false
    if (Object.values(asyncValidation).some((v) => v.status === "checking" || v.status === "error")) return false
    return true
  }, [formData, errors, asyncValidation])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFichaToggle = (fichaId) => {
    setFormData((prev) => {
      const newFichas = prev.fichas.includes(fichaId)
        ? prev.fichas.filter((id) => id !== fichaId)
        : [...prev.fichas, fichaId]
      return { ...prev, fichas: newFichas }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalValidationErrors = await validateInstructorData(formData, true, id)
    if (Object.keys(finalValidationErrors).length > 0) {
      setErrors(finalValidationErrors)
      return
    }
    if (!isFormValid()) return

    try {
      await updateInstructor(id, formData)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error al actualizar instructor:", error)
      setErrors(processServerError(error))
    }
  }

  const handleCancel = () => navigate("/formacion/instructores")

  const handleSearchChange = async (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.trim() && !hasLoaded && !coursesLoading) {
      await loadCoursesOnDemand().catch((err) => console.error("Error al cargar cursos por búsqueda:", err))
    }
  }

  const getDisplayedCourses = () => {
    if (!hasLoaded || !formData) return []
    if (!searchTerm.trim()) return courses.filter((c) => formData.fichas.includes(c.id || c._id))
    const searchLower = searchTerm.toLowerCase()
    return courses.filter(
      (c) =>
        c.code?.toLowerCase().includes(searchLower) ||
        c.fk_programs?.toLowerCase().includes(searchLower) ||
        c.area?.toLowerCase().includes(searchLower) ||
        c.course_status?.toLowerCase().includes(searchLower),
    )
  }

  const displayedCourses = getDisplayedCourses()

  if (loadingInstructors || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#1f384c]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Instructores</h1>
          <UserMenu />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#1f384c]">Editar Instructor</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{errors.general}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c] ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c] ${
                    errors.apellido ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c]"
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PPT">Permiso por Protección Temporal</option>
                  <option value="PEP">Permiso Especial de Permanencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="documento"
                    value={formData.documento}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c] ${
                      errors.documento || asyncValidation.documento.status === "error"
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {asyncValidation.documento.status === "checking" && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {errors.documento && <p className="text-red-500 text-sm mt-1">{errors.documento}</p>}
                {asyncValidation.documento.status === "error" && (
                  <p className="text-red-500 text-sm mt-1">{asyncValidation.documento.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c] ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c] ${
                      errors.correo || asyncValidation.correo.status === "error" ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {asyncValidation.correo.status === "checking" && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
                {asyncValidation.correo.status === "error" && (
                  <p className="text-red-500 text-sm mt-1">{asyncValidation.correo.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f384c]"
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1f384c] mb-4">
                Fichas Asignadas
                {formData.fichas.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({formData.fichas.length} seleccionada{formData.fichas.length !== 1 ? "s" : ""})
                  </span>
                )}
              </h3>
              <div className="border border-gray-200 rounded-md">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar fichas..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    />
                    {/* Search Icon can be added here */}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto p-4">
                  {displayedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {displayedCourses.map((course) => (
                        <div
                          key={course.id || course._id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                            formData.fichas.includes(course.id || course._id)
                              ? "border-[#1f384c] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleFichaToggle(course.id || course._id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.fichas.includes(course.id || course._id)}
                            readOnly
                            className="h-4 w-4 text-[#1f384c] focus:ring-[#1f384c] border-gray-300 rounded mr-2"
                          />
                          <span>
                            {course.code} - {course.fk_programs}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      {hasLoaded ? "No se encontraron fichas." : "Escriba para buscar y cargar fichas."}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={updating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  !isFormValid() || updating || coursesLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={!isFormValid() || updating || coursesLoading}
              >
                {updating ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Actualizando...
                  </div>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={() => navigate("/formacion/instructores")}
        onConfirm={() => navigate("/formacion/instructores")}
        title="Operación Exitosa"
        message="Instructor actualizado exitosamente."
        confirmText="Aceptar"
        confirmColor="bg-green-500 hover:bg-green-600"
        showButtonCancel={false}
      />
    </div>
  )
}

export default EditInstructorPage
