"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle,
  Circle,
  Lock,
  FileText,
  X,
  Trophy,
  Target,
  Clock,
  Star,
  Play,
  AlertCircle,
} from "lucide-react"
import ExamModal from "../components/ExamModal"
import ExamIntroModal from "../components/ExamIntroModal"
import SupportMaterialDetailModal from "../components/SupportMaterialDetailModal" // Importar el nuevo modal
import { useAuth } from "../../../../features/auth/hooks/useAuth"
import { useExams } from "../hooks/useExams"
import { useCourseProgramming } from "../hooks/useCourseProgramming"
import { useLevelAssignment } from "../hooks/useLevelAssignment"
import { useApprenticeProgress } from "../hooks/useApprenticeProgress"
import useSupportMaterialDetail from "../hooks/useSupportMaterialDetail" // Importa el hook para el detalle del material

const Home = () => {
  const [expandedSections, setExpandedSections] = useState({})
  const [currentExam, setCurrentExam] = useState(null)
  const [showExamModal, setShowExamModal] = useState(false)
  const [showIntroModal, setShowIntroModal] = useState(false)
  const [levelProgressData, setLevelProgressData] = useState({})
  const [showMaterialDetailModal, setShowMaterialDetailModal] = useState(false) // Nuevo estado para el modal de material
  const [selectedMaterialTitle, setSelectedMaterialTitle] = useState(null) // Estado para el título del material seleccionado

  // Usa el hook para obtener los detalles del material
  const {
    material: fetchedMaterial,
    isLoading: isLoadingMaterialDetail,
    error: materialError,
  } = useSupportMaterialDetail(selectedMaterialTitle)

  const { exams, getExamByTitle } = useExams()
  const { user } = useAuth()
  const { programming, loading: programmingLoading, error: programmingError } = useCourseProgramming()
  const {
    assignments,
    loading: assignmentLoading,
    error: assignmentError,
    getAssignmentByCourseCode,
  } = useLevelAssignment()

  // Obtener la programación y asignación para el usuario actual
  const currentProgramming = useMemo(() => {
    if (!programming.length || !user?.program) return null

    const found = programming.find((prog) => prog.programId.name === user.program)

    return found
  }, [programming, user?.program])

  const currentAssignment = useMemo(() => {
    if (!user?.courseNumber) return null
    return getAssignmentByCourseCode(user.courseNumber.toString())
  }, [assignments, user?.courseNumber, getAssignmentByCourseCode])

  // Obtener niveles con información de asignación
  const levelsData = useMemo(() => {
    if (!currentProgramming || !currentAssignment) return []

    return currentProgramming.levels.map((level, index) => {
      const assignmentLevel =
        currentAssignment.levelsWithStatus[level.name] ||
        currentAssignment.levelsWithStatus[`Level ${index + 1}`] ||
        currentAssignment.levelsWithStatus[`level ${index + 1}`]

      return {
        ...level,
        levelNumber: index + 1,
        isActive: assignmentLevel?.isActive || false,
        description: assignmentLevel?.description || "Descripción no disponible",
        order: assignmentLevel?.order || index + 1,
      }
    })
  }, [currentProgramming, currentAssignment])

  // ✅ Obtener solo los niveles activos para evitar llamadas innecesarias
  const activeLevels = useMemo(() => {
    return levelsData.filter((level) => level.isActive).map((level) => level.levelNumber)
  }, [levelsData])

  // Obtener progreso para niveles activos usando múltiples hooks
  const level1Progress = useApprenticeProgress(user?.id, activeLevels.includes(1) ? 1 : null)
  const level2Progress = useApprenticeProgress(user?.id, activeLevels.includes(2) ? 2 : null)
  const level3Progress = useApprenticeProgress(user?.id, activeLevels.includes(3) ? 3 : null)

  // ✅ Consolidar datos de progreso con useCallback para evitar recreación
  const consolidateProgressData = useCallback(() => {
    const progressData = {}

    if (activeLevels.includes(1)) {
      progressData[1] = level1Progress
    }
    if (activeLevels.includes(2)) {
      progressData[2] = level2Progress
    }
    if (activeLevels.includes(3)) {
      progressData[3] = level3Progress
    }

    return progressData
  }, [activeLevels, level1Progress, level2Progress, level3Progress])

  // ✅ Usar useEffect con dependencias estables
  useEffect(() => {
    const newProgressData = consolidateProgressData()

    // Solo actualizar si hay cambios reales en los datos
    const hasChanges = JSON.stringify(newProgressData) !== JSON.stringify(levelProgressData)

    if (hasChanges) {
      setLevelProgressData(newProgressData)
    }
  }, [consolidateProgressData, levelProgressData]) // Se añadió levelProgressData como dependencia

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // ✅ Memoizar función para verificar estado de evaluación
  const getEvaluationStatus = useCallback(
    (evaluationId, levelNumber) => {
      const levelProgress = levelProgressData[levelNumber]
      if (!levelProgress || !levelProgress.progress) return { completed: false, score: null, passed: false }

      const evaluation = levelProgress.progress.find(
        (p) =>
          p.evaluationId === evaluationId ||
          p.evaluationId?._id === evaluationId ||
          p.evaluationId?.toString() === evaluationId?.toString(),
      )

      return {
        completed: !!evaluation,
        score: evaluation?.score || null,
        passed: evaluation?.passed || false,
      }
    },
    [levelProgressData],
  )

  // ✅ Memoizar función para calcular progreso de nivel
  const calculateLevelProgress = useCallback(
    (level) => {
      if (!level.isActive) return 0

      const levelProgress = levelProgressData[level.levelNumber]
      if (!levelProgress || !levelProgress.progress) return 0

      let totalEvaluations = 0
      let completedEvaluations = 0

      level.topics.forEach((topic) => {
        // Contar actividades
        if (topic.activities) {
          topic.activities.forEach((activity) => {
            totalEvaluations++
            const status = getEvaluationStatus(activity.evaluationId, level.levelNumber)
            if (status.passed) completedEvaluations++
          })
        }

        // Contar exámenes
        if (topic.exams) {
          topic.exams.forEach((exam) => {
            totalEvaluations++
            const status = getEvaluationStatus(exam.evaluationId, level.levelNumber)
            if (status.passed) completedEvaluations++
          })
        }
      })

      return totalEvaluations > 0 ? Math.round((completedEvaluations / totalEvaluations) * 100) : 0
    },
    [levelProgressData, getEvaluationStatus],
  )

  // ✅ Memoizar función para calcular progreso de tema
  const calculateTopicProgress = useCallback(
    (topic, levelNumber) => {
      let totalEvaluations = 0
      let completedEvaluations = 0

      // Contar actividades
      if (topic.activities) {
        topic.activities.forEach((activity) => {
          totalEvaluations++
          const status = getEvaluationStatus(activity.evaluationId, levelNumber)
          if (status.passed) completedEvaluations++
        })
      }

      // Contar exámenes
      if (topic.exams) {
        topic.exams.forEach((exam) => {
          totalEvaluations++
          const status = getEvaluationStatus(exam.evaluationId, levelNumber)
          if (status.passed) completedEvaluations++
        })
      }

      return totalEvaluations > 0 ? Math.round((completedEvaluations / totalEvaluations) * 100) : 0
    },
    [getEvaluationStatus],
  )

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600"
    return "text-red-500"
  }

  const getButtonColor = (status) => {
    if (!status.completed)
      return "bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] hover:from-[#152a38] hover:to-[#1f384c] text-white"
    if (status.passed) {
      return "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
    } else {
      return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
    }
  }

  const getScoreIcon = (status) => {
    if (!status.completed) {
      return <Circle size={16} className="mr-2 text-gray-400" />
    }
    if (status.passed) {
      return <CheckCircle size={16} className="text-emerald-600 mr-2" />
    } else {
      return <X size={16} className="text-red-500 mr-2" />
    }
  }

  const handleStartExam = (examTitle) => {
    const exam = getExamByTitle(examTitle)
    if (exam) {
      setCurrentExam(exam)
      setShowIntroModal(true)
    }
  }

  const handleStartExamAfterIntro = () => {
    setShowIntroModal(false)
    setShowExamModal(true)
  }

  const handleCloseExam = () => {
    setShowExamModal(false)
    setShowIntroModal(false)
    setCurrentExam(null)
  }

  // Nueva función para ver el material: establece el título para el hook
  const handleViewMaterial = (material) => {
    setSelectedMaterialTitle(material.name) // Pasa el 'name' del material, que se mapea a 'titulo' en tu API
    setShowMaterialDetailModal(true) // Abre el modal
  }

  // ✅ Memoizar estadísticas generales
  const activeLevelsCount = useMemo(() => levelsData.filter((level) => level.isActive).length, [levelsData])

  const completedLevelsCount = useMemo(() => {
    return levelsData.filter((level) => {
      if (!level.isActive) return false
      const progress = calculateLevelProgress(level)
      return progress === 100
    }).length
  }, [levelsData, calculateLevelProgress])

  if (programmingLoading || assignmentLoading) {
    return (
      <div className="max-h-screen to-[#1f384c]/10 flex items-center justify-center mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f384c] mx-auto mb-4"></div>
          <p className="text-[#1f384c] font-medium">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  if (programmingError || assignmentError) {
    return (
      <div className="max-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-[#1f384c]/10 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{programmingError || assignmentError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white px-4 py-2 rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-[#1f384c]/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">
              ¡Bienvenido de vuelta, {user?.name.split(" ").slice(0, 1).join(" ")}! 👋
            </h1>
            <p className="text-base text-blue-100 mt-1">Continúa tu camino hacia el dominio del inglés</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1f384c]/10 to-[#2d4a5c]/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-2 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Ficha y Programa</h3>
                <p className="text-lg font-bold text-[#1f384c]">{user?.courseNumber || "N/A"}</p>
                <p className="text-sm text-gray-500">{user?.program || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-2 rounded-lg">
                <Trophy className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Puntaje del Aprendiz</h3>
                <p className="text-lg font-bold text-emerald-600">{user?.points || 0}</p>
                <p className="text-sm text-gray-500">Puntos acumulados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1f384c] to-[#3b5c70] p-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Target className="mr-2" size={20} />
              Tu camino de aprendizaje
            </h2>
            <p className="text-base text-blue-100 mt-1">Sigue tu progreso y completa las actividades</p>
          </div>

          <div className="p-4">
            {levelsData.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay programación disponible para tu programa</p>
              </div>
            ) : (
              levelsData.map((level) => {
                const levelProgress = calculateLevelProgress(level)
                const isCompleted = levelProgress === 100

                return (
                  <div key={level._id} className="mb-4">
                    {level.isActive ? (
                      // Nivel activo
                      <div className="border border-[#1f384c]/20 rounded-lg overflow-hidden bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5">
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1f384c]/10 transition-colors"
                          onClick={() => toggleSection(level._id)}
                        >
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-1.5 rounded-lg mr-2">
                              <Star className="text-white" size={16} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#1f384c]">{level.name}</h3>
                              <p className="text-sm text-gray-600">{level.description}</p>
                            </div>
                            {isCompleted && (
                              <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                                Completado
                              </span>
                            )}
                          </div>
                          {expandedSections[level._id] ? (
                            <ChevronUp size={20} className="text-[#1f384c]" />
                          ) : (
                            <ChevronDown size={20} className="text-[#1f384c]" />
                          )}
                        </div>

                        {expandedSections[level._id] && (
                          <div className="p-4 bg-white border-t border-[#1f384c]/10">
                            {/* Progress bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">Progreso del nivel</span>
                                <span className="text-sm font-bold text-[#1f384c]">{levelProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${levelProgress}%` }}
                                ></div>
                              </div>
                            </div>

                            <h4 className="text-base font-bold text-[#1f384c] mb-3 flex items-center">
                              <BookOpen className="mr-1" size={16} />
                              Temas disponibles
                            </h4>

                            {/* Topics */}
                            {level.topics.map((topic) => {
                              const topicProgress = calculateTopicProgress(topic, level.levelNumber)
                              const topicCompleted = topicProgress === 100

                              return (
                                <div
                                  key={topic._id}
                                  className={`border rounded-lg mb-4 overflow-hidden ${
                                    topicCompleted
                                      ? "border-emerald-200 bg-emerald-50/30"
                                      : "border-amber-200 bg-amber-50/30"
                                  }`}
                                >
                                  <div
                                    className={`flex justify-between items-center p-3 cursor-pointer transition-colors ${
                                      topicCompleted ? "hover:bg-emerald-50" : "hover:bg-amber-50"
                                    }`}
                                    onClick={() => toggleSection(`${level._id}_${topic._id}`)}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={`w-2 h-2 rounded-full mr-2 ${
                                          topicCompleted ? "bg-emerald-500" : "bg-amber-500"
                                        }`}
                                      ></div>
                                      <span className="font-semibold text-[#1f384c] text-base">
                                        {topic.topicId?.name}
                                      </span>
                                      <span
                                        className={`ml-1 px-1 py-0.5 text-sm rounded-full font-medium ${
                                          topicCompleted
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}
                                      >
                                        {topicCompleted ? "Completado" : `${topicProgress}%`}
                                      </span>
                                    </div>
                                    {expandedSections[`${level._id}_${topic._id}`] ? (
                                      <ChevronUp size={16} className="text-[#1f384c]" />
                                    ) : (
                                      <ChevronDown size={16} className="text-[#1f384c]" />
                                    )}
                                  </div>

                                  {expandedSections[`${level._id}_${topic._id}`] && (
                                    <div
                                      className={`p-3 border-t bg-white ${
                                        topicCompleted ? "border-emerald-100" : "border-amber-100"
                                      }`}
                                    >
                                      {/* Progress bar del tema */}
                                      <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-sm font-medium text-gray-700">Progreso del tema</span>
                                          <span
                                            className={`text-sm font-bold ${
                                              topicCompleted ? "text-emerald-600" : "text-amber-600"
                                            }`}
                                          >
                                            {topicProgress}%
                                          </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                          <div
                                            className={`h-1 rounded-full ${
                                              topicCompleted
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                                : "bg-gradient-to-r from-amber-500 to-amber-600"
                                            }`}
                                            style={{ width: `${topicProgress}%` }}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* Materials */}
                                      {topic.materials && topic.materials.length > 0 && (
                                        <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-lg p-3 mb-3 border border-[#1f384c]/20">
                                          <h5 className="font-semibold text-[#1f384c] mb-2 flex items-center text-base">
                                            <FileText className="mr-1" size={12} />
                                            Material de apoyo
                                          </h5>
                                          {topic.materials.map((material) => {
                                            return (
                                              <div
                                                key={material._id}
                                                className="flex items-center justify-between mb-2 last:mb-0"
                                              >
                                                <div className="flex items-center">
                                                  <FileText size={16} className="text-[#1f384c] mr-2" />
                                                  <div>
                                                    <p className="font-medium text-[#1f384c] text-sm">
                                                      {material.name}
                                                    </p>
                                                  </div>
                                                </div>
                                                <button
                                                  onClick={() => handleViewMaterial(material)} // Pasa el objeto material completo
                                                  className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300 text-sm"
                                                >
                                                  <FileText size={12} className="mr-1" />
                                                  Ver material
                                                </button>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}

                                      {/* Activities */}
                                      {topic.activities && topic.activities.length > 0 && (
                                        <div className="space-y-2 mb-3">
                                          <h5 className="font-semibold text-[#1f384c] flex items-center text-base">
                                            <Play className="mr-1" size={12} />
                                            Actividades
                                          </h5>
                                          {topic.activities.map((activity) => {
                                            const status = getEvaluationStatus(activity.evaluationId, level.levelNumber)
                                            return (
                                              <div
                                                key={activity._id}
                                                className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                                              >
                                                <div className="flex justify-between items-center">
                                                  <div className="flex items-center">
                                                    {getScoreIcon(status)}
                                                    <span className="font-medium text-[#1f384c] text-sm">
                                                      {activity.name}
                                                    </span>
                                                    {/* ✅ Mostrar puntaje del aprendiz en lugar del porcentaje */}
                                                    {status.completed ? (
                                                      <span
                                                        className={`ml-2 text-sm font-bold ${getScoreColor(
                                                          status.score,
                                                        )}`}
                                                      >
                                                        {status.score}/100
                                                      </span>
                                                    ) : (
                                                      <span className="ml-2 text-sm font-medium text-gray-500">
                                                        Sin realizar
                                                      </span>
                                                    )}
                                                  </div>
                                                  <button
                                                    onClick={() => handleStartExam(activity.name)}
                                                    className={`px-2 py-0.5 rounded-lg text-sm font-medium transition-all duration-300 ${getButtonColor(
                                                      status,
                                                    )}`}
                                                  >
                                                    {status.completed ? "Repetir" : "Comenzar"}
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}

                                      {/* Exams */}
                                      {topic.exams && topic.exams.length > 0 && (
                                        <div className="pt-3 border-t border-gray-200">
                                          <h5 className="font-semibold text-[#1f384c] mb-2 flex items-center text-base">
                                            <Trophy className="mr-1" size={12} />
                                            Exámenes
                                          </h5>
                                          {topic.exams.map((exam) => {
                                            const status = getEvaluationStatus(exam.evaluationId, level.levelNumber)

                                            return (
                                              <div
                                                key={exam._id}
                                                className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                                              >
                                                <div className="flex justify-between items-center">
                                                  <div className="flex items-center">
                                                    {getScoreIcon(status)}
                                                    <span className="font-medium text-[#1f384c] text-sm">
                                                      {exam.name}
                                                    </span>
                                                    {/* ✅ Mostrar puntaje del aprendiz en lugar del porcentaje */}
                                                    {status.completed ? (
                                                      <span
                                                        className={`ml-2 text-sm font-bold ${getScoreColor(
                                                          status.score,
                                                        )}`}
                                                      >
                                                        {status.score}/100
                                                      </span>
                                                    ) : (
                                                      <span className="ml-2 text-sm font-medium text-gray-500">
                                                        Sin realizar
                                                      </span>
                                                    )}
                                                  </div>
                                                  <button
                                                    onClick={() => handleStartExam(exam.name)}
                                                    className={`px-2 py-0.5 rounded-lg text-sm font-medium transition-all duration-300 ${getButtonColor(
                                                      status,
                                                    )}`}
                                                  >
                                                    {status.completed ? "Repetir" : "Comenzar"}
                                                  </button>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Nivel bloqueado
                      <div className="bg-gradient-to-r from-gray-100 to-[#1f384c]/5 border border-[#1f384c]/20 rounded-lg p-3 opacity-75">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-[#1f384c]/60 to-[#2d4a5c]/60 p-1.5 rounded-lg mr-3">
                            <Lock className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-[#1f384c] text-base">{level.name}</h5>
                            <p className="text-sm text-gray-500 mt-0.5">
                              Se habilitará en el trimestre correspondiente
                            </p>
                          </div>
                          <div className="text-right">
                            <Clock className="text-[#1f384c]/60 mx-auto" size={16} />
                            <p className="text-sm text-gray-500 mt-0.5">Bloqueado</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExamIntroModal
        isOpen={showIntroModal}
        onClose={handleCloseExam}
        exam={currentExam}
        onStart={handleStartExamAfterIntro}
      />

      <ExamModal isOpen={showExamModal} onClose={handleCloseExam} exam={currentExam} />

      {/* Nuevo modal de detalle de material */}
      <SupportMaterialDetailModal
        isOpen={showMaterialDetailModal}
        onClose={() => {
          setShowMaterialDetailModal(false)
          setSelectedMaterialTitle(null) // Limpiar el título seleccionado al cerrar el modal
        }}
        material={fetchedMaterial} // Pasa el material obtenido del hook
        isLoading={isLoadingMaterialDetail} // Pasa el estado de carga del hook
      />
    </div>
  )
}

export default Home
