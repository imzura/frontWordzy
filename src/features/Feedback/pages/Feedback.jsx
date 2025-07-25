"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import GenericTable from "../../../shared/components/Table"
import FeedbackFilters from "../components/FeedbackFilters"
import UserMenu from "../../../shared/components/userMenu"
import { getInstructors, getCourseProgrammings, getApprentices } from "../services/feedbackService"

const Feedback = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Estado de la UI
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Datos para los filtros
  const [instructors, setInstructors] = useState([])
  const [courseProgrammings, setCourseProgrammings] = useState([])
  const [allApprentices, setAllApprentices] = useState([])

  // Estado de los filtros seleccionados
  const [selectedInstructor, setSelectedInstructor] = useState("")
  const [selectedFicha, setSelectedFicha] = useState("")
  const [selectedNivel, setSelectedNivel] = useState("")

  // Resultados de la búsqueda
  const [filteredApprentices, setFilteredApprentices] = useState([])

  // Carga de datos inicial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [instructorsData, programmingsData, apprenticesData] = await Promise.all([
          getInstructors(),
          getCourseProgrammings(),
          getApprentices(),
        ])
        setInstructors(instructorsData)
        setCourseProgrammings(programmingsData)
        setAllApprentices(apprenticesData)
      } catch (err) {
        setError(err.message || "Ocurrió un error al cargar los datos iniciales.")
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  // Opciones para los selectores (derivadas del estado)
  const instructorOptions = useMemo(
    () =>
      instructors.map((instructor) => ({
        value: instructor._id,
        label: `${instructor.nombre} ${instructor.apellido}`,
      })),
    [instructors],
  )

  const fichaOptions = useMemo(() => {
    if (!selectedInstructor) return []
    const instructor = instructors.find((i) => i._id === selectedInstructor)
    if (!instructor || !instructor.fichas) return []
    return instructor.fichas.map((ficha) => ({
      value: ficha.code,
      label: `${ficha.code} - ${ficha.fk_programs}`,
      programName: ficha.fk_programs,
    }))
  }, [selectedInstructor, instructors])

  const nivelOptions = useMemo(() => {
    if (!selectedFicha) return []
    const ficha = fichaOptions.find((f) => f.value === selectedFicha)
    if (!ficha) return []
    const programming = courseProgrammings.find((p) => p.programId && p.programId.name === ficha.programName)
    if (!programming || !programming.levels) return []
    return programming.levels.map((level) => ({
      value: level.name,
      label: level.name,
    }))
  }, [selectedFicha, fichaOptions, courseProgrammings])

  // Handlers para cambios en los filtros
  const handleInstructorChange = (value) => {
    setSelectedInstructor(value)
    setSelectedFicha("")
    setSelectedNivel("")
  }

  const handleFichaChange = (value) => {
    setSelectedFicha(value)
    setSelectedNivel("")
  }

  // Lógica de búsqueda
  const handleSearch = () => {
    if (!selectedFicha) return
    setLoading(true)
    setHasSearched(true)

    const apprenticesInFicha = allApprentices.filter(
      (apprentice) => Array.isArray(apprentice.ficha) && apprentice.ficha.includes(Number(selectedFicha)),
    )

    setFilteredApprentices(apprenticesInFicha)
    setLoading(false)
  }

  const handleReset = () => {
    setSelectedInstructor("")
    setSelectedFicha("")
    setSelectedNivel("")
    setFilteredApprentices([])
    setHasSearched(false)
  }

  // Columnas para la tabla de aprendices
  const apprenticeColumns = [
    { key: "nombre", label: "Nombre", width: "25%" },
    { key: "apellido", label: "Apellido", width: "25%" },
    { key: "tipoDocumento", label: "Tipo Documento", width: "20%" },
    { key: "documento", label: "Documento", width: "20%" },
  ]

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setShowLogoutConfirm(true)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleViewDetail = (item) => {
    console.log("Ver detalle del aprendiz (funcionalidad no implementada):", item)
    // Por ahora no hace nada, como se solicitó.
  }

  if (loading && !hasSearched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando módulo de retroalimentación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1f384c]">Retroalimentación</h1>
            <p className="text-sm text-gray-600 mt-1">
              Seleccione un instructor para iniciar la búsqueda de aprendices.
            </p>
            {error && <p className="text-sm text-orange-600 mt-1">⚠️ {error}</p>}
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="container mx-auto px-6">
        <FeedbackFilters
          instructors={instructorOptions}
          fichas={fichaOptions}
          niveles={nivelOptions}
          selectedInstructor={selectedInstructor}
          selectedFicha={selectedFicha}
          selectedNivel={selectedNivel}
          onInstructorChange={handleInstructorChange}
          onFichaChange={handleFichaChange}
          onNivelChange={setSelectedNivel}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {hasSearched && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#1f384c]">
                Resultados de la Búsqueda ({filteredApprentices.length} aprendices)
              </h3>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f384c] mx-auto mb-4"></div>
                  <p className="text-gray-600">Buscando datos...</p>
                </div>
              </div>
            ) : (
              <GenericTable
                data={filteredApprentices}
                columns={apprenticeColumns}
                onShow={handleViewDetail}
                defaultItemsPerPage={10}
                showActions={{ show: true, edit: false, delete: false, add: false }}
                tooltipText="Ver detalle del aprendiz"
                showSearch={true}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Está seguro de que desea cerrar la sesión actual?"
        confirmButtonText="Cerrar Sesión"
        confirmButtonClass="bg-[#f44144] hover:bg-red-600"
      />
    </div>
  )
}

export default Feedback
