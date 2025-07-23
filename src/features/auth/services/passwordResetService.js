const API_BASE_URL = "http://localhost:3000/api"

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo: email }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Error al solicitar recuperación")
    }

    return result
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Verifique que el servidor esté funcionando")
    }
    throw error
  }
}

export const verifyResetCode = async (email, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        codigo: code,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Error al verificar código")
    }

    return result
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Verifique que el servidor esté funcionando")
    }
    throw error
  }
}

export const resetPassword = async (email, code, newPassword, confirmPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: email,
        codigo: code,
        nuevaContraseña: newPassword,
        confirmarContraseña: confirmPassword,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || "Error al cambiar contraseña")
    }

    return result
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Error de conexión. Verifique que el servidor esté funcionando")
    }
    throw error
  }
}
