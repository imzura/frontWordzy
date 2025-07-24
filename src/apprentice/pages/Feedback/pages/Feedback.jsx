"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Lock, BookOpen, Trophy, Target, CheckCircle, X, Circle, FileText, Download, Clock, Star, Play } from "lucide-react"
import { useLocation } from "react-router-dom"

export default function ApprenticeFeedbackView() {
  const [expandedLevels, setExpandedLevels] = useState({ 1: true })
  const [expandedTopics, setExpandedTopics] = useState({ temas: true, greetings: true, "simple-present": true })
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.openActivity) {
      const activity = location.state.openActivity
      if (activity && activity.name) {
        handleViewDetail(activity)
      }
    }
  }, [location.state])

  const greetingsActivities = [
    {
      id: "greeting-1",
      name: "Saludar a un compañero",
      description: "Practica cómo saludar a un compañero en diferentes momentos del día.",
      completed: true,
      score: 85
    },
    {
      id: "greeting-2",
      name: "Presentarte formalmente",
      description: "Aprende a presentarte en un contexto formal.",
      completed: true,
      score: 92
    },
  ]

  const simplePresentActivities = [
    {
      id: "simple-present-1",
      name: "Describir tu rutina diaria",
      description: "Describe las actividades que realizas en un día típico.",
      completed: true,
      score: 75
    }
  ]

  const getScoreColor = (score) => {
    if (score === undefined) return "text-gray-500"
    if (score >= 70) return "text-emerald-600"
    return "text-red-500"
  }

  const getScoreIcon = (score) => {
    if (score === undefined) return <Circle size={16} className="text-gray-400 mr-2" />
    if (score >= 70) {
      return <CheckCircle size={16} className="text-emerald-600 mr-2" />
    } else {
      return <X size={16} className="text-red-500 mr-2" />
    }
  }

  const handleViewDetail = (activity) => {
    // Datos de ejemplo para el modal de retroalimentación
    const activityWithQuestions = {
      ...activity,
      level: "1",
      topic: activity.id?.includes("simple-present") ? "Simple Present" : "Greetings & Introductions",
      questions: [
        {
          id: "q1",
          text: "What is your name?",
          options: ["I'm Jennifer is Ibraham", "My name is Jennifer", "Me llamo Jennifer", "I am Jennifer"],
          correctAnswer: 1,
          userAnswer: 0,
          score: 20,
          maxScore: 20,
          feedback: "Error: La respuesta correcta es 'My name is Jennifer'. La estructura 'I'm Jennifer is Ibraham' mezcla dos formas de presentación y contiene un error gramatical."
        },
        {
          id: "q2",
          text: "What is your address?",
          options: ["I'm address is street 2", "My address is 123 Main Street", "I live on 123 Main Street", "I live at 123 Main Street"],
          correctAnswer: 3,
          userAnswer: 0,
          score: 0,
          maxScore: 20,
          feedback: "Error: La respuesta correcta es 'I live at 123 Main Street'. La estructura 'I'm address is street 2' contiene varios errores."
        }
      ],
      score: activity.score || (activity.id?.includes("exam-1") ? 95 : activity.id?.includes("exam-2") ? 0 : 85),
    }

    setSelectedActivity(activityWithQuestions)
    setShowDetailModal(true)
  }

  const toggleLevel = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }))
  }

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-[#1f384c]/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Mi Retroalimentación</h1>
            <p className="text-base text-blue-100 mt-1">Revisa tu progreso en las actividades y evaluaciones</p>
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
                <p className="text-lg font-bold text-emerald-600">95%</p>
                <p className="text-sm text-gray-500">Promedio de calificaciones</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1f384c] to-[#3b5c70] p-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Target className="mr-2" size={20} />
              Tu retroalimentación detallada
            </h2>
            <p className="text-base text-blue-100 mt-1">Revisa tus actividades y los comentarios de tu instructor</p>
          </div>

          <div className="p-4">
            {/* Level 1 */}
            <div className="border border-[#1f384c]/20 rounded-lg mb-4 overflow-hidden bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5">
              <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1f384c]/10 transition-colors"
                onClick={() => toggleLevel(1)}
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
                {expandedLevels[1] ? (
                  <ChevronUp size={20} className="text-[#1f384c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#1f384c]" />
                )}
              </div>

              {expandedLevels[1] && (
                <div className="p-4 bg-white border-t border-[#1f384c]/10">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progreso del nivel</span>
                      <span className="text-sm font-bold text-[#1f384c]">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] h-2 rounded-full transition-all duration-500"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Topics section */}
                  <div className="border border-[#1f384c]/20 rounded-lg overflow-hidden">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1f384c]/10"
                      onClick={() => toggleTopic("temas")}
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-1 rounded-lg mr-2">
                          <BookOpen className="text-white" size={14} />
                        </div>
                        <h3 className="text-base font-bold text-[#1f384c]">Temas completados</h3>
                      </div>
                      {expandedTopics["temas"] ? (
                        <ChevronUp size={20} className="text-[#1f384c]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#1f384c]" />
                      )}
                    </div>

                    {expandedTopics["temas"] && (
                      <div className="p-4 bg-white border-t border-[#1f384c]/10">
                        {/* Greetings */}
                        <div className="border border-emerald-200 rounded-lg mb-4 overflow-hidden bg-emerald-50/30">
                          <div
                            className="flex justify-between items-center p-3 cursor-pointer hover:bg-emerald-50"
                            onClick={() => toggleTopic("greetings")}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                              <span className="font-semibold text-[#1f384c] text-base">Greeting & Introductions</span>
                              <span className="ml-1 px-1 py-0.5 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">
                                Completado
                              </span>
                            </div>
                            {expandedTopics["greetings"] ? (
                              <ChevronUp size={16} className="text-[#1f384c]" />
                            ) : (
                              <ChevronDown size={16} className="text-[#1f384c]" />
                            )}
                          </div>

                          {expandedTopics["greetings"] && (
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

                              {/* Activities */}
                              <div className="space-y-2">
                                <h5 className="font-semibold text-[#1f384c] flex items-center text-base">
                                  <Play className="mr-1" size={12} />
                                  Actividades
                                </h5>

                                {greetingsActivities.map((activity, index) => (
                                  <div
                                    key={index}
                                    className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        {getScoreIcon(activity.score)}
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
                                        onClick={() => handleViewDetail(activity)}
                                        className="px-2 py-0.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
                                      >
                                        Ver detalle
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Exam */}
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <h5 className="font-semibold text-[#1f384c] mb-2 flex items-center text-base">
                                  <Trophy className="mr-1" size={12} />
                                  Examen final
                                </h5>
                                <div className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <CheckCircle size={16} className="text-emerald-600 mr-2" />
                                      <span className="font-medium text-[#1f384c] text-sm">Greeting & Introductions</span>
                                      <span className="ml-1 text-sm font-bold text-emerald-600">95/100</span>
                                    </div>
                                    <button
                                      onClick={() => handleViewDetail({
                                        id: "exam-1",
                                        name: "Greeting & Introductions",
                                        type: "Examen",
                                        score: 95
                                      })}
                                      className="px-2 py-0.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
                                    >
                                      Ver detalle
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Simple Present */}
                        <div className="border border-amber-200 rounded-lg mb-4 overflow-hidden bg-amber-50/30">
                          <div
                            className="flex justify-between items-center p-3 cursor-pointer hover:bg-amber-50"
                            onClick={() => toggleTopic("simple-present")}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                              <span className="font-semibold text-[#1f384c] text-base">Simple Present</span>
                              <span className="ml-1 px-1 py-0.5 bg-amber-100 text-amber-700 text-sm rounded-full font-medium">
                                En progreso
                              </span>
                            </div>
                            {expandedTopics["simple-present"] ? (
                              <ChevronUp size={16} className="text-[#1f384c]" />
                            ) : (
                              <ChevronDown size={16} className="text-[#1f384c]" />
                            )}
                          </div>

                          {expandedTopics["simple-present"] && (
                            <div className="p-3 border-t border-amber-100 bg-white">
                              {/* Progress */}
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium text-gray-700">Progreso del tema</span>
                                  <span className="text-sm font-bold text-amber-600">60%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-1 rounded-full"
                                    style={{ width: "60%" }}
                                  ></div>
                                </div>
                              </div>

                              {/* Activities */}
                              <div className="space-y-2">
                                <h5 className="font-semibold text-[#1f384c] flex items-center text-base">
                                  <Play className="mr-1" size={12} />
                                  Actividades
                                </h5>

                                {simplePresentActivities.map((activity, index) => (
                                  <div
                                    key={index}
                                    className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md hover:border-[#1f384c]/30 transition-all duration-300"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        {getScoreIcon(activity.score)}
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
                                        onClick={() => handleViewDetail(activity)}
                                        className="px-2 py-0.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
                                      >
                                        {activity.score !== undefined ? "Ver detalle" : "Comenzar"}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Locked Levels */}
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

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-4">
              <h3 className="text-lg font-bold text-white">Detalle de Retroalimentación</h3>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {/* Información general */}
              <div className="mb-6 bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-lg p-4 border border-[#1f384c]/20">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nivel</p>
                    <p className="font-medium text-[#1f384c]">Nivel {selectedActivity.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tema</p>
                    <p className="font-medium text-[#1f384c]">{selectedActivity.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actividad</p>
                    <p className="font-medium text-[#1f384c]">{selectedActivity.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calificación</p>
                    <p className={`font-bold ${getScoreColor(selectedActivity.score)}`}>
                      {selectedActivity.score !== undefined ? `${selectedActivity.score}/100` : "Pendiente"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preguntas y respuestas */}
              {selectedActivity.questions && (
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-[#1f384c] border-b pb-2">Preguntas y respuestas</h4>
                  
                  {selectedActivity.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-3">
                        <p className="font-medium text-[#1f384c]">{question.text}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`p-3 rounded border ${
                              optIndex === question.userAnswer 
                                ? optIndex === question.correctAnswer 
                                  ? "bg-emerald-50 border-emerald-200" 
                                  : "bg-red-50 border-red-200"
                                : optIndex === question.correctAnswer 
                                  ? "bg-emerald-50 border-emerald-200"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              {optIndex === question.correctAnswer ? (
                                <CheckCircle size={16} className="text-emerald-600 mr-2" />
                              ) : optIndex === question.userAnswer ? (
                                <X size={16} className="text-red-500 mr-2" />
                              ) : (
                                <Circle size={16} className="text-gray-400 mr-2" />
                              )}
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">Retroalimentación:</p>
                        <p className="text-sm">{question.feedback}</p>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <span className="text-sm font-medium">
                          Puntos: {question.score}/{question.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-center">
              <button
                className="px-6 py-2 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
                onClick={() => setShowDetailModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}