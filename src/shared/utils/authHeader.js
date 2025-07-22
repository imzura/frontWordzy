import { renewTokenAutomatically } from "../../features/auth/services/authService"

// Función helper para obtener el token
export const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("wordzy_user") || "{}")
    return user.token || null
  } catch (error) {
    console.error("Error obteniendo token:", error)
    return null
  }
}

// Función helper para crear headers autenticados
export const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Variable para evitar múltiples renovaciones simultáneas
let isRenewing = false
let renewalPromise = null

// Función helper para hacer peticiones con renovación automática transparente
export const fetchWithAutoRenew = async (url, options = {}) => {
  // Función interna para hacer fetch sin mostrar errores 409 en consola
  const silentFetch = async (url, options) => {
    // Interceptar console.error temporalmente para suprimir errores 409
    const originalError = console.error
    let response

    try {
      // Suprimir errores de red relacionados con 409
      console.error = (...args) => {
        const message = args.join(" ")
        // No mostrar errores 409 en la consola
        if (!message.includes("409") && !message.includes("Conflict")) {
          originalError.apply(console, args)
        }
      }

      response = await fetch(url, options)
    } finally {
      // Restaurar console.error original
      console.error = originalError
    }

    return response
  }

  // Primera petición (silenciosa si es 409)
  let response = await silentFetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  // Si el token expiró, renovarlo automáticamente
  if (response.status === 401 || response.status === 409) {
    try {
      // Evitar múltiples renovaciones simultáneas
      if (isRenewing) {
        await renewalPromise
      } else {
        isRenewing = true
        renewalPromise = renewTokenAutomatically()
        await renewalPromise
        isRenewing = false
      }

      // Reintentar la petición con el nuevo token (también silenciosa)
      response = await silentFetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      })
    } catch (error) {
      isRenewing = false
      throw error
    }
  }

  return response
}


