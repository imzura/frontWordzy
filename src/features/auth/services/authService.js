// Servicio de autenticación actualizado para usar la API local
const API_BASE_URL = "http://localhost:3000/api/user"

// Función para determinar el rol basado en el documento
const determineUserRole = (document) => {
  // Usuarios de prueba específicos
  const roleMapping = {
    32143550: "administrador",
    1000660906: "instructor",
    28488747: "aprendiz",
  }

  return roleMapping[document] || "aprendiz" // Por defecto aprendiz
}

// Función para buscar estudiante por documento en la API local
const findStudentByDocument = async (document) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Error al consultar la API de estudiantes")
    }

    const students = await response.json()

    // Convertir el documento a string para asegurar comparación correcta
    const documentStr = document.toString()

    // Buscar si existe el documento
    const studentWithDocument = students.find((s) => s.documento.toString() === documentStr)

    return studentWithDocument || null
  } catch (error) {
    console.error("Error buscando estudiante:", error)
    throw error
  }
}

export const loginUser = async (credentials) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Basic validation
  if (!credentials.document || !credentials.password) {
    throw new Error("Todos los campos son requeridos")
  }

  // Validar que el documento solo contenga números
  if (!/^\d+$/.test(credentials.document)) {
    throw new Error("El documento debe contener solo números")
  }

  // Determinar el rol del usuario
  const userRole = determineUserRole(credentials.document)

  try {
    // Para usuarios de prueba que no están en la API, crear datos mock
    if (["32143550", "1000660906"].includes(credentials.document)) {
      const mockUsers = {
        32143550: {
          _id: "admin_001",
          nombre: "Juan Carlos",
          apellido: "Administrador",
          documento: "32143550",
          tipoDocumento: "CC",
          correo: "admin@wordzy.com",
          telefono: "3001234567",
          estado: "Activo",
          ficha: ["2024001"],
          nivel: "Avanzado",
          programa: "Administración del Sistema",
          progresoActual: 100,
          progresoNiveles: { basico: 100, intermedio: 100, avanzado: 100 },
          puntos: 1000,
          tipoUsuario: "administrador",
          contraseña: "32143550",
        },
        1000660906: {
          _id: "instructor_001",
          nombre: "María Elena",
          apellido: "Instructor",
          documento: "1000660906",
          tipoDocumento: "CC",
          correo: "instructor@wordzy.com",
          telefono: "3007654321",
          estado: "Activo",
          ficha: ["2024002"],
          nivel: "Avanzado",
          programa: "Enseñanza de Inglés",
          progresoActual: 95,
          progresoNiveles: { basico: 100, intermedio: 100, avanzado: 95 },
          puntos: 800,
          tipoUsuario: "instructor",
          contraseña: "1000660906",
        },
      }

      const mockUser = mockUsers[credentials.document]
      if (mockUser && mockUser.contraseña === credentials.password) {
        return {
          id: mockUser._id,
          name: `${mockUser.nombre} ${mockUser.apellido}`,
          document: mockUser.documento,
          documentType: mockUser.tipoDocumento,
          email: mockUser.correo,
          phone: mockUser.telefono,
          state: mockUser.estado,
          courseNumber: mockUser.ficha[0],
          level: mockUser.nivel,
          program: mockUser.programa,
          currentProgress: mockUser.progresoActual,
          levelProgress: mockUser.progresoNiveles,
          points: mockUser.puntos,
          role: userRole,
          userType: mockUser.tipoUsuario,
        }
      }
    }

    // Buscar el estudiante en la API local
    const student = await findStudentByDocument(credentials.document)

    if (!student) {
      throw new Error("Número de documento no encontrado en el sistema")
    }

    // Verificar que el estudiante esté en formación (solo para aprendices)
    if (userRole === "aprendiz" && student.estado !== "En formación") {
      throw new Error(`No puede acceder. Estado actual: ${student.estado}`)
    }

    // Verificar que la contraseña coincida
    if (student.contraseña !== credentials.password) {
      throw new Error("Contraseña incorrecta")
    }

    // Login exitoso - mapear los campos de la nueva API
    return {
      id: student._id,
      name: `${student.nombre} ${student.apellido}`,
      document: student.documento,
      documentType: student.tipoDocumento,
      email: student.correo,
      phone: student.telefono,
      state: student.estado,
      courseNumber: student.ficha[0],
      level: student.nivel,
      program: student.programa,
      currentProgress: student.progresoActual,
      levelProgress: student.progresoNiveles,
      points: student.puntos,
      role: userRole,
      userType: student.tipoUsuario || userRole,
    }
  } catch (error) {
    // Si es un error de red o API, mostrar mensaje genérico
    if (error.message.includes("API") || error.message.includes("fetch")) {
      throw new Error("Error de conexión. Intente nuevamente")
    }
    throw error
  }
}

export const registerUser = async (userData) => {
  // Simulamos un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Validación básica
  if (!userData.email || !userData.password || !userData.name) {
    throw new Error("Todos los campos son requeridos")
  }

  // Simulación de registro exitoso
  return {
    id: Math.floor(Math.random() * 1000).toString(),
    name: userData.name,
    email: userData.email,
  }
}
