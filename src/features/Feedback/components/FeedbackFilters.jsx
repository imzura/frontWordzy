"use client"

import { Search, RotateCcw } from "lucide-react"
import SearchableSelect from "./SearchableSelect"

const FeedbackFilters = ({
  instructors,
  fichas,
  niveles,
  selectedInstructor,
  selectedFicha,
  selectedNivel,
  onInstructorChange,
  onFichaChange,
  onNivelChange,
  onSearch,
  onReset,
  loading,
}) => {
  const handleSearch = () => {
    onSearch()
  }

  const hasActiveFilters = selectedInstructor || selectedFicha || selectedNivel
  const canSearch = selectedInstructor && selectedFicha && selectedNivel && !loading

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#1f384c]">Filtros de Búsqueda</h3>
        {hasActiveFilters && (
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {[selectedInstructor, selectedFicha, selectedNivel].filter(Boolean).length} filtro(s) activo(s)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Selector de Instructor */}
        <SearchableSelect
          options={instructors}
          value={selectedInstructor}
          onChange={onInstructorChange}
          placeholder="Seleccionar instructor"
          label="Instructor"
          disabled={loading}
        />

        {/* Selector de Ficha */}
        <SearchableSelect
          options={fichas}
          value={selectedFicha}
          onChange={onFichaChange}
          placeholder="Seleccionar ficha"
          label="Ficha"
          disabled={!selectedInstructor || loading}
        />

        {/* Selector de Nivel */}
        <SearchableSelect
          options={niveles}
          value={selectedNivel}
          onChange={onNivelChange}
          placeholder="Seleccionar nivel"
          label="Nivel"
          disabled={!selectedFicha || loading}
        />

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
              canSearch
                ? "bg-[#1f384c] text-white hover:bg-[#2a4a64] focus:outline-none focus:ring-2 focus:ring-[#1f384c] focus:ring-offset-2"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Buscar
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={loading || !hasActiveFilters}
            className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
              hasActiveFilters && !loading
                ? "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                : "border border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {selectedInstructor && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Instructor: {instructors.find((i) => i.value === selectedInstructor)?.label}
              </span>
            )}
            {selectedFicha && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Ficha: {fichas.find((f) => f.value === selectedFicha)?.label}
              </span>
            )}
            {selectedNivel && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Nivel: {selectedNivel}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackFilters
