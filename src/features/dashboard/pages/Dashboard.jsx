"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Eye, RefreshCw } from "lucide-react"
import { useAuth } from "../../auth/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Tooltip from "../../../shared/components/Tooltip"
import { useDashboardData } from "../hooks/use-dashboard-data"
import DashboardDebugInfo from "./dashboard-debug-info"

// Datos de ranking (mantenemos los datos estáticos para el ranking)
const rankingDataByFicha = {
  "2889927-801": [
    { id: 1, name: "Rafael Pereira", points: 967 },
    { id: 2, name: "Brayan Restrepo", points: 724 },
    { id: 3, name: "Zurangely Portillo", points: 601 },
    { id: 4, name: "Dickson Mosquera", points: 510 },
    { id: 5, name: "Diego Alejandro", points: 508 },
  ],
  "2889927-802": [
    { id: 1, name: "María González", points: 892 },
    { id: 2, name: "Carlos Mendoza", points: 756 },
    { id: 3, name: "Ana Rodríguez", points: 643 },
    { id: 4, name: "Luis Herrera", points: 587 },
    { id: 5, name: "Sofia Martínez", points: 521 },
  ],
}

const rankingDataByPrograma = {
  "analisis-software": [
    { id: 1, name: "Kevin Ospina", points: 945 },
    { id: 2, name: "Natalia Pérez", points: 823 },
    { id: 3, name: "Julián Gómez", points: 767 },
    { id: 4, name: "Paola Díaz", points: 692 },
    { id: 5, name: "Esteban Rojas", points: 638 },
  ],
  "tecnico-programacion": [
    { id: 1, name: "Melissa Aguilar", points: 889 },
    { id: 2, name: "Nicolás Vega", points: 734 },
    { id: 3, name: "Laura Ortiz", points: 681 },
    { id: 4, name: "Felipe Guerrero", points: 625 },
    { id: 5, name: "Andrea Mejía", points: 573 },
  ],
}

const defaultRankingData = [
  { id: 1, name: "Rafael Pereira", points: 967 },
  { id: 2, name: "Brayan Restrepo", points: 724 },
  { id: 3, name: "Zurangely Portillo", points: 601 },
  { id: 4, name: "Dickson Mosquera", points: 510 },
  { id: 5, name: "Diego Alejandro", points: 508 },
]

const fichasData = [
  { id: "2889927-801", name: "2889927-801" },
  { id: "2889927-802", name: "2889927-802" },
  { id: "2889927-803", name: "2889927-803" },
  { id: "2889927-804", name: "2889927-804" },
]

const programasData = [
  { id: "analisis-software", name: "Análisis y desarrollo de software" },
  { id: "tecnico-programacion", name: "Técnico en programación" },
]

const DashboardUpdated = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [activeRankingTab, setActiveRankingTab] = useState("aprendices")
  const [selectedYear, setSelectedYear] = useState(2025)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [currentRankingData, setCurrentRankingData] = useState(defaultRankingData)

  // Estados para los selects de Ficha y Programa
  const [selectedFicha, setSelectedFicha] = useState("")
  const [showFichaDropdown, setShowFichaDropdown] = useState(false)
  const [selectedPrograma, setSelectedPrograma] = useState("")
  const [showProgramaDropdown, setShowProgramaDropdown] = useState(false)

  const { logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const yearDropdownRef = useRef(null)
  const fichaDropdownRef = useRef(null)
  const programaDropdownRef = useRef(null)

  // Hook para obtener datos del dashboard desde el backend
  const { dashboardData, loading, error, refetch, programmings, courses, apprentices } = useDashboardData()

  // Sample data for the dashboard (mantenemos algunos datos estáticos)
  const competencyData = {
    listening: 85,
    vocabulary: 50,
    grammar: 32,
    reading: 18,
    writing: 60,
  }

  const studentPoints = 862
  const completionRate = 20.79

  // Datos de lecciones por nivel (estático)
  const lessonsStatsByLevel = {
    1: { won: 60, lost: 40 },
    2: { won: 75, lost: 25 },
    3: { won: 45, lost: 55 },
    4: { won: 80, lost: 20 },
    5: { won: 30, lost: 70 },
    6: { won: 65, lost: 35 },
  }

  const [showLevelDropdown, setShowLevelDropdown] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const levelDropdownRef = useRef(null)
  const [showLessonsLevelDropdown, setShowLessonsLevelDropdown] = useState(false)
  const [selectedLessonsLevel, setSelectedLessonsLevel] = useState(1)
  const lessonsLevelDropdownRef = useRef(null)
  const [lessonsStats, setLessonsStats] = useState(lessonsStatsByLevel[1])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setShowYearDropdown(false)
      }
      if (fichaDropdownRef.current && !fichaDropdownRef.current.contains(event.target)) {
        setShowFichaDropdown(false)
      }
      if (programaDropdownRef.current && !programaDropdownRef.current.contains(event.target)) {
        setShowProgramaDropdown(false)
      }
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target)) {
        setShowLevelDropdown(false)
      }
      if (lessonsLevelDropdownRef.current && !lessonsLevelDropdownRef.current.contains(event.target)) {
        setShowLessonsLevelDropdown(false)
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

  const handleYearSelect = (year) => {
    setSelectedYear(year)
    setShowYearDropdown(false)
    // Aquí podrías agregar lógica para filtrar por año si es necesario
  }

  const navigateToLevelDetail = (level) => {
    sessionStorage.setItem("selectedNivelId", level.id)
    sessionStorage.setItem("selectedNivelNombre", level.nivel)
    navigate("/progreso/cursosProgramados/fichas")
  }

  // Helper function to get status color based on progress percentage
  const getStatusColor = (progress) => {
    const percentage = Number.parseInt(progress)
    if (percentage >= 80) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-300"
    return "bg-red-500"
  }

  // Helper function to get color for competency bars based on percentage
  const getCompetencyColor = (value) => {
    if (value >= 80) return "bg-blue-400"
    if (value >= 50) return "bg-yellow-400"
    return "bg-red-500"
  }

  const updateRankingData = () => {
    if (activeRankingTab === "ficha" && selectedFicha) {
      setCurrentRankingData(rankingDataByFicha[selectedFicha] || defaultRankingData)
    } else if (activeRankingTab === "programa" && selectedPrograma) {
      setCurrentRankingData(rankingDataByPrograma[selectedPrograma] || defaultRankingData)
    } else {
      setCurrentRankingData(defaultRankingData)
    }
  }

  useEffect(() => {
    updateRankingData()
  }, [activeRankingTab, selectedFicha, selectedPrograma])

  // Generar años disponibles (2025 en adelante)
  const currentYear = new Date().getFullYear()
  const availableYears = []
  for (let year = Math.max(2025, currentYear); year <= currentYear + 5; year++) {
    availableYears.push(year)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white py-3 px-4 sm:px-6 border-b border-[#d6dade] shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f384c]">Dashboard</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-[#1f384c] font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <span>Administrador</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-[#f44144] hover:bg-gray-50 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-[#1f384c]">Cerrar Sesión</h3>
                      <p className="mt-2 text-[#627b87]">¿Está seguro de que desea cerrar la sesión actual?</p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        className="px-6 py-2.5 border border-[#d9d9d9] rounded-lg text-[#627b87] hover:bg-gray-50 font-medium transition-colors"
                        onClick={() => setShowLogoutConfirm(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-6 py-2.5 bg-[#f44144] text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Estadísticas generales */}
        {/* {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-sm font-medium text-gray-500">Total Fichas con Programación</h3>
              <p className="text-2xl font-bold text-blue-600">{dashboardData.totalStats.totalFichas}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-sm font-medium text-gray-500">Total Aprendices</h3>
              <p className="text-2xl font-bold text-green-600">{dashboardData.totalStats.totalApprentices}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-sm font-medium text-gray-500">Niveles Disponibles</h3>
              <p className="text-2xl font-bold text-purple-600">{dashboardData.totalStats.totalLevels}</p>
            </div>
          </div>
        )} */}

        {/* Componente de debug */}
        {/* {!loading && (
          <DashboardDebugInfo
            dashboardData={dashboardData}
            programmings={programmings}
            courses={courses}
            apprentices={apprentices}
          />
        )} */}

        {/* Two Column Layout for Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Ranking Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-[#1f384c] mb-4">Ranking de Aprendices</h2>

              {/* Ranking Tabs */}
              <div className="flex border-b border-gray-200 mb-5">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeRankingTab === "aprendices" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveRankingTab("aprendices")}
                >
                  Aprendices
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeRankingTab === "ficha" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveRankingTab("ficha")}
                >
                  Ficha
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeRankingTab === "programa" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                  }`}
                  onClick={() => setActiveRankingTab("programa")}
                >
                  Programa
                </button>
              </div>

              {/* Ranking Charts */}
              <div>
                {/* Aprendices Chart */}
                <div className={`${activeRankingTab === "aprendices" ? "block" : "hidden"}`}>
                  <div className="space-y-3">
                    {currentRankingData.map((student) => (
                      <div key={student.id} className="flex items-center">
                        <div className="w-6 text-sm font-medium text-gray-700 mr-2">{student.id}</div>
                        <div className="w-28 sm:w-32 text-sm text-gray-700 mr-2 truncate">{student.name}</div>
                        <div className="flex-1">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-yellow-500 h-3 rounded-full"
                                  style={{
                                    width: `${(student.points / 1000) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 ml-2">{student.points}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ficha Chart */}
                <div className={`${activeRankingTab === "ficha" ? "block" : "hidden"}`}>
                  <div className="mb-4">
                    <div className="relative" ref={fichaDropdownRef}>
                      <button
                        onClick={() => setShowFichaDropdown(!showFichaDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <span className="text-gray-500">
                          {selectedFicha ? fichasData.find((f) => f.id === selectedFicha)?.name : "Seleccionar ficha"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            showFichaDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showFichaDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                          {fichasData.map((ficha) => (
                            <button
                              key={ficha.id}
                              onClick={() => {
                                setSelectedFicha(ficha.id)
                                setShowFichaDropdown(false)
                              }}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                                ficha.id === selectedFicha ? "bg-blue-50 text-blue-600" : "text-gray-700"
                              }`}
                            >
                              {ficha.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentRankingData.map((student) => (
                      <div key={student.id} className="flex items-center">
                        <div className="w-6 text-sm font-medium text-gray-700 mr-2">{student.id}</div>
                        <div className="w-28 sm:w-32 text-sm text-gray-700 mr-2 truncate">{student.name}</div>
                        <div className="flex-1">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-indigo-500 h-3 rounded-full"
                                  style={{
                                    width: `${(student.points / 1000) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 ml-2">{student.points}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Programa Chart */}
                <div className={`${activeRankingTab === "programa" ? "block" : "hidden"}`}>
                  <div className="mb-4">
                    <div className="relative" ref={programaDropdownRef}>
                      <button
                        onClick={() => setShowProgramaDropdown(!showProgramaDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <span className="text-gray-500">
                          {selectedPrograma
                            ? programasData.find((p) => p.id === selectedPrograma)?.name
                            : "Seleccionar programa"}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            showProgramaDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showProgramaDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                          {programasData.map((programa) => (
                            <button
                              key={programa.id}
                              onClick={() => {
                                setSelectedPrograma(programa.id)
                                setShowProgramaDropdown(false)
                              }}
                              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                                programa.id === selectedPrograma ? "bg-blue-50 text-blue-600" : "text-gray-700"
                              }`}
                            >
                              {programa.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentRankingData.map((student) => (
                      <div key={student.id} className="flex items-center">
                        <div className="w-6 text-sm font-medium text-gray-700 mr-2">{student.id}</div>
                        <div className="w-28 sm:w-32 text-sm text-gray-700 mr-2 truncate">{student.name}</div>
                        <div className="flex-1">
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between">
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-green-500 h-3 rounded-full"
                                  style={{
                                    width: `${(student.points / 1000) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 ml-2">{student.points}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#1f384c]">Promedio de lecciones</h2>
                <div className="relative" ref={lessonsLevelDropdownRef}>
                  <button
                    onClick={() => setShowLessonsLevelDropdown(!showLessonsLevelDropdown)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    NIVEL {selectedLessonsLevel || 1}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${showLessonsLevelDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showLessonsLevelDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[100px]">
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLessonsLevel(level)
                            setLessonsStats(lessonsStatsByLevel[level])
                            setShowLessonsLevelDropdown(false)
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${
                            level === selectedLessonsLevel ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          Nivel {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="relative w-[240px] h-[240px] mb-6">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#e6e6e6" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={2 * Math.PI * 70 - (2 * Math.PI * 70 * lessonsStats.won) / 100}
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray={`${(2 * Math.PI * 70 * lessonsStats.lost) / 100} ${
                        2 * Math.PI * 70 - (2 * Math.PI * 70 * lessonsStats.lost) / 100
                      }`}
                      strokeDashoffset={2 * Math.PI * 70 - (2 * Math.PI * 70 * lessonsStats.won) / 100}
                      transform="rotate(-90 100 100)"
                    />
                    <circle cx="100" cy="100" r="50" fill="white" />
                    <text
                      x="100"
                      y="90"
                      textAnchor="middle"
                      fontSize="14"
                      fill="#627b87"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
                    >
                      Total
                    </text>
                    <text
                      x="100"
                      y="120"
                      textAnchor="middle"
                      fontSize="28"
                      fontWeight="bold"
                      fill="#1f384c"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif"
                    >
                      100%
                    </text>
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">Ganadas</span>
                    <span className="font-bold text-green-600 text-xl ml-2">{lessonsStats.won}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Perdidas</span>
                    <span className="font-bold text-red-600 text-xl ml-2">{lessonsStats.lost}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Language Competency Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1f384c]">Competencias lingüísticas</h2>
                <div className="relative" ref={levelDropdownRef}>
                  <button
                    onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    NIVEL {selectedLevel || 1}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${showLevelDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showLevelDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[100px]">
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <button
                          key={level}
                          onClick={() => {
                            setSelectedLevel(level)
                            setShowLevelDropdown(false)
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${
                            level === selectedLevel ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          Nivel {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap mb-8 gap-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Bueno</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Intermedio</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Bajo</span>
                </div>
              </div>

              <div className="relative mt-4">
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                  <span>0%</span>
                </div>

                <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="border-t border-gray-200 w-full"></div>
                </div>

                <div className="grid grid-cols-5 gap-3 ml-8">
                  {Object.entries(competencyData).map(([skill, value]) => (
                    <div key={skill} className="flex flex-col items-center">
                      <div className="h-40 w-10 bg-gray-100 rounded-md relative mb-2">
                        <div
                          className={`absolute bottom-0 w-full rounded-md ${getCompetencyColor(value)}`}
                          style={{ height: `${value}%` }}
                        ></div>
                        <div className="absolute -top-8 left-0 right-0 text-center text-xs font-medium text-blue-600">
                          {value}%
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 capitalize">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progreso de niveles - CONECTADO CON BACKEND */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-[470px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1f384c]">Progreso de niveles</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium">AÑO</div>
                  {loading && (
                    <button
                      onClick={refetch}
                      disabled={loading}
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                      {loading ? "Cargando..." : "Actualizar"}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-4 justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Año:</span>
                  <div className="relative inline-block" ref={yearDropdownRef}>
                    <button
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      {selectedYear}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${showYearDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showYearDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[100px]">
                        {availableYears.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${
                              year === selectedYear ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                    <span className="text-xs text-gray-600">Bueno</span>
                  </div>
                  <div className="flex items-center ml-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-300 mr-1.5"></div>
                    <span className="text-xs text-gray-600">Intermedio</span>
                  </div>
                  <div className="flex items-center ml-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
                    <span className="text-xs text-gray-600">Bajo</span>
                  </div>
                </div>
              </div>

              {/* Mostrar estado de carga o error */}
              {loading && (
                <div className="flex-grow flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">Cargando datos del backend...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex-grow flex items-center justify-center">
                  <div className="text-center text-red-500">
                    <p className="font-semibold">Error al cargar datos</p>
                    <p className="text-sm">{error}</p>
                    <button
                      onClick={refetch}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}

              {/* Tabla de progreso - DATOS REALES DEL BACKEND */}
              {!loading && !error && (
                <div className="flex-grow overflow-hidden">
                  {dashboardData.levelProgress.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <p className="font-semibold">No hay datos disponibles</p>
                        <p className="text-sm">
                          No se encontraron fichas con programación de inglés para el año {selectedYear}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                            Nivel
                          </th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center py-2">
                            Fichas
                          </th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center py-2">
                            Aprendices
                          </th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                            Progreso
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.levelProgress.map((course) => (
                          <tr key={course.id} className="border-t border-gray-100">
                            <td className="py-2 text-sm text-gray-700">{course.nivel}</td>
                            <td className="py-2 text-sm text-gray-700 text-center">{course.cantidadFichas}</td>
                            <td className="py-2 text-sm text-gray-700 text-center">{course.cantidadAprendices}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-2 w-full">
                                <div className="flex-1 min-w-[100px]">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getStatusColor(course.progreso)}`}
                                      style={{ width: course.progreso }}
                                    ></div>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-600 text-right">{course.progreso}</span>
                              </div>
                            </td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardUpdated
