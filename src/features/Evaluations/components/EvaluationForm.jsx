"use client"

import { useState, useEffect, useCallback } from "react"
import { FiUpload, FiChevronDown, FiPlus } from "react-icons/fi"
import { Trash, Pencil } from "lucide-react"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import { isEvaluationInUse } from "../services/courseProgrammingService"
import { validateEvaluationName } from "../services/evaluationValidationService"

const EvaluationForm = ({ evaluation = null, onSubmit, onCancel, isCreating = false }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    tematica: "",
    tipoEvaluacion: "Examen",
    estado: "Activo",
    descripcion: "",
    material: null,
    materialName: "",
    preguntas: [],
  })

  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  const [currentQuestionType, setCurrentQuestionType] = useState(null)
  const [questionData, setQuestionData] = useState({
    tipo: "",
    texto: "",
    opciones: ["", "", "", ""],
    respuestaCorrecta: 0,
    puntaje: 10,
    imagen: null,
    imagenName: "",
    audio: null,
    audioName: "",
    completarTexto: "",
    palabrasCompletar: ["", ""],
    opcionesRelleno: ["", "", ""],
  })
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null)
  const [validationError, setValidationError] = useState("")
  const [isInUseModalOpen, setIsInUseModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para validaciones
  const [touchedFields, setTouchedFields] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [isValidatingName, setIsValidatingName] = useState(false)

  useEffect(() => {
    if (evaluation) {
      const extractFileName = (filePath) => {
        if (!filePath) return ""
        if (typeof filePath === "string") {
          return filePath.split("/").pop() || filePath
        }
        return filePath.name || ""
      }

      setFormData({
        nombre: evaluation.nombre || "",
        tematica: evaluation.tematica || "",
        tipoEvaluacion: evaluation.tipoEvaluacion || "Examen",
        estado: evaluation.estado || "Activo",
        descripcion: evaluation.descripcion || "",
        material: evaluation.material || null,
        materialName: extractFileName(evaluation.material),
        preguntas: evaluation.preguntas
          ? evaluation.preguntas.map((pregunta) => {
              return {
                ...pregunta,
                imagenName: pregunta.tipo === "imagen" ? extractFileName(pregunta.imagen) : "",
                audioName: pregunta.tipo === "audio" ? extractFileName(pregunta.audio) : "",
              }
            })
          : [],
      })
    }
  }, [evaluation])

  // Validación del nombre con debounce
  const validateNameField = useCallback(
    async (nombre, tipoEvaluacion) => {
      if (!touchedFields.nombre) return

      setIsValidatingName(true)
      try {
        const currentId = evaluation?.id || evaluation?._id
        const error = await validateEvaluationName(nombre, tipoEvaluacion, currentId)

        setFieldErrors((prev) => ({
          ...prev,
          nombre: error,
        }))
      } catch (error) {
        console.error("Error validating name:", error)
        setFieldErrors((prev) => ({
          ...prev,
          nombre: "Error al validar el nombre",
        }))
      } finally {
        setIsValidatingName(false)
      }
    },
    [touchedFields.nombre, evaluation],
  )

  // Efecto para validar nombre cuando cambie
  useEffect(() => {
    if (touchedFields.nombre && formData.nombre && formData.tipoEvaluacion) {
      const timeoutId = setTimeout(() => {
        validateNameField(formData.nombre, formData.tipoEvaluacion)
      }, 500) // Debounce de 500ms

      return () => clearTimeout(timeoutId)
    }
  }, [formData.nombre, formData.tipoEvaluacion, validateNameField])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Marcar el campo como tocado
    if (!touchedFields[name]) {
      setTouchedFields((prev) => ({
        ...prev,
        [name]: true,
      }))
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleToggleEstado = async () => {
    if (formData.estado === "Activo" && evaluation && evaluation.id) {
      const inUse = await isEvaluationInUse(evaluation.id)
      if (inUse) {
        setIsInUseModalOpen(true)
        return
      }
    }
    setFormData((prev) => ({
      ...prev,
      estado: prev.estado === "Activo" ? "Inactivo" : "Activo",
    }))
  }

  const handleQuestionChange = (e) => {
    const { name, value } = e.target
    setQuestionData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo para materiales
      const allowedMaterialTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ]

      if (!allowedMaterialTypes.includes(file.type)) {
        setValidationError(
          "Tipo de archivo no permitido para material. Solo se permiten: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT",
        )
        return
      }

      setValidationError("")
      setFormData((prev) => ({
        ...prev,
        material: file,
        materialName: file.name,
      }))
    }
  }

  const handleQuestionFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo para imágenes
      const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"]

      if (!allowedImageTypes.includes(file.type)) {
        setValidationError("Tipo de imagen no permitido. Solo se permiten: JPG, JPEG, PNG")
        return
      }

      setValidationError("")
      setQuestionData((prev) => ({
        ...prev,
        imagen: file,
        imagenName: file.name,
      }))
    }
  }

  const handleQuestionAudioChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo para audios
      const allowedAudioTypes = ["audio/mpeg", "audio/mp3"]

      if (!allowedAudioTypes.includes(file.type)) {
        setValidationError("Tipo de audio no permitido. Solo se permiten archivos MP3")
        return
      }

      setValidationError("")
      setQuestionData((prev) => ({
        ...prev,
        audio: file,
        audioName: file.name,
      }))
    }
  }

  const handleEditQuestion = (index) => {
    const questionToEdit = formData.preguntas[index]
    setQuestionData({
      ...questionToEdit,
      opcionesRelleno: questionToEdit.opcionesRelleno || ["", "", ""],
      imagenName: questionToEdit.imagenName || "",
      audioName: questionToEdit.audioName || "",
    })
    setCurrentQuestionType(questionToEdit.tipo)
    setEditingQuestionIndex(index)
  }

  const addQuestion = () => {
    if (
      (currentQuestionType !== "completar" && (!questionData.texto || questionData.texto.trim() === "")) ||
      (currentQuestionType === "completar" &&
        (!questionData.completarTexto || questionData.completarTexto.trim() === ""))
    ) {
      setValidationError("El enunciado de la pregunta no puede estar vacío")
      return
    }

    if (currentQuestionType === "seleccion" || currentQuestionType === "imagen" || currentQuestionType === "audio") {
      if (questionData.opciones.some((opcion) => !opcion || opcion.trim() === "")) {
        setValidationError("Todas las opciones deben tener contenido")
        return
      }
    }

    if (currentQuestionType === "completar") {
      const matches = questionData.completarTexto.match(/\[\s*\]/g) || []
      if (matches.length === 0) {
        setValidationError("Debe incluir al menos un espacio para completar usando []")
        return
      }

      if (questionData.palabrasCompletar.some((palabra) => !palabra || palabra.trim() === "")) {
        setValidationError("Todas las palabras a completar deben tener contenido")
        return
      }

      if (questionData.opcionesRelleno.some((opcion) => !opcion || opcion.trim() === "")) {
        setValidationError("Todas las opciones de relleno deben tener contenido")
        return
      }
    }

    if (currentQuestionType === "imagen" && !questionData.imagen && !questionData.imagenName) {
      setValidationError("Debe seleccionar una imagen para este tipo de pregunta")
      return
    }

    if (currentQuestionType === "audio" && !questionData.audio && !questionData.audioName) {
      setValidationError("Debe seleccionar un archivo de audio para este tipo de pregunta")
      return
    }

    setValidationError("")

    if (editingQuestionIndex !== null) {
      setFormData((prev) => {
        const updatedPreguntas = [...prev.preguntas]
        updatedPreguntas[editingQuestionIndex] = {
          ...questionData,
          id: prev.preguntas[editingQuestionIndex].id,
          imagen: questionData.imagen || (questionData.imagenName ? prev.preguntas[editingQuestionIndex].imagen : null),
          audio: questionData.audio || (questionData.audioName ? prev.preguntas[editingQuestionIndex].audio : null),
        }
        return {
          ...prev,
          preguntas: updatedPreguntas,
        }
      })
      setEditingQuestionIndex(null)
    } else {
      setFormData((prev) => ({
        ...prev,
        preguntas: [...prev.preguntas, { ...questionData, id: Date.now() }],
      }))
    }

    setQuestionData({
      tipo: "",
      texto: "",
      opciones: ["", "", "", ""],
      respuestaCorrecta: 0,
      puntaje: 10,
      imagen: null,
      imagenName: "",
      audio: null,
      audioName: "",
      completarTexto: "",
      palabrasCompletar: ["", ""],
      opcionesRelleno: ["", "", ""],
    })
    setCurrentQuestionType(null)
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.opciones]
    newOptions[index] = value
    setQuestionData((prev) => ({
      ...prev,
      opciones: newOptions,
    }))
  }

  const handlePalabraCompletarChange = (index, value) => {
    const newPalabras = [...questionData.palabrasCompletar]
    newPalabras[index] = value
    setQuestionData((prev) => ({
      ...prev,
      palabrasCompletar: newPalabras,
    }))
  }

  const handleOpcionRellenoChange = (index, value) => {
    const newOpciones = [...questionData.opcionesRelleno]
    newOpciones[index] = value
    setQuestionData((prev) => ({
      ...prev,
      opcionesRelleno: newOpciones,
    }))
  }

  const addPalabraCompletar = () => {
    setQuestionData((prev) => ({
      ...prev,
      palabrasCompletar: [...prev.palabrasCompletar, ""],
    }))
  }

  const addOpcionRelleno = () => {
    setQuestionData((prev) => ({
      ...prev,
      opcionesRelleno: [...prev.opcionesRelleno, ""],
    }))
  }

  const removeOpcionRelleno = (index) => {
    if (questionData.opcionesRelleno.length > 1) {
      setQuestionData((prev) => ({
        ...prev,
        opcionesRelleno: prev.opcionesRelleno.filter((_, i) => i !== index),
      }))
    }
  }

  const selectQuestionType = (tipo) => {
    setCurrentQuestionType(tipo)
    setQuestionData((prev) => ({
      ...prev,
      tipo: tipo,
    }))
    setShowQuestionTypes(false)
  }

  const getTotalPoints = () => {
    const existingPoints = formData.preguntas
      .filter((_, index) => index !== editingQuestionIndex)
      .reduce((total, pregunta) => total + Number(pregunta.puntaje), 0)

    const currentQuestionPoints = currentQuestionType ? Number(questionData.puntaje) : 0

    return existingPoints + currentQuestionPoints
  }

  const getSavedQuestionsPoints = () => {
    return formData.preguntas.reduce((total, pregunta) => total + Number(pregunta.puntaje), 0)
  }

  const isPuntajeValid = () => {
    const total = getSavedQuestionsPoints()
    return total === 100
  }

  const getPointsIndicator = () => {
    const totalPoints = getTotalPoints()
    if (totalPoints === 100) {
      return {
        color: "text-green-600",
        text: `¡Puntaje total de ${totalPoints} puntos alcanzado!`,
      }
    } else if (totalPoints < 100) {
      return {
        color: "text-orange-600",
        text: `Actualmente hay ${totalPoints} puntos, lo cual es inferior a los 100.`,
      }
    } else {
      return {
        color: "text-red-600",
        text: `Actualmente hay ${totalPoints} puntos, lo cual supera los 100.`,
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marcar todos los campos como tocados para mostrar errores
    setTouchedFields({
      nombre: true,
      tematica: true,
      tipoEvaluacion: true,
    })

    // Validar nombre antes de enviar
    if (formData.nombre && formData.tipoEvaluacion) {
      const currentId = evaluation?.id || evaluation?._id
      const nameError = await validateEvaluationName(formData.nombre, formData.tipoEvaluacion, currentId)
      if (nameError) {
        setFieldErrors((prev) => ({
          ...prev,
          nombre: nameError,
        }))
        return
      }
    }

    if (!isPuntajeValid()) {
      return
    }

    // Verificar si hay errores de validación
    if (fieldErrors.nombre) {
      return
    }

    setIsSubmitting(true)
    setValidationError("")

    try {
      const data = new FormData()

      data.append("nombre", formData.nombre)
      data.append("tematica", formData.tematica)
      data.append("tipoEvaluacion", formData.tipoEvaluacion)
      data.append("estado", formData.estado)
      data.append("descripcion", formData.descripcion || "")

      if (evaluation && evaluation.id) {
        data.append("id", evaluation.id)
      }

      if (formData.material instanceof File) {
        data.append("material", formData.material)
      } else if (formData.material && typeof formData.material === "string" && evaluation) {
        data.append("materialUrl", formData.material)
      }

      const preguntasModificadas = JSON.parse(JSON.stringify(formData.preguntas))

      formData.preguntas.forEach((pregunta, index) => {
        delete preguntasModificadas[index].imagenName
        delete preguntasModificadas[index].audioName

        if (pregunta.tipo === "imagen") {
          if (pregunta.imagen instanceof File) {
            const fileKey = `imagen_pregunta_${index}`
            data.append(fileKey, pregunta.imagen)
            preguntasModificadas[index].imagen = fileKey
          } else if (typeof pregunta.imagen === "string" && pregunta.imagen) {
            preguntasModificadas[index].imagen = pregunta.imagen
          }
        }

        if (pregunta.tipo === "audio") {
          if (pregunta.audio instanceof File) {
            const fileKey = `audio_pregunta_${index}`
            data.append(fileKey, pregunta.audio)
            preguntasModificadas[index].audio = fileKey
          } else if (typeof pregunta.audio === "string" && pregunta.audio) {
            preguntasModificadas[index].audio = pregunta.audio
          }
        }
      })

      data.append("preguntas", JSON.stringify(preguntasModificadas))

      await onSubmit(data)
    } catch (error) {
      console.error("Error en handleSubmit:", error)
      setValidationError("Error al procesar la evaluación. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompletarTextoChange = (e) => {
    const text = e.target.value
    setQuestionData((prev) => ({
      ...prev,
      completarTexto: text,
    }))

    const matches = text.match(/\[\s*\]/g) || []
    const numSpaces = matches.length

    if (numSpaces > questionData.palabrasCompletar.length) {
      const newPalabras = [...questionData.palabrasCompletar]
      for (let i = questionData.palabrasCompletar.length; i < numSpaces; i++) {
        newPalabras.push("")
      }
      setQuestionData((prev) => ({
        ...prev,
        palabrasCompletar: newPalabras,
      }))
    } else if (numSpaces < questionData.palabrasCompletar.length) {
      setQuestionData((prev) => ({
        ...prev,
        palabrasCompletar: prev.palabrasCompletar.slice(0, numSpaces),
      }))
    }
  }

  const isSaveDisabled =
    (formData.preguntas.length > 0 && !isPuntajeValid()) ||
    currentQuestionType !== null ||
    fieldErrors.nombre ||
    isValidatingName

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-[18px] font-bold text-center text-[#1f384c] mb-4">
        {evaluation && evaluation.id ? "EDITAR EVALUACIÓN" : "CREAR EVALUACION"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          {/* Primera fila: Nombre y Temática */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-medium mb-1">Nombre de la Evaluacion</label>
              <div className="relative">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md text-[14px] ${
                    touchedFields.nombre && fieldErrors.nombre
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Ingrese el nombre de la evaluacion"
                  disabled={isSubmitting}
                  required
                />
                {isValidatingName && (
                  <div className="absolute right-2 top-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {touchedFields.nombre && fieldErrors.nombre && (
                <p className="mt-1 text-red-500 text-[12px]">{fieldErrors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-[14px] font-medium mb-1">Temática</label>
              <select
                name="tematica"
                value={formData.tematica}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                required
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Seleccione una temática
                </option>
                <option value="listening">Listening</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
                <option value="reading">Reading</option>
              </select>
            </div>
          </div>

          {/* Segunda fila: Tipo y Material */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-medium mb-1">Tipo</label>
              <select
                name="tipoEvaluacion"
                value={formData.tipoEvaluacion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                required
                disabled={isSubmitting}
              >
                <option value="Examen">Examen</option>
                <option value="Actividad">Actividad</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-medium mb-1">Material</label>
              <div className="flex items-center">
                <input
                  type="file"
                  id="material"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  disabled={isSubmitting}
                />
                <div className="flex-1 border border-gray-300 rounded-l-md p-2 text-[14px] bg-white text-gray-500 truncate">
                  {formData.material instanceof File
                    ? formData.material.name
                    : formData.materialName
                      ? formData.materialName
                      : "Seleccionar archivo. Ningún archivo seleccionado"}
                </div>
                <label
                  htmlFor="material"
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-r-md cursor-pointer text-[14px]"
                >
                  <FiUpload className="mr-2" />
                  Subir
                </label>
              </div>
            </div>
          </div>

          {/* Tercera fila: Estado (solo en edición) */}
          {!isCreating && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] font-medium mb-1">Estado</label>
                <div className="flex items-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleEstado}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      formData.estado === "Activo" ? "bg-green-600" : "bg-gray-200"
                    }`}
                    disabled={isSubmitting}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.estado === "Activo" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="ml-3 text-[14px] font-medium">
                    {formData.estado === "Activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[14px] font-medium mb-1">Descripción General</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md text-[14px] min-h-[80px]"
              placeholder="Escriba una descripción general sobre esta actividad..."
              disabled={isSubmitting}
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="mb-4">
              <label className="block text-[14px] font-medium mb-4">Preguntas</label>

              {formData.preguntas.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[14px] font-medium mb-2">Preguntas agregadas:</h3>
                  <div className="space-y-2">
                    {formData.preguntas.map((pregunta, index) => (
                      <div
                        key={pregunta.id}
                        className="flex justify-between items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-[14px]">
                            {index + 1}.{" "}
                            {pregunta.texto
                              ? pregunta.texto.substring(0, 30)
                              : pregunta.completarTexto
                                ? pregunta.completarTexto.substring(0, 30)
                                : ""}
                            {(pregunta.texto && pregunta.texto.length > 30) ||
                            (pregunta.completarTexto && pregunta.completarTexto.length > 30)
                              ? "..."
                              : ""}
                          </p>
                          <p className="text-[12px] text-gray-500">
                            Tipo: {pregunta.tipo} | Puntaje: {pregunta.puntaje}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(index)}
                            className="text-blue-500 hover:text-blue-700"
                            disabled={isSubmitting}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFormData((prev) => ({
                                ...prev,
                                preguntas: prev.preguntas.filter((_, i) => i !== index),
                              }))
                            }}
                            className="text-red-500 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowQuestionTypes(!showQuestionTypes)}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-[14px]"
                  disabled={isSubmitting}
                >
                  Agregar nueva pregunta
                  <FiChevronDown className="ml-2" />
                </button>
                {showQuestionTypes && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-[#f3edf7] rounded-md shadow-lg z-10 p-2">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => selectQuestionType("seleccion")}
                        className="block w-full text-left px-3 py-2 text-[14px] hover:bg-[#e8def8] rounded-md"
                        disabled={isSubmitting}
                      >
                        Selección múltiple única respuesta
                      </button>
                      <button
                        type="button"
                        onClick={() => selectQuestionType("verdaderoFalso")}
                        className="block w-full text-left px-3 py-2 text-[14px] hover:bg-[#e8def8] rounded-md"
                        disabled={isSubmitting}
                      >
                        Verdadero o falso
                      </button>
                      <button
                        type="button"
                        onClick={() => selectQuestionType("imagen")}
                        className="block w-full text-left px-3 py-2 text-[14px] hover:bg-[#e8def8] rounded-md"
                        disabled={isSubmitting}
                      >
                        Imagen con preguntas
                      </button>
                      <button
                        type="button"
                        onClick={() => selectQuestionType("audio")}
                        className="block w-full text-left px-3 py-2 text-[14px] hover:bg-[#e8def8] rounded-md"
                        disabled={isSubmitting}
                      >
                        Audio con pregunta
                      </button>
                      <button
                        type="button"
                        onClick={() => selectQuestionType("completar")}
                        className="block w-full text-left px-3 py-2 text-[14px] hover:bg-[#e8def8] rounded-md"
                        disabled={isSubmitting}
                      >
                        Completar espacios
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {currentQuestionType === "imagen" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[14px] font-medium">Pregunta con imagen</h3>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-[14px] mr-2">Puntos:</span>
                        <input
                          type="number"
                          name="puntaje"
                          value={questionData.puntaje}
                          onChange={handleQuestionChange}
                          className="w-16 p-1 border border-gray-300 rounded-md text-[14px]"
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      {currentQuestionType && (
                        <div className={`text-[12px] mt-1 ${getPointsIndicator().color}`}>
                          {getPointsIndicator().text}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionType(null)}
                      className="ml-2 text-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash className="h-4 w-6 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="imagen"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleQuestionFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1 border border-gray-300 rounded-l-md p-2 text-[14px] bg-white text-gray-500 truncate">
                      {questionData.imagen instanceof File
                        ? questionData.imagen.name
                        : questionData.imagenName
                          ? questionData.imagenName
                          : "Seleccionar archivo. Ningún archivo seleccionado"}
                    </div>
                    <label
                      htmlFor="imagen"
                      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-r-md cursor-pointer text-[14px]"
                    >
                      <FiUpload className="mr-2" />
                      Subir
                    </label>
                  </div>

                  <textarea
                    name="texto"
                    value={questionData.texto}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                    placeholder="Ingrese la pregunta relacionada con la imagen"
                    required
                    disabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="respuestaCorrecta"
                          checked={questionData.respuestaCorrecta === index}
                          onChange={() => setQuestionData((prev) => ({ ...prev, respuestaCorrecta: index }))}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={questionData.opciones[index]}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                          placeholder={`Opción ${index + 1}`}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 bg-[#46ae69] text-white rounded-md hover:bg-green-600 transition-colors text-[14px]"
                    disabled={isSubmitting}
                  >
                    {editingQuestionIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"}
                  </button>

                  {validationError && <p className="mt-2 text-red-500 text-[14px]">{validationError}</p>}
                </div>
              </div>
            )}

            {currentQuestionType === "seleccion" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[14px] font-medium">Pregunta Selección Múltiple Única respuesta</h3>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-[14px] mr-2">Puntos:</span>
                        <input
                          type="number"
                          name="puntaje"
                          value={questionData.puntaje}
                          onChange={handleQuestionChange}
                          className="w-16 p-1 border border-gray-300 rounded-md text-[14px]"
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      {currentQuestionType && (
                        <div className={`text-[12px] mt-1 ${getPointsIndicator().color}`}>
                          {getPointsIndicator().text}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionType(null)}
                      className="ml-2 text-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash className="h-4 w-6 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    name="texto"
                    value={questionData.texto}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                    placeholder="Escriba la pregunta aquí"
                    required
                    disabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="respuestaCorrecta"
                          checked={questionData.respuestaCorrecta === index}
                          onChange={() => setQuestionData((prev) => ({ ...prev, respuestaCorrecta: index }))}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={questionData.opciones[index]}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                          placeholder={`Opción ${index + 1}`}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 bg-[#46ae69] text-white rounded-md hover:bg-green-600 transition-colors text-[14px]"
                    disabled={isSubmitting}
                  >
                    {editingQuestionIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"}
                  </button>

                  {validationError && <p className="mt-2 text-red-500 text-[14px]">{validationError}</p>}
                </div>
              </div>
            )}

            {currentQuestionType === "verdaderoFalso" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[14px] font-medium">Pregunta Verdadero o Falso</h3>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-[14px] mr-2">Puntos:</span>
                        <input
                          type="number"
                          name="puntaje"
                          value={questionData.puntaje}
                          onChange={handleQuestionChange}
                          className="w-16 p-1 border border-gray-300 rounded-md text-[14px]"
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      {currentQuestionType && (
                        <div className={`text-[12px] mt-1 ${getPointsIndicator().color}`}>
                          {getPointsIndicator().text}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionType(null)}
                      className="ml-2 text-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash className="h-4 w-6 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    name="texto"
                    value={questionData.texto}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                    placeholder="Escriba la pregunta aquí"
                    required
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="respuestaCorrecta"
                      checked={questionData.respuestaCorrecta === 0}
                      onChange={() => setQuestionData((prev) => ({ ...prev, respuestaCorrecta: 0 }))}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-[14px]">Verdadero</span>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="respuestaCorrecta"
                      checked={questionData.respuestaCorrecta === 1}
                      onChange={() => setQuestionData((prev) => ({ ...prev, respuestaCorrecta: 1 }))}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-[14px]">Falso</span>
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 bg-[#46ae69] text-white rounded-md hover:bg-green-600 transition-colors text-[14px]"
                    disabled={isSubmitting}
                  >
                    {editingQuestionIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"}
                  </button>

                  {validationError && <p className="mt-2 text-red-500 text-[14px]">{validationError}</p>}
                </div>
              </div>
            )}

            {currentQuestionType === "audio" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[14px] font-medium">Pregunta con audio</h3>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-[14px] mr-2">Puntos:</span>
                        <input
                          type="number"
                          name="puntaje"
                          value={questionData.puntaje}
                          onChange={handleQuestionChange}
                          className="w-16 p-1 border border-gray-300 rounded-md text-[14px]"
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      {currentQuestionType && (
                        <div className={`text-[12px] mt-1 ${getPointsIndicator().color}`}>
                          {getPointsIndicator().text}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionType(null)}
                      className="ml-2 text-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash className="h-4 w-6 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="audio"
                      accept="audio/mpeg,audio/mp3"
                      onChange={handleQuestionAudioChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="flex-1 border border-gray-300 rounded-l-md p-2 text-[14px] bg-white text-gray-500 truncate">
                      {questionData.audio instanceof File
                        ? questionData.audio.name
                        : questionData.audioName
                          ? questionData.audioName
                          : "Seleccionar archivo. Ningún archivo seleccionado"}
                    </div>
                    <label
                      htmlFor="audio"
                      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-r-md cursor-pointer text-[14px]"
                    >
                      <FiUpload className="mr-2" />
                      Subir
                    </label>
                  </div>

                  <textarea
                    name="texto"
                    value={questionData.texto}
                    onChange={handleQuestionChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                    placeholder="Ingrese la pregunta relacionada con el audio"
                    required
                    disabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="respuestaCorrecta"
                          checked={questionData.respuestaCorrecta === index}
                          onChange={() => setQuestionData((prev) => ({ ...prev, respuestaCorrecta: index }))}
                          className="mr-2"
                          disabled={isSubmitting}
                        />
                        <input
                          type="text"
                          value={questionData.opciones[index]}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                          placeholder={`Opción ${index + 1}`}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 bg-[#46ae69] text-white rounded-md hover:bg-green-600 transition-colors text-[14px]"
                    disabled={isSubmitting}
                  >
                    {editingQuestionIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"}
                  </button>

                  {validationError && <p className="mt-2 text-red-500 text-[14px]">{validationError}</p>}
                </div>
              </div>
            )}

            {currentQuestionType === "completar" && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[14px] font-medium">Pregunta de Completar Espacios</h3>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-[14px] mr-2">Puntos:</span>
                        <input
                          type="number"
                          name="puntaje"
                          value={questionData.puntaje}
                          onChange={handleQuestionChange}
                          className="w-16 p-1 border border-gray-300 rounded-md text-[14px]"
                          min="1"
                          disabled={isSubmitting}
                        />
                      </div>
                      {currentQuestionType && (
                        <div className={`text-[12px] mt-1 ${getPointsIndicator().color}`}>
                          {getPointsIndicator().text}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionType(null)}
                      className="ml-2 text-red-500"
                      disabled={isSubmitting}
                    >
                      <Trash className="h-4 w-6 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[12px] text-gray-500 mb-1">
                      Usa corchetes [] para indicar los espacios a completar. Ejemplo: "The [cat] is [black]"
                    </p>
                    <textarea
                      name="completarTexto"
                      value={questionData.completarTexto}
                      onChange={handleCompletarTextoChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                      placeholder="Escribe el texto con espacios para completar usando []"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {questionData.palabrasCompletar.length > 0 && (
                    <div>
                      <h4 className="text-[14px] font-medium mb-2">Palabras para Completar</h4>
                      {questionData.palabrasCompletar.map((palabra, index) => (
                        <div key={index} className="mb-2">
                          <input
                            type="text"
                            value={palabra}
                            onChange={(e) => handlePalabraCompletarChange(index, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-[14px]"
                            placeholder={`Palabra ${index + 1}`}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center">
                      <h4 className="text-[14px] font-medium mb-2">Opciones de Relleno</h4>
                      <button
                        type="button"
                        onClick={addOpcionRelleno}
                        className="flex items-center text-[14px] text-blue-600 hover:text-blue-800"
                        disabled={isSubmitting}
                      >
                        <FiPlus className="mr-1" /> Agregar opción
                      </button>
                    </div>
                    {questionData.opcionesRelleno.map((opcion, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <input
                          type="text"
                          value={opcion}
                          onChange={(e) => handleOpcionRellenoChange(index, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-md text-[14px]"
                          placeholder={`Opción de relleno ${index + 1}`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => removeOpcionRelleno(index)}
                          className="ml-2 p-1 text-red-500 hover:text-red-700"
                          disabled={questionData.opcionesRelleno.length <= 1 || isSubmitting}
                        >
                          <Trash className="h-4 w-6 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full py-2 bg-[#46ae69] text-white rounded-md hover:bg-green-600 transition-colors text-[14px]"
                    disabled={isSubmitting}
                  >
                    {editingQuestionIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"}
                  </button>

                  {validationError && <p className="mt-2 text-red-500 text-[14px]">{validationError}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-2 bg-[#f44144] text-white rounded-md text-[14px] hover:bg-red-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-8 py-2 ${
                isSaveDisabled || isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#46ae69] hover:bg-green-600"
              } text-white rounded-md text-[14px] transition-colors flex items-center justify-center`}
              disabled={isSaveDisabled || isSubmitting}
              title={
                isSubmitting
                  ? "Procesando evaluación..."
                  : currentQuestionType !== null
                    ? "Debe guardar o cancelar la pregunta actual para poder guardar la evaluación."
                    : !isPuntajeValid() && formData.preguntas.length > 0
                      ? "El puntaje total debe ser 100 para poder guardar."
                      : fieldErrors.nombre
                        ? "Debe corregir los errores de validación antes de guardar."
                        : isValidatingName
                          ? "Validando nombre..."
                          : "Guardar Evaluación"
              }
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {evaluation ? "Guardando..." : "Creando..."}
                </>
              ) : evaluation ? (
                "Guardar Cambios"
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isInUseModalOpen}
        onClose={() => setIsInUseModalOpen(false)}
        onConfirm={() => setIsInUseModalOpen(false)}
        title="Acción no permitida"
        message="No se puede desactivar esta evaluación pues se encuentra asociada a una programación."
        confirmText="Cerrar"
        confirmColor="bg-[#f44144] hover:bg-red-600"
        showButtonCancel={false}
      />
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#46ae69] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#1f384c] mb-2">
              {evaluation && evaluation.id ? "Actualizando evaluación..." : "Creando evaluación..."}
            </h3>
            <p className="text-gray-600 text-sm">
              Por favor espere mientras procesamos los archivos y guardamos la información.
            </p>
            <div className="mt-4 text-xs text-gray-500">Este proceso puede tomar unos momentos</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EvaluationForm
