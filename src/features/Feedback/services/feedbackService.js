// Servicio para manejar las operaciones de retroalimentación
import { API_ENDPOINTS } from "../../../shared/config/api"

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text()
    try {
      const errorJson = JSON.parse(errorText)
      throw new Error(errorJson.message || `Error HTTP: ${response.status}`)
    } catch (e) {
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`)
    }
  }
  return response.json()
}

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Asumiendo que la API Key se gestiona en un interceptor o contexto superior.
        // Si no, habría que añadirla aquí.
      },
      signal: AbortSignal.timeout(15000), // 15 segundos de timeout
      ...options,
    })
    return await handleResponse(response)
  } catch (error) {
    console.error(`🚨 Error en la solicitud a ${url}:`, error.message)
    if (error.name === "TimeoutError") {
      throw new Error("La solicitud ha tardado demasiado y ha sido cancelada.")
    }
    if (error.message.includes("fetch")) {
      throw new Error("No se puede conectar con el servidor. Verifique que la API esté en ejecución.")
    }
    throw error
  }
}

const API_BASE_URL = "http://localhost:3000/api"

// Función para obtener todos los usuarios desde la API
const getAllUsers = async () => {
  console.log("🌐 Intentando conectar con:", `${API_BASE_URL}/user`)

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Agregar timeout
      signal: AbortSignal.timeout(10000), // 10 segundos timeout
    })

    console.log("📡 Respuesta de la API:", response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log("📦 Datos recibidos:", data?.length || 0, "usuarios")
    return data || []
  } catch (error) {
    console.error("🚨 Error en getAllUsers:", error.message)
    if (error.name === "TimeoutError") {
      throw new Error("Timeout: La API no responde")
    }
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("No se puede conectar con el servidor. Verifique que esté ejecutándose en http://localhost:3000")
    }
    throw error
  }
}

/**
 * Obtiene todos los instructores desde la API.
 * @returns {Promise<Array>} Lista de instructores.
 */
export const getInstructors = async () => {
  console.log("👨‍🏫 Obteniendo instructores...")
  const data = await fetchData(API_ENDPOINTS.INSTRUCTORS)
  console.log(`✅ Se encontraron ${data.length} instructores.`)
  return data
}

/**
 * Obtiene todas las programaciones de cursos desde la API.
 * @returns {Promise<Array>} Lista de programaciones de cursos.
 */
export const getCourseProgrammings = async () => {
  console.log("📚 Obteniendo programaciones de cursos...")
  const data = await fetchData(API_ENDPOINTS.COURSE_PROGRAMMING)
  console.log(`✅ Se encontraron ${data.length} programaciones.`)
  return data
}

/**
 * Obtiene todos los aprendices desde la API.
 * @returns {Promise<Array>} Lista de aprendices.
 */
export const getApprentices = async () => {
  console.log("👨‍🎓 Obteniendo todos los aprendices...")
  const data = await fetchData(API_ENDPOINTS.APPRENTICES)
  console.log(`✅ Se encontraron ${data.length} aprendices.`)
  return data
}

// === FUNCIONES LEGACY PARA COMPATIBILIDAD ===
// Estas funciones se mantienen para compatibilidad con código existente

// Función para obtener las fichas desde los usuarios aprendices
export const getFichasFromAPI = async () => {
  try {
    console.log("🎯 Obteniendo fichas de aprendices...")
    const users = await getAllUsers()

    if (!Array.isArray(users)) {
      console.warn("⚠️ Los datos de usuarios no son un array:", typeof users)
      throw new Error("Formato de datos inválido")
    }

    console.log("👥 Total de usuarios recibidos:", users.length)

    // Filtrar usuarios que sean aprendices
    const aprendices = users.filter((user) => {
      const esAprendiz = user && user.tipoUsuario === "aprendiz"
      if (esAprendiz) {
        console.log(
          "👨‍🎓 Aprendiz encontrado:",
          user.nombre,
          user.apellido,
          "- Ficha:",
          user.ficha,
          "- Programa:",
          user.programa,
        )
      }
      return esAprendiz
    })

    console.log("👨‍🎓 Total aprendices encontrados:", aprendices.length)

    // Extraer todas las fichas de los aprendices
    const todasLasFichas = []

    aprendices.forEach((aprendiz) => {
      // Manejar que ficha puede ser un array o un valor único
      if (Array.isArray(aprendiz.ficha)) {
        // Si es array, agregar todos los elementos
        aprendiz.ficha.forEach((ficha) => {
          if (ficha && ficha.toString().trim() !== "") {
            todasLasFichas.push(ficha.toString())
            console.log("📋 Ficha encontrada (array):", ficha, "para", aprendiz.nombre, aprendiz.apellido)
          }
        })
      } else if (aprendiz.ficha) {
        // Si es un valor único
        if (aprendiz.ficha.toString().trim() !== "") {
          todasLasFichas.push(aprendiz.ficha.toString())
          console.log("📋 Ficha encontrada (único):", aprendiz.ficha, "para", aprendiz.nombre, aprendiz.apellido)
        }
      }
    })

    console.log("📋 Todas las fichas extraídas:", todasLasFichas)

    // Obtener fichas únicas
    const fichasUnicas = [...new Set(todasLasFichas)]

    console.log("📋 Fichas únicas encontradas:", fichasUnicas)

    if (fichasUnicas.length === 0) {
      console.warn("⚠️ No se encontraron fichas válidas")
      throw new Error("No se encontraron fichas de aprendices")
    }

    // Crear el formato necesario para los selectores
    const fichas = fichasUnicas.map((ficha) => {
      // Buscar el programa asociado a esta ficha
      const aprendizConEstaFicha = aprendices.find((aprendiz) => {
        if (Array.isArray(aprendiz.ficha)) {
          return aprendiz.ficha.includes(Number.parseInt(ficha))
        }
        return aprendiz.ficha.toString() === ficha
      })

      return {
        value: ficha,
        label: `Ficha ${ficha}`,
        programa: aprendizConEstaFicha?.programa || "Programa SENA",
      }
    })

    // Ordenar por código de ficha
    const fichasOrdenadas = fichas.sort((a, b) => {
      const numA = Number.parseInt(a.value) || 0
      const numB = Number.parseInt(b.value) || 0
      return numA - numB
    })

    console.log("✅ Fichas finales ordenadas:", fichasOrdenadas)
    return fichasOrdenadas
  } catch (error) {
    console.error("❌ Error en getFichasFromAPI:", error.message)
    throw error
  }
}

// Función para obtener niveles basados en progresoNiveles de los usuarios APRENDICES
export const getNiveles = async () => {
  try {
    console.log("📊 Obteniendo niveles de aprendices...")
    const users = await getAllUsers()

    if (!Array.isArray(users)) {
      throw new Error("Formato de datos inválido")
    }

    console.log("👥 Total de usuarios recibidos:", users.length)

    // Filtrar usuarios que sean aprendices PRIMERO
    const aprendices = users.filter((user) => {
      const esAprendiz = user && user.tipoUsuario === "aprendiz"
      if (esAprendiz) {
        console.log(
          "👨‍🎓 Aprendiz para niveles:",
          user.nombre,
          user.apellido,
          "- Progreso:",
          user.progresoNiveles?.length || 0,
          "niveles",
        )
      }
      return esAprendiz
    })

    console.log("👨‍🎓 Total aprendices para extraer niveles:", aprendices.length)

    // Obtener todos los niveles de progreso únicos SOLO de aprendices
    const nivelesProgreso = new Set()

    aprendices.forEach((aprendiz) => {
      if (aprendiz.progresoNiveles && Array.isArray(aprendiz.progresoNiveles)) {
        aprendiz.progresoNiveles.forEach((progreso) => {
          if (progreso && progreso.nivel) {
            nivelesProgreso.add(progreso.nivel.toString())
            console.log("📈 Nivel encontrado:", progreso.nivel, "para aprendiz:", aprendiz.nombre, aprendiz.apellido)
          }
        })
      }
    })

    // Convertir a array y ordenar
    const nivelesArray = Array.from(nivelesProgreso).sort((a, b) => {
      const numA = Number.parseInt(a)
      const numB = Number.parseInt(b)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })

    console.log("📈 Niveles únicos encontrados en aprendices:", nivelesArray)

    // Si no hay niveles en los aprendices, usar los niveles fijos 1, 2, 3
    const niveles = nivelesArray.length > 0 ? nivelesArray : ["1", "2", "3"]
    console.log("✅ Niveles finales para filtro:", niveles)
    return niveles
  } catch (error) {
    console.error("❌ Error en getNiveles:", error.message)
    throw error
  }
}

// Función para buscar datos de retroalimentación basado en filtros
export const searchFeedbackData = async (filters) => {
  try {
    console.log("🔍 Buscando datos de retroalimentación con filtros:", filters)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Obtener datos reales de aprendices para generar datos más realistas
    const users = await getAllUsers()
    const aprendices = users.filter((user) => user && user.tipoUsuario === "aprendiz")

    // Generar datos mock basados en los datos reales de aprendices
    const mockData = []
    let id = 1

    // Crear algunas actividades de ejemplo para cada ficha encontrada
    const fichasReales = new Set()
    aprendices.forEach((aprendiz) => {
      if (Array.isArray(aprendiz.ficha)) {
        aprendiz.ficha.forEach((ficha) => fichasReales.add(ficha.toString()))
      } else if (aprendiz.ficha) {
        fichasReales.add(aprendiz.ficha.toString())
      }
    })

    const temas = [
      "Present Simple",
      "Past Tense",
      "Future Tense",
      "Vocabulary Building",
      "Technical English",
      "Grammar Basics",
    ]
    const actividades = [
      "Grammar Exercise",
      "Vocabulary Test",
      "Reading Comprehension",
      "Listening Practice",
      "Speaking Activity",
    ]
    const instructoresEjemplo = ["Ana García", "Carlos Rodríguez", "María López", "Juan Martínez"]

    Array.from(fichasReales).forEach((ficha) => {
      const aprendizDeFicha = aprendices.find((a) =>
        Array.isArray(a.ficha) ? a.ficha.includes(Number.parseInt(ficha)) : a.ficha.toString() === ficha,
      )

      // Crear 2-3 actividades por ficha
      for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        const nivel = Math.floor(Math.random() * 3) + 1
        const tema = temas[Math.floor(Math.random() * temas.length)]
        const actividad = actividades[Math.floor(Math.random() * actividades.length)]
        const instructor = instructoresEjemplo[Math.floor(Math.random() * instructoresEjemplo.length)]

        mockData.push({
          id: id++,
          programa: aprendizDeFicha?.programa || "Programa SENA",
          ficha: ficha,
          nivel: nivel.toString(),
          tema: tema,
          actividad: `${actividad} ${i + 1}`,
          ejecutada: Math.random() > 0.3 ? "Sí" : "No",
          instructor: instructor,
          fecha: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
            .toISOString()
            .split("T")[0],
          totalPreguntas: Math.floor(Math.random() * 20) + 10,
          aprendicesPresentes: Math.floor(Math.random() * 15) + 15,
        })
      }
    })

    // Filtrar datos basado en los filtros aplicados
    let filteredData = mockData

    if (filters.ficha) {
      filteredData = filteredData.filter((item) => item.ficha === filters.ficha)
    }

    if (filters.nivel) {
      filteredData = filteredData.filter((item) => item.nivel === filters.nivel)
    }

    if (filters.instructor) {
      filteredData = filteredData.filter((item) => item.instructor === filters.instructor)
    }

    console.log("📊 Datos filtrados:", filteredData.length, "resultados")
    return filteredData
  } catch (error) {
    console.error("❌ Error al buscar datos de retroalimentación:", error)
    throw new Error("Error al obtener los datos de retroalimentación")
  }
}

// Función para obtener detalles específicos de una retroalimentación por ID
export const getFeedbackDetails = async (feedbackId) => {
  try {
    console.log("📋 Obteniendo detalles de retroalimentación para ID:", feedbackId)

    // Obtener datos reales de aprendices
    const users = await getAllUsers()
    const aprendices = users.filter((user) => user && user.tipoUsuario === "aprendiz")
    const instructores = users.filter((user) => user && user.tipoUsuario === "instructor")

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generar datos basados en el ID
    const fichasDisponibles = []
    aprendices.forEach((aprendiz) => {
      if (Array.isArray(aprendiz.ficha)) {
        aprendiz.ficha.forEach((ficha) => {
          fichasDisponibles.push({
            ficha: ficha.toString(),
            programa: aprendiz.programa,
            aprendices: aprendices.filter((a) =>
              Array.isArray(a.ficha) ? a.ficha.includes(ficha) : a.ficha === ficha,
            ),
          })
        })
      } else if (aprendiz.ficha) {
        fichasDisponibles.push({
          ficha: aprendiz.ficha.toString(),
          programa: aprendiz.programa,
          aprendices: aprendices.filter((a) =>
            Array.isArray(a.ficha) ? a.ficha.includes(aprendiz.ficha) : a.ficha === aprendiz.ficha,
          ),
        })
      }
    })

    // Seleccionar una ficha basada en el ID
    const fichaIndex = (feedbackId - 1) % fichasDisponibles.length
    const fichaSeleccionada = fichasDisponibles[fichaIndex]

    if (!fichaSeleccionada) {
      throw new Error("No se encontraron datos para esta retroalimentación")
    }

    const temas = ["Present Simple", "Past Tense", "Future Tense", "Vocabulary Building", "Technical English"]
    const actividades = ["Grammar Exercise", "Vocabulary Test", "Reading Comprehension", "Listening Practice"]

    const instructorSeleccionado = instructores[feedbackId % instructores.length] || {
      nombre: "Ana",
      apellido: "García",
    }

    // Crear los detalles de la retroalimentación
    const feedbackDetails = {
      id: feedbackId,
      programa: fichaSeleccionada.programa,
      ficha: fichaSeleccionada.ficha,
      nivel: (((feedbackId - 1) % 3) + 1).toString(),
      tema: temas[(feedbackId - 1) % temas.length],
      actividad: `${actividades[(feedbackId - 1) % actividades.length]} ${feedbackId}`,
      ejecutada: feedbackId % 4 !== 0 ? "Sí" : "No", // 75% ejecutadas
      instructor: `${instructorSeleccionado.nombre} ${instructorSeleccionado.apellido}`,
      fecha: new Date(2024, (feedbackId - 1) % 12, (feedbackId % 28) + 1).toISOString().split("T")[0],
      totalPreguntas: 15 + (feedbackId % 15),
      aprendicesPresentes: fichaSeleccionada.aprendices.length,
      aprendicesInscritos: fichaSeleccionada.aprendices.length + Math.floor(Math.random() * 5),
    }

    console.log("✅ Detalles de retroalimentación generados:", feedbackDetails)
    return feedbackDetails
  } catch (error) {
    console.error("❌ Error al obtener detalles de retroalimentación:", error)
    throw new Error("Error al cargar los detalles de la retroalimentación")
  }
}

// Función para obtener detalles de estudiantes para una actividad específica
export const getStudentDetails = async (feedbackId) => {
  try {
    console.log("👥 Obteniendo detalles de estudiantes para feedback ID:", feedbackId)

    // Obtener datos reales de aprendices
    const users = await getAllUsers()
    const aprendices = users.filter((user) => user && user.tipoUsuario === "aprendiz")

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Obtener los detalles de la retroalimentación para saber qué ficha usar
    const feedbackDetails = await getFeedbackDetails(feedbackId)

    // Filtrar aprendices de la ficha específica
    const aprendicesDeLaFicha = aprendices.filter((aprendiz) => {
      if (Array.isArray(aprendiz.ficha)) {
        return aprendiz.ficha.includes(Number.parseInt(feedbackDetails.ficha))
      }
      return aprendiz.ficha?.toString() === feedbackDetails.ficha
    })

    console.log(`👨‍🎓 Aprendices encontrados para ficha ${feedbackDetails.ficha}:`, aprendicesDeLaFicha.length)

    const horas = ["08:00", "10:00", "14:00", "16:00"]

    const students = aprendicesDeLaFicha.map((aprendiz, index) => {
      const isPresent = Math.random() > 0.15 // 85% probabilidad de estar presente
      const calificacion = isPresent
        ? (Math.random() * 2 + 3).toFixed(1) // Entre 3.0 y 5.0 si está presente
        : "0.0" // 0.0 si está ausente

      // Obtener la primera ficha del aprendiz
      const fichaAprendiz = Array.isArray(aprendiz.ficha) ? aprendiz.ficha[0] : aprendiz.ficha

      return {
        id: index + 1,
        aprendiz: `${aprendiz.nombre} ${aprendiz.apellido}`,
        ficha: fichaAprendiz?.toString() || "Sin ficha",
        documento: aprendiz.documento || "Sin documento",
        programa: aprendiz.programa || "Sin programa",
        estado: aprendiz.estado || "Activo",
        hora: horas[Math.floor(Math.random() * horas.length)],
        estado: isPresent ? "Presente" : "Ausente",
        calificacion: calificacion,
        preguntasFalladas: isPresent ? Math.floor(Math.random() * 5) : 0,
        observaciones: isPresent ? "Participación activa" : "No asistió a clase",
        progresoActual: aprendiz.progresoActual || 0,
        puntos: aprendiz.puntos || 0,
      }
    })

    const studentsOrdenados = students.sort((a, b) => a.aprendiz.localeCompare(b.aprendiz))
    console.log("✅ Estudiantes procesados:", studentsOrdenados.length)
    return studentsOrdenados
  } catch (error) {
    console.error("❌ Error al obtener detalles de estudiantes:", error)
    throw new Error("Error al cargar los detalles de los estudiantes")
  }
}

// Función para obtener preguntas falladas de un estudiante
export const getStudentFailedQuestions = async (studentId, feedbackId) => {
  try {
    console.log("❓ Obteniendo preguntas falladas para estudiante:", studentId)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    const questionTypes = ["Grammar", "Vocabulary", "Reading Comprehension", "Listening", "Speaking"]

    const questionTemplates = {
      Grammar: [
        "Choose the correct form of the verb 'to be'",
        "Complete the sentence with the correct tense",
        "Identify the grammatical error in the sentence",
        "Select the appropriate preposition",
      ],
      Vocabulary: [
        "What is the meaning of the word",
        "Choose the synonym for",
        "Complete the sentence with the correct word",
        "Match the word with its definition",
      ],
      "Reading Comprehension": [
        "According to the text, what is",
        "The main idea of the paragraph is",
        "Which statement is true based on the reading",
        "What can be inferred from the passage",
      ],
      Listening: [
        "What did the speaker say about",
        "The conversation takes place in",
        "How does the speaker feel about",
        "What is the speaker's opinion on",
      ],
      Speaking: [
        "Describe your daily routine using present simple",
        "Talk about your future plans",
        "Express your opinion about",
        "Compare and contrast two different topics",
      ],
    }

    // Generar entre 3-8 preguntas falladas
    const numQuestions = Math.floor(Math.random() * 6) + 3
    const failedQuestions = []

    for (let i = 0; i < numQuestions; i++) {
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      const templates = questionTemplates[type]
      const question = templates[Math.floor(Math.random() * templates.length)]

      failedQuestions.push({
        id: i + 1,
        numero: i + 1,
        tipo: type,
        pregunta: `${question} ${i + 1}?`,
        respuestaCorrecta: `Correct answer for question ${i + 1}`,
        respuestaEstudiante: `Student's incorrect answer ${i + 1}`,
        puntos: Math.floor(Math.random() * 3) + 1, // 1-3 puntos
        observacion: `Needs to review ${type.toLowerCase()} concepts`,
      })
    }

    return failedQuestions
  } catch (error) {
    console.error("❌ Error al obtener preguntas falladas:", error)
    throw new Error("Error al cargar las preguntas falladas")
  }
}
