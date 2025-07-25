import { API_ENDPOINTS } from "../../../shared/config/api"

/**
 * Servicio para validaciones de evaluaciones
 */

/**
 * Verifica si ya existe una evaluación con el mismo nombre y tipo
 * @param {string} nombre - Nombre de la evaluación
 * @param {string} tipoEvaluacion - Tipo de evaluación (Examen/Actividad)
 * @param {string} currentId - ID de la evaluación actual (para edición)
 * @returns {Promise<boolean>} - true si existe duplicado, false si no
 */
export const checkEvaluationNameExists = async (nombre, tipoEvaluacion, currentId = null) => {
  try {
    if (!nombre || !tipoEvaluacion) {
      return false
    }

    const response = await fetch(API_ENDPOINTS.EVALUATIONS)

    if (!response.ok) {
      console.error("Error al consultar evaluaciones:", response.statusText)
      return false
    }

    const evaluations = await response.json()

    // Verificar si existe una evaluación con el mismo nombre y tipo
    const duplicateExists = evaluations.some((evaluation) => {
      // Excluir la evaluación actual si estamos editando
      if (currentId && (evaluation._id === currentId || evaluation.id === currentId)) {
        return false
      }

      // Comparar nombre y tipo (case insensitive para el nombre)
      return (
        evaluation.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() &&
        evaluation.tipoEvaluacion === tipoEvaluacion
      )
    })

    return duplicateExists
  } catch (error) {
    console.error("Error al verificar duplicados de evaluación:", error)
    return false
  }
}

/**
 * Valida el nombre de la evaluación
 * @param {string} nombre - Nombre a validar
 * @param {string} tipoEvaluacion - Tipo de evaluación
 * @param {string} currentId - ID actual (para edición)
 * @returns {Promise<string|null>} - Mensaje de error o null si es válido
 */
export const validateEvaluationName = async (nombre, tipoEvaluacion, currentId = null) => {
  if (!nombre || nombre.trim() === "") {
    return "El nombre de la evaluación es requerido"
  }

  if (nombre.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres"
  }

  if (nombre.trim().length > 100) {
    return "El nombre no puede exceder 100 caracteres"
  }

  // Verificar duplicados
  const isDuplicate = await checkEvaluationNameExists(nombre, tipoEvaluacion, currentId)
  if (isDuplicate) {
    return "Ya existe una evaluación con este nombre"
  }

  return null
}
