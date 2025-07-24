"use client"

import { useState } from "react"
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
  Download,
  Play,
} from "lucide-react"
import ExamModal from "../components/ExamModal"
import ExamIntroModal from "../components/ExamIntroModal"
import { useExams } from "../hooks/useExams"
import { useAuth } from "../../../../features/auth/hooks/useAuth"

const Home = () => {
  const [expandedSections, setExpandedSections] = useState({
    nivel1: true,
    greeting: false,
    simplePresent: false,
  })
  const [currentExam, setCurrentExam] = useState(null)
  const [showExamModal, setShowExamModal] = useState(false)
  const [showIntroModal, setShowIntroModal] = useState(false)

  const { exams, getExamByTitle } = useExams()
  const { user } = useAuth()

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 70) return "text-emerald-600"
    return "text-red-500"
  }

  const getButtonColor = (score) => {
    if (score === undefined)
      return "bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] hover:from-[#152a38] hover:to-[#1f384c] text-white"
    if (score >= 70) {
      return "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
    } else {
      return "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
    }
  }

  const getScoreIcon = (score) => {
    if (score >= 70) {
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

  const handleDownloadMaterial = () => {
    const link = document.createElement("a")
    link.href = "/src/shared/prueba.docx"
    link.download = "prueba.docx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-[#1f384c]/10">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">¡Bienvenido de vuelta, {user?.name.split(" ").slice(0, 1).join(" ")}! 👋</h1>
            <p className="text-base text-blue-100 mt-1">Continúa tu camino hacia el dominio del inglés</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards mejoradas */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1f384c]/10 to-[#2d4a5c]/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-2 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Nivel actual</h3>
                <p className="text-lg font-bold text-[#1f384c]">Nivel 1</p>
                <p className="text-sm text-gray-500">Principiante</p>
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
                <h3 className="text-base font-semibold text-gray-800">Progreso general</h3>
                <p className="text-lg font-bold text-emerald-600">8 / 10</p>
                <p className="text-sm text-gray-500">Evaluaciones completadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path mejorado */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1f384c] to-[#3b5c70] p-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Target className="mr-2" size={20} />
              Tu camino de aprendizaje
            </h2>
            <p className="text-base text-blue-100 mt-1">Sigue tu progreso y completa las actividades</p>
          </div>

          <div className="p-4">
            {/* Level 1 mejorado */}
            <div className="border border-[#1f384c]/20 rounded-lg mb-4 overflow-hidden bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5">
              <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1f384c]/10 transition-colors"
                onClick={() => toggleSection("nivel1")}
              >
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-1.5 rounded-lg mr-2">
                    <Star className="text-white" size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1f384c]">Nivel 1: Principiante</h3>
                    <p className="text-sm text-gray-600">Fundamentos del inglés</p>
                  </div>
                </div>
                {expandedSections.nivel1 ? (
                  <ChevronUp size={20} className="text-[#1f384c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#1f384c]" />
                )}
              </div>

              {expandedSections.nivel1 && (
                <div className="p-4 bg-white border-t border-[#1f384c]/10">
                  {/* Progress bar mejorada */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso del nivel</span>
                      <span className="text-sm font-bold text-[#1f384c]">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] h-2 rounded-full transition-all duration-500"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#1f384c] mb-3 flex items-center">
                    <BookOpen className="mr-1" size={16} />
                    Temas disponibles
                  </h4>

                  {/* Greeting & Introductions mejorado */}
                  <div className="border border-emerald-200 rounded-lg mb-4 overflow-hidden bg-emerald-50/30">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-emerald-50 transition-colors"
                      onClick={() => toggleSection("greeting")}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        <span className="font-semibold text-[#1f384c] text-base">Greeting & Introductions</span>
                        <span className="ml-1 px-1 py-0.5 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                          Completado
                        </span>
                      </div>
                      {expandedSections.greeting ? (
                        <ChevronUp size={16} className="text-[#1f384c]" />
                      ) : (
                        <ChevronDown size={16} className="text-[#1f384c]" />
                      )}
                    </div>

                    {expandedSections.greeting && (
                      <div className="p-3 border-t border-emerald-100 bg-white">
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Progreso del tema</span>
                            <span className="text-sm font-bold text-emerald-600">100%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1 rounded-full"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>

                        {/* Material de apoyo */}
                        <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-lg p-3 mb-3 border border-[#1f384c]/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={16} className="text-[#1f384c] mr-2" />
                              <div>
                                <p className="font-medium text-[#1f384c] text-base">Material de apoyo</p>
                                <p className="text-sm text-gray-600">Beginners guide to english pronunciation</p>
                              </div>
                            </div>
                            <button
                              onClick={handleDownloadMaterial}
                              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300 text-sm"
                            >
                              <Download size={12} className="mr-1" />
                              Descargar
                            </button>
                          </div>
                        </div>

                        {/* Actividades */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#1f384c] flex items-center text-base">
                            <Play className="mr-1" size={12} />
                            Actividades
                          </h5>

                          {[
                            { name: "Canon Listening", score: 85 },
                            { name: "Introducing yourself", score: 92 },
                            { name: "Support phrases", score: 65 },
                            { name: "Exam Greeting & Introductions", score: 78 },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {getScoreIcon(activity.score)}
                                  <span className="font-medium text-[#1f384c] text-sm">{activity.name}</span>
                                  <span className={`ml-1 text-sm font-bold ${getScoreColor(activity.score)}`}>
                                    {activity.score}/100
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleStartExam(activity.name)}
                                  className={`px-2 py-0.5 rounded-lg text-sm font-medium transition-all duration-300 ${getButtonColor(activity.score)}`}
                                >
                                  Repetir
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Examen final */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h5 className="font-semibold text-[#1f384c] mb-2 flex items-center text-base">
                            <Trophy className="mr-1" size={12} />
                            Examen final
                          </h5>
                          <div className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                {getScoreIcon(88)}
                                <span className="font-medium text-[#1f384c] text-sm">Greeting</span>
                                <span className="ml-1 text-sm font-bold text-emerald-600">88/100</span>
                              </div>
                              <button
                                onClick={() => handleStartExam("Greeting & Introductions")}
                                className="px-2 py-0.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
                              >
                                Repetir
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simple Present mejorado */}
                  <div className="border border-amber-200 rounded-lg mb-4 overflow-hidden bg-amber-50/30">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-amber-50 transition-colors"
                      onClick={() => toggleSection("simplePresent")}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                        <span className="font-semibold text-[#1f384c] text-base">Simple Present</span>
                        <span className="ml-1 px-1 py-0.5 bg-amber-100 text-amber-700 text-sm rounded-full font-medium">
                          En progreso
                        </span>
                      </div>
                      {expandedSections.simplePresent ? (
                        <ChevronUp size={16} className="text-[#1f384c]" />
                      ) : (
                        <ChevronDown size={16} className="text-[#1f384c]" />
                      )}
                    </div>

                    {expandedSections.simplePresent && (
                      <div className="p-3 border-t border-amber-100 bg-white">
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Progreso del tema</span>
                            <span className="text-sm font-bold text-amber-600">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-amber-600 h-1 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>

                        {/* Material de apoyo */}
                        <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-lg p-3 mb-3 border border-[#1f384c]/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText size={16} className="text-[#1f384c] mr-2" />
                              <div>
                                <p className="font-medium text-[#1f384c] text-base">Material de apoyo</p>
                                <p className="text-sm text-gray-600">Simple Present</p>
                              </div>
                            </div>
                            <button
                              onClick={handleDownloadMaterial}
                              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300 text-sm"
                            >
                              <Download size={12} className="mr-1" />
                              Descargar
                            </button>
                          </div>
                        </div>

                        {/* Actividades */}
                        <div className="space-y-2">
                          <h5 className="font-semibold text-[#1f384c] flex items-center text-base">
                            <Play className="mr-1" size={12} />
                            Actividades
                          </h5>

                          {[
                            { name: "Canon Listening", score: 75 },
                            { name: "Introducing yourself", score: 82 },
                            { name: "Support phrases", score: undefined },
                            { name: "Exam Greeting & Introductions", score: 60 },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {activity.score !== undefined ? (
                                    getScoreIcon(activity.score)
                                  ) : (
                                    <Circle size={16} className="mr-2 text-gray-400" />
                                  )}
                                  <span className="font-medium text-[#1f384c] text-sm">{activity.name}</span>
                                  {activity.score !== undefined ? (
                                    <span className={`ml-1 text-sm font-bold ${getScoreColor(activity.score)}`}>
                                      {activity.score}/100
                                    </span>
                                  ) : (
                                    <span className="ml-1 text-sm font-medium text-gray-500">Pendiente</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleStartExam(activity.name)}
                                  className={`px-2 py-0.5 rounded-lg text-sm font-medium transition-all duration-300 ${getButtonColor(activity.score)}`}
                                >
                                  {activity.score !== undefined ? "Repetir" : "Comenzar"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Examen final */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <h5 className="font-semibold text-[#1f384c] mb-2 flex items-center text-base">
                            <Trophy className="mr-1" size={12} />
                            Examen final
                          </h5>
                          <div className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Circle size={16} className="mr-2 text-gray-400" />
                                <span className="font-medium text-[#1f384c] text-sm">Simple Present</span>
                                <span className="ml-1 text-sm font-medium text-gray-500">Pendiente</span>
                              </div>
                              <button
                                onClick={() => handleStartExam("Simple Present")}
                                className="px-2 py-0.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
                              >
                                Comenzar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Locked Levels mejorados */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#1f384c] flex items-center">
                <Lock className="mr-1" size={16} />
                Próximos niveles
              </h4>

              {[
                { level: 2, title: "Conjugations", description: "Domina las conjugaciones verbales" },
                { level: 3, title: "Writing", description: "Desarrolla tus habilidades de escritura" },
                { level: 4, title: "Listening", description: "Mejora tu comprensión auditiva" },
                { level: 5, title: "Speaking", description: "Perfecciona tu expresión oral" },
              ].map((level, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-100 to-[#1f384c]/5 border border-[#1f384c]/20 rounded-lg p-3 opacity-75"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-[#1f384c]/60 to-[#2d4a5c]/60 p-1.5 rounded-lg mr-3">
                      <Lock className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-[#1f384c] text-base">
                        Nivel {level.level}: {level.title}
                      </h5>
                      <p className="text-sm text-gray-600">{level.description}</p>
                      <p className="text-sm text-gray-500 mt-0.5">Se habilitará en el trimestre correspondiente</p>
                    </div>
                    <div className="text-right">
                      <Clock className="text-[#1f384c]/60 mx-auto" size={16} />
                      <p className="text-sm text-gray-500 mt-0.5">Próximamente</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  )
}

export default Home
