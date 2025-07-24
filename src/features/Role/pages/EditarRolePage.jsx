"use client"

import { useState, useEffect } from "react"
import { Shield, Check, Loader2, Calendar } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationModal from "../../../shared/components/ConfirmationModal"
import { useGetRoles } from "../hooks/useGetRoles"
import { useGetRolePermissions } from "../hooks/useGetRolePermissions"
import { useAssignPermission } from "../hooks/useAssignPermission"
import { useRevokePermission } from "../hooks/useRevokePermission"
import { useGetModules } from "../hooks/useGetModules"
import { useGetPrivileges } from "../hooks/useGetPrivileges"
import UserMenu from "../../../shared/components/userMenu"
import { formatDate } from "../../../shared/utils/dateFormatter"

const EditarRolePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { roles } = useGetRoles()
  const {
    permissions: rolePermissions,
    loading: permissionsLoading,
    refetch: refetchPermissions,
  } = useGetRolePermissions(id)
  const { modules, loading: modulesLoading } = useGetModules()
  const { privileges, loading: privilegesLoading } = useGetPrivileges()
  const { assignPermission, loading: assignLoading } = useAssignPermission()
  const { revokePermission, loading: revokeLoading } = useRevokePermission()

  const [rol, setRol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [permissionsMatrix, setPermissionsMatrix] = useState({})

  // Mapeo de privilegios en inglés a español (sin upload)
  const privilegeTranslations = {
    create: "Crear",
    read: "Ver",
    update: "Actualizar",
    delete: "Eliminar",
    submit: "Enviar",
    export: "Exportar",
    assign: "Asignar",
  }

  // Definir qué privilegios aplican para cada módulo según las acciones reales (sin upload)
  const modulePrivileges = {
    // Solo vista
    Dashboard: ["read"],
    Ranking: ["read"],
    Retroalimentacion: ["read"],

    // Ver detalle y actualización masiva
    Programas: ["read", "update"],
    Fichas: ["read", "update"],
    Aprendices: ["read", "update"],

    // CRUD completo
    Instructores: ["create", "read", "update", "delete"],
    Temas: ["create", "read", "update", "delete"],
    "Programacion De Cursos": ["create", "read", "update", "delete"],

    // CRUD (sin upload - implícito en create/update)
    "Material De Apoyo": ["create", "read", "update", "delete"],
    Evaluaciones: ["create", "read", "update", "delete", "submit"],
    Insignias: ["create", "read", "update", "delete"],

    // Acciones específicas
    "Asignación de Niveles": ["read", "assign"], // Buscar ficha y activar/desactivar niveles
    "Cursos Programados": ["read", "export"], // Vista, detalle, exportar excel
    Roles: ["read", "update"], // Editar y ver detalle
    Usuarios: ["create", "read", "update", "delete"],
    "Progreso Aprendices": ["read"],
  }

  // Buscar el rol a editar
  useEffect(() => {
    const foundRol = roles.find((r) => r._id === id || r.id === Number.parseInt(id))
    if (foundRol) {
      setRol(foundRol)
    } else if (roles.length > 0) {
      navigate("/configuracion/roles")
    }
    setLoading(false)
  }, [id, roles, navigate])

  // Construir matriz de permisos solo con privilegios aplicables
  useEffect(() => {
    if (modules.length > 0 && privileges.length > 0 && rolePermissions.length >= 0) {
      const matrix = {}

      // Inicializar matriz solo con privilegios aplicables por módulo
      modules.forEach((module) => {
        const applicablePrivileges = modulePrivileges[module.name] || []
        if (applicablePrivileges.length > 0) {
          matrix[module._id] = {
            moduleName: module.name,
            privileges: {},
          }

          // Solo agregar privilegios que aplican para este módulo
          privileges.forEach((privilege) => {
            if (applicablePrivileges.includes(privilege.name)) {
              matrix[module._id].privileges[privilege._id] = {
                privilegeName: privilege.name,
                hasPermission: false,
              }
            }
          })
        }
      })

      // Marcar los permisos que el rol tiene activos
      rolePermissions.forEach((permission) => {
        const moduleId = permission.moduleId?._id || permission.moduleId
        const privilegeId = permission.privilegeId?._id || permission.privilegeId

        if (matrix[moduleId] && matrix[moduleId].privileges[privilegeId]) {
          matrix[moduleId].privileges[privilegeId].hasPermission = true
        }
      })

      setPermissionsMatrix(matrix)
    }
  }, [modules, privileges, rolePermissions])

  const handlePermissionToggle = async (moduleId, privilegeId, currentValue) => {
    try {
      if (currentValue) {
        await revokePermission({
          roleId: id,
          moduleId,
          privilegeId,
        })
      } else {
        await assignPermission({
          roleId: id,
          moduleId,
          privilegeId,
        })
      }

      await refetchPermissions()
      setSuccessMessage(`Permiso ${currentValue ? "revocado" : "asignado"} exitosamente`)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error al modificar permiso:", error)
      setSuccessMessage("Error al modificar el permiso: " + error.message)
      setShowSuccessModal(true)
    }
  }

  const handleCancel = () => {
    navigate("/configuracion/roles")
  }

  if (loading || modulesLoading || privilegesLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    )
  }

  if (!rol) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Rol no encontrado</p>
      </div>
    )
  }

  // Obtener privilegios únicos que se muestran en la tabla
  const displayedPrivileges = privileges.filter((privilege) =>
    Object.values(modulePrivileges).some((modulePrivs) => modulePrivs.includes(privilege.name)),
  )

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Roles</h1>
          <UserMenu />
        </div>
      </header>

      <div className="max-w-10xl mx-auto p-7 bg-white rounded-lg shadow">
        <div className="">
          {/* Información del rol con diseño mejorado */}
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-blue-500 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#1f384c] mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Información del Rol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-600 text-sm block mb-1">Nombre:</span>
                <p className="text-gray-900 text-sm font-semibold">{rol.name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-600 text-sm block mb-1">Descripción:</span>
                <p className="text-gray-900 text-sm">{rol.description || "Sin descripción"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-600 text-sm block mb-1">Estado:</span>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    rol.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {rol.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="font-medium text-gray-600 text-sm block mb-1">Fecha de creación:</span>
                <div className="flex items-center gap-1 text-sm text-gray-900">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(rol.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Matriz de permisos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1f384c] mb-4">Permisos del Rol</h3>
            <div className="flex-1 overflow-auto border border-gray-200 rounded-lg shadow">
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-[#1F384C] text-white">
                    <th className="px-4 py-3 text-left font-medium text-sm">Módulo</th>
                    {displayedPrivileges.map((privilege) => (
                      <th key={privilege._id} className="px-4 py-3 text-center font-medium text-sm">
                        {privilegeTranslations[privilege.name] || privilege.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissionsMatrix).map(([moduleId, moduleData]) => (
                    <tr key={moduleId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 text-sm">{moduleData.moduleName}</td>
                      {displayedPrivileges.map((privilege) => {
                        const privilegeData = moduleData.privileges[privilege._id]
                        const isApplicable = modulePrivileges[moduleData.moduleName]?.includes(privilege.name)

                        return (
                          <td key={privilege._id} className="px-4 py-3 text-center">
                            {isApplicable ? (
                              <label className="inline-flex items-center justify-center cursor-pointer mx-auto">
                                <input
                                  type="checkbox"
                                  checked={privilegeData?.hasPermission || false}
                                  onChange={() =>
                                    handlePermissionToggle(moduleId, privilege._id, privilegeData?.hasPermission)
                                  }
                                  disabled={assignLoading || revokeLoading}
                                  className="hidden"
                                />
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                    privilegeData?.hasPermission
                                      ? "bg-[#1F384C] border-[#1F384C]"
                                      : "bg-white border-gray-300 hover:border-blue-400"
                                  } ${assignLoading || revokeLoading ? "opacity-50" : ""}`}
                                >
                                  {privilegeData?.hasPermission && <Check className="w-2.5 h-2.5 text-white" />}
                                  {(assignLoading || revokeLoading) && (
                                    <Loader2 className="w-2.5 h-2.5 text-gray-400 animate-spin" />
                                  )}
                                </div>
                              </label>
                            ) : (
                              <div className="w-4 h-4 flex items-center justify-center mx-auto">
                                <span className="text-gray-400 text-xs">N/A</span>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="max-w-3xl mx-auto mt-2 flex justify-center">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        title={successMessage.includes("exitosamente") ? "Operación Exitosa" : "Error"}
        message={successMessage}
        confirmText="Aceptar"
        confirmColor={
          successMessage.includes("exitosamente") ? "bg-green-500 hover:bg-green-600" : "bg-[#f44144] hover:bg-red-600"
        }
        showButtonCancel={false}
      />
    </div>
  )
}

export default EditarRolePage
