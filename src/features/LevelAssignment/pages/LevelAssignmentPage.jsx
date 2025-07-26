"use client"

import { useState } from "react"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"

// Hooks actualizados con API
import { useFichaSearchAPI } from "../hooks/useFichaSearchAPI"
import { useRecentFichas } from "../hooks/useRecentFichas"
import { useLevelManagementAPI } from "../hooks/useLevelManagementAPI"

// Componentes
import SearchView from "../components/SearchView"
import LevelsView from "../components/LevelsView"
import UserMenu from "../../../shared/components/userMenu"

const LevelAssignmentPage = () => {
  // Estados locales
  const [currentView, setCurrentView] = useState("search")
  const [selectedFicha, setSelectedFicha] = useState(null)

  // Estados para modales
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [showChangeConfirm, setShowChangeConfirm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [pendingFichaChange, setPendingFichaChange] = useState(null)
  // Nuevo estado para el modal de nivel no completado
  const [showUncompletedLevelModal, setShowUncompletedLevelModal] = useState(false)
  const [uncompletedLevelName, setUncompletedLevelName] = useState("")

  // Hooks personalizados actualizados
  const {
    searchTerm,
    searchResults,
    showSearchResults,
    isLoading: isSearchLoading,
    error: searchError,
    handleSearchInputChange,
    clearSearch,
    setShowSearchResults,
  } = useFichaSearchAPI()

  const { recentFichas, addRecentFicha, clearRecentFichas } = useRecentFichas()

  const {
    currentLevelStates,
    tempLevelStates,
    hasChanges,
    isSaving,
    isLoading: isLevelsLoading,
    error: levelsError,
    fichaInfo,
    handleLevelToggle,
    handleQuickAction,
    saveLevels,
    resetChanges,
  } = useLevelManagementAPI(selectedFicha)

  const handleSelectFicha = (ficha) => {
    // Si hay cambios sin guardar, mostrar confirmación
    if (hasChanges) {
      setPendingFichaChange(ficha)
      setShowChangeConfirm(true)
      return
    }

    proceedWithFichaChange(ficha)
  }

  const proceedWithFichaChange = (ficha) => {
    setSelectedFicha(ficha)
    setCurrentView("levels")
    clearSearch()
    addRecentFicha(ficha)
  }

  const handleSaveChanges = () => {
    setShowSaveConfirm(true)
  }

  const confirmSaveChanges = async () => {
    const result = await saveLevels()
    setShowSaveConfirm(false)
    setSuccessMessage(result.message)
    setShowSuccessModal(true)

    // Calcular los niveles activos y totales actualizados
    const updatedNivelesActivos = Object.values(tempLevelStates).filter(Boolean).length
    const updatedTotalNiveles = fichaInfo?.programmingInfo?.levels?.length || 0

    // Crear un objeto de ficha actualizado para addRecentFicha
    const updatedFichaForRecent = {
      ...selectedFicha,
      nivelesActivos: updatedNivelesActivos,
      totalNiveles: updatedTotalNiveles,
      // Actualizar el statusMessage para mostrar "X/Y activos"
      statusMessage: `${updatedNivelesActivos}/${updatedTotalNiveles} activos`,
    }

    // Actualizar la ficha en el historial de fichas recientes
    addRecentFicha(updatedFichaForRecent)
  }

  const handleChangeFicha = () => {
    if (hasChanges) {
      setShowChangeConfirm(true)
      return
    }
    proceedWithViewChange()
  }

  const proceedWithViewChange = () => {
    setCurrentView("search")
    setSelectedFicha(null)
    clearSearch()
    resetChanges()
  }

  const confirmChangeWithoutSaving = () => {
    if (pendingFichaChange) {
      proceedWithFichaChange(pendingFichaChange)
      setPendingFichaChange(null)
    } else {
      proceedWithViewChange()
    }
    setShowChangeConfirm(false)
  }

  // Nueva función para manejar el intento de activar un nivel no completado
  const handleAttemptActivateUncompleted = (levelName) => {
    setUncompletedLevelName(levelName)
    setShowUncompletedLevelModal(true)
  }

  // Render del header
  const renderHeader = () => (
    <div className="max-h-screen mb-6">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade]">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Asignación de Niveles</h1>
          <UserMenu />
        </div>
      </header>
    </div>
  )

  // Render principal
  return (
    <>
      {renderHeader()}

      {/* Mostrar errores de búsqueda */}
      {searchError && (
        <div className="max-w-6xl mx-auto mb-4 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">Error en búsqueda: {searchError}</p>
          </div>
        </div>
      )}

      {currentView === "search" && (
        <SearchView
          searchTerm={searchTerm}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          isSearchLoading={isSearchLoading}
          recentFichas={recentFichas}
          onSearchChange={handleSearchInputChange}
          onSelectFicha={handleSelectFicha}
          onClearRecentFichas={clearRecentFichas}
          setShowSearchResults={setShowSearchResults}
        />
      )}

      {currentView === "levels" && selectedFicha && (
        <>
          {isLevelsLoading ? (
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
                  <p className="text-gray-600">Cargando niveles...</p>
                </div>
              </div>
            </div>
          ) : (
            <LevelsView
              selectedFicha={selectedFicha}
              currentLevelStates={currentLevelStates}
              tempLevelStates={tempLevelStates}
              hasChanges={hasChanges}
              onLevelToggle={handleLevelToggle}
              onQuickAction={handleQuickAction}
              onSaveChanges={handleSaveChanges}
              onChangeFicha={handleChangeFicha}
              isSaving={isSaving}
              fichaInfo={fichaInfo}
              onAttemptActivateUncompleted={handleAttemptActivateUncompleted} // Pasar la nueva función
            />
          )}
        </>
      )}

      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={confirmSaveChanges}
        title="Confirmar Cambios"
        message={`¿Estás seguro que deseas guardar los cambios de niveles para la ficha ${selectedFicha?.codigo}?`}
        confirmText={isSaving ? "Guardando..." : "Guardar"}
        confirmColor="bg-green-500 hover:bg-green-600"
        isLoading={isSaving}
      />

      <ConfirmationModal
        isOpen={showChangeConfirm}
        onClose={() => {
          setShowChangeConfirm(false)
          setPendingFichaChange(null)
        }}
        onConfirm={confirmChangeWithoutSaving}
        title="Cambios sin Guardar"
        message="Tienes cambios sin guardar. ¿Deseas continuar sin guardar los cambios?"
        confirmText="Continuar sin Guardar"
        confirmColor="bg-red-500 hover:bg-red-600"
      />

      <ConfirmationModal
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        title={successMessage.includes("Error") ? "Error" : "Operación Exitosa"}
        message={successMessage}
        confirmText="Aceptar"
        confirmColor={
          successMessage.includes("Error") ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        }
        showButtonCancel={false}
      />

      {/* Nuevo modal para niveles no completados */}
      <ConfirmationModal
        isOpen={showUncompletedLevelModal}
        onClose={() => setShowUncompletedLevelModal(false)}
        onConfirm={() => setShowUncompletedLevelModal(false)} // Solo cerrar
        title="Nivel No Completado"
        message={`El nivel "${uncompletedLevelName}" no puede ser activado porque aún no está completado. Por favor, asegúrate de que el nivel esté marcado como 'Completado' antes de activarlo para esta ficha.`}
        confirmText="Cerrar"
        confirmColor="bg-red-500 hover:bg-red-600"
        showButtonCancel={false} // No mostrar botón de cancelar
      />
    </>
  )
}

export default LevelAssignmentPage
