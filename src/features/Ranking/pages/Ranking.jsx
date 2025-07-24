"use client"

import { useState, useRef } from "react"
import { ChevronDown, Globe, FileText, Calendar, Filter } from "lucide-react"
import { useGetRankingMetrics } from "../hooks/useGetRankingMetrics"
import { useGetStudentsByCourse } from "../hooks/useGetStudentsByCourse"
import { useGetStudentsByProgram } from "../hooks/useGetStudentsByProgram"
import { generateRealRanking } from "../services/rankingService"
import FilterDropdown from "../components/FilterDropdown"
import RankingCard from "../components/RankingCard"
import UserMenu from "../../../shared/components/userMenu"

const Ranking = () => {
  // Estado para el año y mes seleccionados
  const [selectedYear, setSelectedYear] = useState(2024)
  const [selectedMonth, setSelectedMonth] = useState("Mayo")
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const monthDropdownRef = useRef(null)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const yearDropdownRef = useRef(null)

  // Estados para los filtros
  const [selectedFicha, setSelectedFicha] = useState("")
  const [selectedPrograma, setSelectedPrograma] = useState("")

  // Hook para obtener datos generales de la API
  const {
    metrics,
    fichas,
    programas,
    students,
    allStudents,
    loading,
    error,
    refetch,
    updateFichasByPrograma,
    updateProgramasByFicha,
  } = useGetRankingMetrics()

  // Hooks para obtener estudiantes específicos por ficha y programa
  const { students: studentsByFicha, loading: loadingStudentsByFicha } = useGetStudentsByCourse(selectedFicha)
  const { students: studentsByPrograma, loading: loadingStudentsByPrograma } = useGetStudentsByProgram(selectedPrograma)

  // Lista de meses
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  // Función para seleccionar un año
  const handleYearSelect = (year) => {
    setSelectedYear(year)
    setIsYearDropdownOpen(false)
  }

  // Función para seleccionar un mes
  const handleMonthSelect = (month) => {
    setSelectedMonth(month)
    setIsMonthDropdownOpen(false)
  }

  // Función para alternar el menú desplegable de meses
  const toggleMonthDropdown = () => {
    setIsMonthDropdownOpen(!isMonthDropdownOpen)
  }

  // Función para alternar el menú desplegable de años
  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen)
  }

  // Manejar selección de ficha
  const handleFichaSelect = (ficha) => {
    console.log("🎯 Ficha selected:", ficha)
    setSelectedFicha(ficha)

    if (ficha) {
      // Actualizar programas basado en la ficha seleccionada
      updateProgramasByFicha(ficha)

      // Limpiar selección de programa si no está relacionado con la ficha
      if (selectedPrograma) {
        const programasRelacionados = programas.filter((p) =>
          allStudents.some((student) => student.ficha?.includes(ficha) && student.programa === p.id),
        )
        if (!programasRelacionados.some((p) => p.id === selectedPrograma)) {
          setSelectedPrograma("")
        }
      }
    } else {
      // Si se limpia la ficha, restaurar todos los programas
      updateProgramasByFicha(null)
    }
  }

  // Manejar selección de programa
  const handleProgramaSelect = (programa) => {
    console.log("🎯 Programa selected:", programa)
    setSelectedPrograma(programa)

    if (programa) {
      // Actualizar fichas basado en el programa seleccionado
      updateFichasByPrograma(programa)

      // Limpiar selección de ficha si no está relacionada con el programa
      if (selectedFicha) {
        const fichasRelacionadas = fichas.filter((f) =>
          allStudents.some((student) => student.programa === programa && student.ficha?.includes(f.id)),
        )
        if (!fichasRelacionadas.some((f) => f.id === selectedFicha)) {
          setSelectedFicha("")
        }
      }
    } else {
      // Si se limpia el programa, restaurar todas las fichas
      updateFichasByPrograma(null)
    }
  }

  // Generar datos de ranking basados en datos reales de la API
  const generateRankingData = (type, filterValue = null) => {
    console.log(`🎯 generateRankingData called with type: ${type}, filterValue: ${filterValue}`)

    const studentsToUse = allStudents
    let result = []

    switch (type) {
      case "aprendices":
        // Usar todos los estudiantes para el ranking general
        result = generateRealRanking(studentsToUse, "general")
        console.log(`📊 Top Ranking de Aprendices: ${result.length} students`)
        break

      case "ficha":
        if (filterValue && studentsByFicha.length > 0) {
          // Usar estudiantes específicos de la ficha seleccionada
          result = generateRealRanking(studentsByFicha, "ficha", filterValue)
          console.log(`📊 Ficha ${filterValue}: ${result.length} students`)
        } else {
          // Si no hay filtro, mostrar todos los estudiantes
          result = generateRealRanking(studentsToUse, "general")
          console.log(`📊 All students for ficha: ${result.length} students`)
        }
        break

      case "programa":
        if (filterValue && studentsByPrograma.length > 0) {
          // Usar estudiantes específicos del programa seleccionado
          result = generateRealRanking(studentsByPrograma, "programa", filterValue)
          console.log(`📊 Programa ${filterValue}: ${result.length} students`)
        } else {
          // Si no hay filtro, mostrar todos los estudiantes
          result = generateRealRanking(studentsToUse, "general")
          console.log(`📊 All students for programa: ${result.length} students`)
        }
        break

      default:
        result = generateRealRanking(studentsToUse, "general")
    }

    console.log(`🎯 generateRankingData result for ${type}:`, result.length)
    return result
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error al cargar los datos</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-[#1f384c] text-white rounded hover:bg-[#2a4a5c]">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Ranking</h1>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Filtros de año y mes */}
        <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-[#d6dade]">
          <div className="flex items-center">
            <div className="bg-gray-50 p-2 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-[#1f384c]" />
            </div>
            <span className="text-sm font-medium text-[#1f384c] mr-3">Filtros:</span>
          </div>

          <div className="flex items-center">
            <span className="text-xs font-medium text-[#1f384c] mr-2">Año</span>
            <div className="relative" ref={yearDropdownRef}>
              <button
                className="flex items-center justify-between min-w-[80px] px-3 py-1.5 bg-white text-[#1f384c] text-xs rounded-md border border-[#d6dade] hover:bg-gray-50 transition-all duration-200 shadow-sm"
                onClick={toggleYearDropdown}
              >
                <span className="font-medium">{selectedYear}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 ml-2 transition-transform duration-200 ${
                    isYearDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[100px] bg-white border border-[#d6dade] rounded-lg shadow-lg z-20 py-2">
                  {[2023, 2024, 2025].map((year) => (
                    <button
                      key={year}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                        selectedYear === year
                          ? "bg-blue-50 text-[#1f384c] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-xs font-medium text-[#1f384c] mr-2">Mes</span>
            <div className="relative" ref={monthDropdownRef}>
              <button
                className="flex items-center justify-between min-w-[120px] px-3 py-1.5 bg-white text-[#1f384c] text-xs rounded-md border border-[#d6dade] hover:bg-gray-50 transition-all duration-200 shadow-sm"
                onClick={toggleMonthDropdown}
              >
                <span className="font-medium">{selectedMonth}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 ml-2 transition-transform duration-200 ${
                    isMonthDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMonthDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[180px] bg-white border border-[#d6dade] rounded-lg shadow-lg z-20 py-2">
                  {months.map((month) => (
                    <button
                      key={month}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors ${
                        selectedMonth === month
                          ? "bg-blue-50 text-[#1f384c] font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleMonthSelect(month)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center">
            <div className="bg-blue-50 px-3 py-1.5 rounded-md text-xs text-[#1f384c] font-medium flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              Periodo: {selectedMonth} {selectedYear}
            </div>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta Top Ranking de Aprendices */}
          <div className="p-6 flex items-center justify-between bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 transition-all duration-300 hover:shadow-md hover:bg-blue-50/30 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1f384c]">Top Ranking de Aprendices</p>
                <h2 className="text-3xl font-bold text-blue-500">{loading ? "..." : metrics.aprendices}</h2>
              </div>
            </div>
          </div>

          {/* Tarjeta Total de Fichas */}
          <div className="p-6 flex items-center justify-between bg-white rounded-lg shadow-sm border-l-4 border-l-purple-500 transition-all duration-300 hover:shadow-md hover:bg-purple-50/30 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1f384c]">Total de Fichas</p>
                <h2 className="text-3xl font-bold text-purple-500">{loading ? "..." : metrics.fichas}</h2>
              </div>
            </div>
          </div>

          {/* Tarjeta Total de Programas */}
          <div className="p-6 flex items-center justify-between bg-white rounded-lg shadow-sm border-l-4 border-l-green-500 transition-all duration-300 hover:shadow-md hover:bg-green-50/30 cursor-pointer">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1f384c]">Total de Programas</p>
                <h2 className="text-3xl font-bold text-green-500">{loading ? "..." : metrics.programas}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Información de filtros activos */}
        {(selectedFicha || selectedPrograma) && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filtros activos:</span>
              {selectedFicha && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                  Ficha: {selectedFicha} ({studentsByFicha.length} estudiantes)
                </span>
              )}
              {selectedPrograma && (
                <span className="bg-blue-100 px-2 py-1 rounded text-xs">
                  Programa: {selectedPrograma} ({studentsByPrograma.length} estudiantes)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sección de tablas */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
            {/* Top Ranking de Aprendices */}
            <RankingCard
              title="Top Ranking de Aprendices"
              icon={<Globe className="h-4 w-4" />}
              color="blue"
              data={generateRankingData("aprendices")}
              loading={loading}
            />

            {/* Total de Fichas */}
            <RankingCard
              title="Total de Fichas"
              icon={<FileText className="h-4 w-4" />}
              color="purple"
              data={generateRankingData("ficha", selectedFicha)}
              loading={loading || loadingStudentsByFicha}
              filterComponent={
                <FilterDropdown
                  options={fichas}
                  selectedValue={selectedFicha}
                  onSelect={handleFichaSelect}
                  placeholder="Seleccionar ficha"
                  displayKey="name"
                  valueKey="id"
                  loading={loading}
                />
              }
            />

            {/* Total de Programas */}
            <RankingCard
              title="Total de Programas"
              icon={<Calendar className="h-4 w-4" />}
              color="green"
              data={generateRankingData("programa", selectedPrograma)}
              loading={loading || loadingStudentsByPrograma}
              filterComponent={
                <FilterDropdown
                  options={programas}
                  selectedValue={selectedPrograma}
                  onSelect={handleProgramaSelect}
                  placeholder="Seleccionar programa"
                  displayKey="name"
                  valueKey="id"
                  loading={loading}
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ranking
