"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Clock, Trophy, AlertCircle, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ConfirmationModal from "../../../../shared/components/ConfirmationModal"

const ExamModal = ({ isOpen, onClose, exam }) => {
  const navigate = useNavigate()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  const [completionAnswers, setCompletionAnswers] = useState([])
  const [nextBlankIndex, setNextBlankIndex] = useState(0)
  const audioRef = useRef(null)
  const [audioProgress, setAudioProgress] = useState(0)

  // Inicializar respuestas del usuario
  useEffect(() => {
    if (exam && exam.questions) {
      setUserAnswers(new Array(exam.questions.length).fill(null))
      setCurrentQuestionIndex(0)
      setShowResults(false)
    }
  }, [exam])

  // Inicializar respuestas de completar cuando cambia la pregunta
  useEffect(() => {
    if (exam && exam.questions && exam.questions[currentQuestionIndex]?.type === "completion") {
      const question = exam.questions[currentQuestionIndex]
      setCompletionAnswers(new Array(question.wordsToComplete.length).fill(""))
      setNextBlankIndex(0)
    }
  }, [currentQuestionIndex, exam])

  // Actualizar progreso del audio
  useEffect(() => {
    if (audioRef.current) {
      const updateProgress = () => {
        if (audioRef.current && audioRef.current.duration) {
          setAudioProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }
      }

      const audioElement = audioRef.current
      audioElement.addEventListener("timeupdate", updateProgress)

      return () => {
        audioElement.removeEventListener("timeupdate", updateProgress)
      }
    }
  }, [currentQuestionIndex])

  if (!isOpen || !exam) return null

  const currentQuestion = exam.questions[currentQuestionIndex]

  const handleAnswerSelection = (answerIndex) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleCompletionWordClick = (word) => {
    if (nextBlankIndex >= currentQuestion.wordsToComplete.length) return

    const newCompletionAnswers = [...completionAnswers]
    newCompletionAnswers[nextBlankIndex] = word
    setCompletionAnswers(newCompletionAnswers)
    setNextBlankIndex(nextBlankIndex + 1)

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = newCompletionAnswers
    setUserAnswers(newAnswers)
  }

  const handleRemoveCompletionWord = (index) => {
    const newCompletionAnswers = [...completionAnswers]
    newCompletionAnswers[index] = ""

    if (index < nextBlankIndex) {
      setNextBlankIndex(index)
    }

    setCompletionAnswers(newCompletionAnswers)

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = newCompletionAnswers
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      finishExam()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const finishExam = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0

    exam.questions.forEach((question, index) => {
      maxScore += question.points

      if (userAnswers[index] === null) return

      if (question.type === "completion") {
        const userCompletionAnswers = userAnswers[index] || []
        let allCorrect = true

        question.wordsToComplete.forEach((word, wordIndex) => {
          if (userCompletionAnswers[wordIndex]?.toLowerCase() !== word.toLowerCase()) {
            allCorrect = false
          }
        })

        if (allCorrect) totalScore += question.points
      } else {
        if (userAnswers[index] === question.correctAnswer) {
          totalScore += question.points
        }
      }
    })

    return { totalScore, maxScore }
  }

  const handleCloseExam = () => {
    setShowExitConfirmation(true)
  }

  const confirmExit = () => {
    setShowExitConfirmation(false)
    onClose()
  }

  const handleFinishReview = () => {
    onClose()
  }

  const handleGoToFeedback = () => {
    onClose()
    const { totalScore, maxScore } = calculateScore()
    const scorePercentage = Math.round((totalScore / maxScore) * 100)
    const passed = scorePercentage >= 70

    const activity = {
      id: exam.id.toString(),
      name: exam.title,
      type: exam.type === "exam" ? "Examen" : "Actividad",
      score: scorePercentage,
      completed: true,
      feedback: passed
        ? "¡Excelente trabajo! Has completado esta evaluación satisfactoriamente."
        : "Necesitas mejorar en algunos aspectos. Revisa las preguntas incorrectas.",
      questions: exam.questions.map((question, index) => ({
        id: question.id.toString(),
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswers[index],
        score: userAnswers[index] === question.correctAnswer ? question.points : 0,
        maxScore: question.points,
        feedback:
          userAnswers[index] === question.correctAnswer
            ? "¡Correcto! Bien hecho."
            : "Incorrecto. La respuesta correcta es: " + question.options[question.correctAnswer],
      })),
    }

    navigate("/Retroalimentacion", { state: { openActivity: activity } })
  }

  const handleAudioProgressClick = (e) => {
    if (!audioRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width

    audioRef.current.currentTime = percentage * audioRef.current.duration
  }

  const toggleAudioPlay = () => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
    } else {
      audioRef.current.pause()
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !audioRef.current.muted
    setUserAnswers([...userAnswers])
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
              Pregunta {currentQuestionIndex + 1}
            </div>
            <span className="text-sm text-gray-500">de {exam.questions.length}</span>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {currentQuestion.points} Puntos
          </div>
        </div>

        <div className="mt-4">
          {(() => {
            switch (currentQuestion.type) {
              case "multiple-choice":
                return (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#1f384c] text-lg leading-relaxed">{currentQuestion.text}</h3>
                    <div className="space-y-3">
                      <h4 className="text-gray-600 font-medium mb-4 text-base">Selecciona la respuesta correcta:</h4>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 cursor-pointer transition-all duration-300 ${
                              userAnswers[currentQuestionIndex] === index
                                ? "border-[#1f384c] bg-[#1f384c] shadow-lg"
                                : "border-gray-300 hover:border-[#1f384c]"
                            }`}
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {userAnswers[currentQuestionIndex] === index && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label
                            className="text-gray-700 cursor-pointer text-base hover:text-[#1f384c] transition-colors"
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )

              case "true-false":
                return (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#1f384c] text-lg leading-relaxed">{currentQuestion.text}</h3>
                    <div className="space-y-3">
                      <h4 className="text-gray-600 font-medium mb-4 text-base">Selecciona verdadero o falso:</h4>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 cursor-pointer transition-all duration-300 ${
                              userAnswers[currentQuestionIndex] === index
                                ? "border-[#1f384c] bg-[#1f384c] shadow-lg"
                                : "border-gray-300 hover:border-[#1f384c]"
                            }`}
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {userAnswers[currentQuestionIndex] === index && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label
                            className="text-gray-700 cursor-pointer text-base hover:text-[#1f384c] transition-colors"
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )

              case "image":
                return (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#1f384c] text-lg leading-relaxed">{currentQuestion.text}</h3>
                    <div className="flex justify-center mb-6">
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <img
                          src={currentQuestion.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt="Question"
                          className="max-w-full h-auto"
                          style={{ maxHeight: "250px" }}
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-gray-600 font-medium mb-4 text-base">Selecciona la respuesta correcta:</h4>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 cursor-pointer transition-all duration-300 ${
                              userAnswers[currentQuestionIndex] === index
                                ? "border-[#1f384c] bg-[#1f384c] shadow-lg"
                                : "border-gray-300 hover:border-[#1f384c]"
                            }`}
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {userAnswers[currentQuestionIndex] === index && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label
                            className="text-gray-700 cursor-pointer text-base hover:text-[#1f384c] transition-colors"
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )

              case "audio":
                return (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#1f384c] text-lg leading-relaxed">{currentQuestion.text}</h3>
                    <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-xl p-2 border border-[#1f384c]/20">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={toggleAudioPlay}
                          className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-full hover:shadow-lg transition-all duration-300"
                        >
                          {audioRef.current && !audioRef.current.paused ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10 9H6V15H10V9Z" fill="currentColor" />
                              <path d="M18 9H14V15H18V9Z" fill="currentColor" />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
                            </svg>
                          )}
                        </button>

                        <div
                          className="relative flex-1 h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                          onClick={handleAudioProgressClick}
                        >
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] transition-all duration-100"
                            style={{ width: `${audioProgress}%` }}
                          ></div>
                        </div>

                        <button
                          onClick={toggleMute}
                          className="flex items-center justify-center w-10 h-10 text-[#1f384c] hover:bg-[#1f384c]/10 rounded-full transition-colors"
                        >
                          {audioRef.current && audioRef.current.muted ? (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 9.50001C16.5 10.2 16.5 11 16.5 12C16.5 13 16.5 13.8 16 14.5M19 7C20.5 8.5 20.5 11 20.5 12C20.5 13 20.5 15.5 19 17M4.34375 11H2.5C2.22386 11 2 11.2239 2 11.5V12.5C2 12.7761 2.22386 13 2.5 13H4.34378L8.59584 16.5689C9.16382 17.0644 10 16.6566 10 15.9082V8.09179C10 7.34336 9.16382 6.93558 8.59584 7.43105L4.34375 11Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M22 2L2 22"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 9.50001C16.5 10.2 16.5 11 16.5 12C16.5 13 16.5 13.8 16 14.5M19 7C20.5 8.5 20.5 11 20.5 12C20.5 13 20.5 15.5 19 17M4.34375 11H2.5C2.22386 11 2 11.2239 2 11.5V12.5C2 12.7761 2.22386 13 2.5 13H4.34378L8.59584 16.5689C9.16382 17.0644 10 16.6566 10 15.9082V8.09179C10 7.34336 9.16382 6.93558 8.59584 7.43105L4.34375 11Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <audio ref={audioRef} src={currentQuestion.audioUrl} className="hidden" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-gray-600 font-medium mb-4 text-base">Selecciona la respuesta correcta:</h4>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-4 cursor-pointer transition-all duration-300 ${
                              userAnswers[currentQuestionIndex] === index
                                ? "border-[#1f384c] bg-[#1f384c] shadow-lg"
                                : "border-gray-300 hover:border-[#1f384c]"
                            }`}
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {userAnswers[currentQuestionIndex] === index && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <label
                            className="text-gray-700 cursor-pointer text-base hover:text-[#1f384c] transition-colors"
                            onClick={() => handleAnswerSelection(index)}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )

              case "completion":
                const textParts = currentQuestion.text.split("[]")
                return (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-[#1f384c] text-lg">
                      {currentQuestion.title || "Completa la frase"}
                    </h3>

                    <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-xl p-6 border border-[#1f384c]/20">
                      <div className="flex flex-wrap items-center text-lg leading-relaxed">
                        {textParts.map((part, index) => (
                          <React.Fragment key={index}>
                            <span className="text-gray-800">{part}</span>
                            {index < textParts.length - 1 && (
                              <div
                                className={`mx-2 min-w-[120px] h-12 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                  completionAnswers[index]
                                    ? "border-[#1f384c] bg-white shadow-sm"
                                    : "border-dashed border-gray-400 bg-gray-50 hover:border-[#1f384c]"
                                }`}
                                onClick={() => completionAnswers[index] && handleRemoveCompletionWord(index)}
                              >
                                {completionAnswers[index] ? (
                                  <span className="font-semibold text-[#1f384c]">{completionAnswers[index]}</span>
                                ) : (
                                  <span className="text-gray-400 text-sm">Selecciona</span>
                                )}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-4 text-base">Opciones disponibles:</h4>
                      <div className="flex flex-wrap gap-3">
                        {currentQuestion.options.map((word, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                              completionAnswers.includes(word)
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white hover:shadow-lg hover:scale-105"
                            }`}
                            onClick={() => handleCompletionWordClick(word)}
                            disabled={
                              completionAnswers.includes(word) ||
                              nextBlankIndex >= currentQuestion.wordsToComplete.length
                            }
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )

              default:
                return <p className="text-gray-500">Tipo de pregunta no soportado</p>
            }
          })()}
        </div>
      </div>
    )
  }

  const renderResults = () => {
    const { totalScore, maxScore } = calculateScore()
    const percentage = Math.round((totalScore / maxScore) * 100)
    const passed = percentage >= 70

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              passed ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {passed ? (
              <Trophy className="text-emerald-600" size={40} />
            ) : (
              <AlertCircle className="text-red-600" size={40} />
            )}
          </div>
          <h2 className="text-xl font-bold text-[#1f384c] mb-2">Resultados del Examen</h2>
          <p className="text-base text-gray-600">Has completado todas las preguntas</p>
        </div>

        <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 rounded-xl p-6 mb-6 border border-[#1f384c]/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#1f384c] mb-2">{percentage}%</div>
            <div className="text-base font-semibold mb-4">
              {totalScore} de {maxScore} puntos
            </div>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                passed ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
            >
              {passed ? "¡Aprobado!" : "No aprobado"}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <h3 className="text-lg font-semibold text-[#1f384c] mb-4">Resumen por pregunta:</h3>
          {exam.questions.map((question, index) => {
            let isCorrect = false

            if (question.type === "completion") {
              const userCompletionAnswers = userAnswers[index] || []
              isCorrect = question.wordsToComplete.every(
                (word, i) => userCompletionAnswers[i]?.toLowerCase() === word.toLowerCase(),
              )
            } else {
              isCorrect = userAnswers[index] === question.correctAnswer
            }

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCorrect ? "bg-emerald-100" : "bg-red-100"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-emerald-600" />
                    ) : (
                      <X size={16} className="text-red-600" />
                    )}
                  </div>
                  <span className="font-medium text-gray-800">Pregunta {index + 1}</span>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {isCorrect ? question.points : 0} / {question.points} puntos
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">
            <button onClick={handleGoToFeedback} className="text-[#1f384c] hover:underline font-medium">
              Ver retroalimentación detallada
            </button>
          </p>

          <button
            onClick={handleFinishReview}
            className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] hover:from-[#152a38] hover:to-[#1f384c] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg"
          >
            Finalizar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCloseExam}
              className="flex items-center text-white/90 hover:text-white font-medium hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Abandonar
            </button>

            {!showResults && (
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">Sin límite</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {currentQuestionIndex + 1} / {exam.questions.length}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold text-white">{exam.title}</h1>
            {!showResults && (
              <div className="mt-2 bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {showResults ? (
              renderResults()
            ) : (
              <>
                {renderQuestion()}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                      currentQuestionIndex === 0
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "border-2 border-[#1f384c] text-[#1f384c] hover:bg-[#1f384c] hover:text-white"
                    }`}
                  >
                    <ChevronLeft size={20} className="mr-1" />
                    Anterior
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center px-4 py-3 text-sm bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-xl hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300 font-medium hover:shadow-lg"
                  >
                    {currentQuestionIndex < exam.questions.length - 1 ? (
                      <>
                        Siguiente
                        <ChevronRight size={20} className="ml-1" />
                      </>
                    ) : (
                      <>
                        <Trophy size={20} className="mr-1" />
                        Finalizar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Exit */}
      <ConfirmationModal
        isOpen={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={confirmExit}
        title="¿Estás seguro de que deseas abandonar?"
        message="Si abandonas ahora, perderás tu progreso en esta evaluación."
        confirmText="Confirmar"
        confirmColor="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
      />
    </div>
  )
}

export default ExamModal
