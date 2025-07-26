"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Tooltip from "../../../../shared/components/Tooltip"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../../shared/utils/dateFormatter"

export default function ProgrammingDetails({ programming }) {
  const navigate = useNavigate()
  const [expandedLevels, setExpandedLevels] = useState({})
  const [expandedThemes, setExpandedThemes] = useState({})
  const [activeTabsByTheme, setActiveTabsByTheme] = useState({})
  const [currentPageByTheme, setCurrentPageByTheme] = useState({})
  const [itemsPerPage] = useState(5)

  const toggleLevelExpand = (levelId) => {
    setExpandedLevels((prev) => ({ ...prev, [levelId]: !prev[levelId] }))
  }

  const toggleThemeExpand = (levelId, themeId) => {
    const key = `${levelId}-${themeId}`
    setExpandedThemes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setActiveTab = (levelId, themeId, tab) => {
    const key = `${levelId}-${themeId}`
    setActiveTabsByTheme((prev) => ({ ...prev, [key]: tab }))
    setCurrentPageByTheme((prev) => ({ ...prev, [key]: 1 }))
  }

  const getActiveTab = (levelId, themeId) => {
    const key = `${levelId}-${themeId}`
    return activeTabsByTheme[key] || "Actividades"
  }

  const getCurrentPage = (levelId, themeId) => {
    const key = `${levelId}-${themeId}`
    return currentPageByTheme[key] || 1
  }

  const setCurrentPage = (levelId, themeId, page) => {
    const key = `${levelId}-${themeId}`
    setCurrentPageByTheme((prev) => ({ ...prev, [key]: page }))
  }

  const getThemeName = (theme) => {
    return theme.selectedTheme?.name || `Tema ${theme._id || theme.id || "sin ID"}`
  }

  const handleBackClick = () => {
    navigate("/programacion/programacionCursos")
  }

  const handlePageChange = (levelId, themeId, pageNumber) => {
    setCurrentPage(levelId, themeId, pageNumber)
  }

  const calculateLevelCompletion = (level) => {
    if (!level.name || level.name.trim() === "") return false
    if (!level.themes || level.themes.length === 0) return false

    const themesSum = level.themes.reduce((sum, theme) => sum + (theme.progress || 0), 0)
    if (themesSum !== 100) return false

    for (const theme of level.themes) {
      if (!theme.selectedTheme) return false

      const activities = (theme.activities || []).filter((a) => a.type === "Actividades")
      if (activities.length === 0) return false

      const actSum = activities.reduce((sum, a) => {
        const value = Number.parseInt(a.value?.toString().replace("%", "") || 0)
        return sum + value
      }, 0)
      if (actSum !== 100) return false

      const exams = (theme.activities || []).filter((a) => a.type === "Exámenes")
      if (exams.length === 0) return false

      const examSum = exams.reduce((sum, e) => {
        const value = Number.parseInt(e.value?.toString().replace("%", "") || 0)
        return sum + value
      }, 0)
      if (examSum !== 100) return false

      const materials = (theme.activities || []).filter((a) => a.type === "Material")
      if (materials.length === 0) return false
    }

    return true
  }

  const getValidationTooltip = (level) => {
    const themesSum = level.themes?.reduce((sum, theme) => sum + (theme.progress || 0), 0) || 0
    return `Suma de temas: ${themesSum}% (debe ser 100%)`
  }

  const getDisplayName = (item, type) => {
    if (item.name) {
      return item.name
    }
    if (type === "Actividades" || type === "Exámenes") {
      return `Evaluación (ID: ${item.evaluationId?._id || item.evaluationId || "N/A"})`
    }
    if (type === "Material") {
      return `Material (ID: ${item.materialId?._id || item.materialId || "N/A"})`
    }
    return "Sin nombre"
  }

  return (
    <div className="max-w-10xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#1f384c] mb-3">Detalle de la Programación</h1>
      </header>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Programa</label>
            <div className="px-2 py-1.5 bg-white rounded-md text-gray-800 text-sm border border-gray-200">
              {programming.nombre}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Estado</label>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
                programming.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {programming.estado}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50">
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de Inicio</label>
            <div className="px-2 py-1.5 bg-white rounded-md text-gray-800 text-sm border border-gray-200">
              {programming.fechaInicio}
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de Fin</label>
            <div className="px-2 py-1.5 bg-white rounded-md text-gray-800 text-sm border border-gray-200">
              {programming.fechaFin || "No definida"}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-bold text-[#1f384c] mb-3">Niveles</h2>

          {programming.levels?.length > 0 ? (
            <div className="space-y-3">
              {programming.levels.map((level) => (
                <div key={level._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div
                    className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => toggleLevelExpand(level._id)}
                  >
                    <h3 className="text-base font-bold text-gray-800">{level.name}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block ${
                          level.completed !== undefined
                            ? level.completed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            : calculateLevelCompletion(level)
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {level.completed !== undefined
                          ? level.completed
                            ? "Completado"
                            : "Sin completar"
                          : calculateLevelCompletion(level)
                            ? "Completado"
                            : "Sin completar"}
                      </span>
                      {expandedLevels[level._id] ? (
                        <FiChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {expandedLevels[level._id] && (
                    <div className="p-3 border-t border-gray-200 bg-white">
                      {level.themes?.length > 0 ? (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-[#1f384c] mb-3">Temas</h5>
                          {level.themes.map((theme) => (
                            <div key={theme._id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div
                                className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleThemeExpand(level._id, theme._id)}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <h4 className="text-sm font-semibold text-gray-700">{getThemeName(theme)}</h4>
                                  {theme.value > 0 && (
                                    <span className="text-sm font-medium text-gray-600">{theme.value}%</span>
                                  )}
                                </div>
                                {expandedThemes[`${level._id}-${theme._id}`] ? (
                                  <FiChevronUp className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                                )}
                              </div>

                              {expandedThemes[`${level._id}-${theme._id}`] && (
                                <div className="p-3 border-t border-gray-200 bg-white">
                                  {theme.activities?.length > 0 ? (
                                    <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                                      <div className="flex border-b border-gray-200">
                                        {["Actividades", "Exámenes", "Material"].map((tab) => (
                                          <button
                                            key={tab}
                                            className={`flex-1 px-4 py-2.5 text-sm font-medium text-center transition-colors ${
                                              getActiveTab(level._id, theme._id) === tab
                                                ? "bg-blue-50 border-b-2 border-[#1f384c] text-[#1f384c]"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                            }`}
                                            onClick={() => setActiveTab(level._id, theme._id, tab)}
                                          >
                                            {tab}
                                          </button>
                                        ))}
                                      </div>
                                      <div className="p-3 bg-white">
                                        {(() => {
                                          const allItems = theme.activities || []
                                          const filteredItems = allItems.filter(
                                            (item) => item.type === getActiveTab(level._id, theme._id),
                                          )
                                          const currentPage = getCurrentPage(level._id, theme._id)
                                          const currentData = filteredItems.slice(
                                            (currentPage - 1) * itemsPerPage,
                                            currentPage * itemsPerPage,
                                          )
                                          const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

                                          return (
                                            <div className="border border-gray-200 rounded-md">
                                              <table className="w-full table-auto">
                                                <thead>
                                                  <tr className="border-b border-gray-200">
                                                    <th className="bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                                      Nombre
                                                    </th>
                                                    <th className="bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 w-20">
                                                      Valor
                                                    </th>
                                                    <th className="bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 w-24">
                                                      Acciones
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {currentData.map((item) => (
                                                    <tr
                                                      key={item._id}
                                                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                    >
                                                      <td className="px-3 py-2 text-sm text-left text-gray-800">
                                                        {getDisplayName(item, item.type)}
                                                      </td>
                                                      <td className="px-3 py-2 text-sm text-left text-gray-800">
                                                        {item.value !== undefined && item.value !== null
                                                          ? `${item.value}%`
                                                          : "N/A"}
                                                      </td>
                                                      <td className="px-3 py-2 text-center">
                                                        <Tooltip text="Ver Detalle" position="top">
                                                          <button
                                                            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            onClick={() => item.onDetail?.()}
                                                          >
                                                            <Eye className="h-4 w-4 text-[#1f384c]" />
                                                          </button>
                                                        </Tooltip>
                                                      </td>
                                                    </tr>
                                                  ))}
                                                  {currentData.length === 0 && (
                                                    <tr>
                                                      <td
                                                        colSpan={3}
                                                        className="px-3 py-4 text-sm text-center text-gray-500"
                                                      >
                                                        No hay{" "}
                                                        {getActiveTab(level._id, theme._id) === "Material"
                                                          ? "materiales"
                                                          : getActiveTab(level._id, theme._id) === "Exámenes"
                                                            ? "exámenes"
                                                            : "actividades"}{" "}
                                                        agregados
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                              </table>
                                              <div className="flex justify-between items-center px-3 py-2 bg-gray-100 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                  {filteredItems.length} elementos
                                                </div>

                                                {filteredItems.length > 0 && (
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                      Página {currentPage} de {totalPages > 0 ? totalPages : 1}
                                                    </span>

                                                    <div className="flex gap-1">
                                                      <button
                                                        onClick={() =>
                                                          handlePageChange(
                                                            level._id,
                                                            theme._id,
                                                            Math.max(1, currentPage - 1),
                                                          )
                                                        }
                                                        disabled={currentPage === 1}
                                                        className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Página anterior"
                                                      >
                                                        <FiChevronLeft size={14} className="text-gray-700" />
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          handlePageChange(
                                                            level._id,
                                                            theme._id,
                                                            Math.min(totalPages, currentPage + 1),
                                                          )
                                                        }
                                                        disabled={currentPage === totalPages || totalPages === 0}
                                                        className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Página siguiente"
                                                      >
                                                        <FiChevronRight size={14} className="text-gray-700" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        })()}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 p-3">
                                      No hay actividades, exámenes o materiales configurados para este tema.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 p-3">No hay temas configurados</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 border rounded-lg bg-gray-50">
              No hay niveles configurados para esta programación
            </div>
          )}
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-6 flex justify-center">
        <button
          onClick={handleBackClick}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors shadow-md"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
