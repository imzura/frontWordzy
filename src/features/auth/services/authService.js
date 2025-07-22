const API_BASE_URL = "http://localhost:3000/api"

export const loginUser = async (credentials) => {
  try {
    if (!credentials.document || !credentials.password) {
      throw new Error("Todos los campos son requeridos")
    }

    if (!/^\d+$/.test(credentials.document)) {
      throw new Error("El documento debe contener solo números")
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documento: credentials.document,
        contraseña: credentials.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Número de documento o contraseña incorrectos")
      } else if (response.status === 409) {
        throw new Error("Número de documento o contraseña incorrectos")
      } else if (response.status === 400) {
        throw new Error(result.message || "Datos inválidos")
      } else {
        throw new Error(result.message || "Error del servidor")
      }
    }

    const { data: userData, token } = result

    if (!token) {
      throw new Error("Error de autenticación: No se recibió token")
    }

    const roleMapping = {
      Administrador: "administrador",
      Instructor: "instructor",
      Aprendiz: "aprendiz",
    }

    const userRole = roleMapping[userData.role?.name] || userData.tipoUsuario

    const formattedUser = {
      id: userData._id,
      name: `${userData.nombre} ${userData.apellido || ""}`.trim(),
      document: userData.documento,
      documentType: userData.tipoDocumento,
      email: userData.correo,
      phone: userData.telefono,
      state: userData.estado,
      role: userRole,
      userType: userData.tipoUsuario,
      token: token,
      _credentials: btoa(
        JSON.stringify({
          document: credentials.document,
          password: credentials.password,
        }),
      ),
      ...(userData.tipoUsuario === "aprendiz" && {
        courseNumber: userData.ficha?.[0],
        program: userData.programa,
        currentProgress: userData.progresoActual || 0,
        points: userData.puntos || 0,
      }),
      ...(userData.tipoUsuario === "instructor" && {
        courses: userData.fichas || [],
      }),
    }

    return formattedUser
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Verifique que el servidor esté funcionando")
    }
    throw error
  }
}

export const renewTokenAutomatically = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("wordzy_user") || "{}")

    if (!user._credentials) {
      throw new Error("No hay credenciales guardadas para renovación automática")
    }

    const credentials = JSON.parse(atob(user._credentials))

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documento: credentials.document,
        contraseña: credentials.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error("No se pudo renovar el token")
    }

    const updatedUser = {
      ...user,
      token: result.token,
    }

    localStorage.setItem("wordzy_user", JSON.stringify(updatedUser))

    return result.token
  } catch (error) {
    localStorage.removeItem("wordzy_user")
    window.location.href = "/login"
    throw error
  }
}
