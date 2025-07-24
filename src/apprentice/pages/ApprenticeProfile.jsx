"use client"

import { useState } from "react"
import { useAuth } from "../../features/auth/hooks/useAuth"
import { User, Calendar, Award, BookOpen, Edit3, Save, X, Target, Trophy, Clock, Star, Lock, Presentation } from "lucide-react"

const ApprenticeProfile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "Estudiante",
    email: user?.email || "Sin teléono",
    document: user?.document || "Sin documento",
    phone: user?.phone || "Sin número",
    program: user?.program || "",
    courseNumber: user?.courseNumber || "",
    points: user?.points || "0",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Mostrar mensaje de éxito
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-[#1f384c]/10 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] shadow-lg rounded-xl mb-8">
          <div className="max-w-6xl mx-auto px-4 py-5">
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Mi Perfil</h1>
              <p className="text-base text-blue-100 mt-1">Gestiona tu información personal y preferencias</p>
            </div>
          </div>
        </div>

        {/* Perfil Principal */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 p-4 border-b border-[#1f384c]/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1f384c] flex items-center">
                <User className="mr-2" size={20} />
                Información Personal
              </h2>
              {/* {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] text-white rounded-lg hover:from-[#152a38] hover:to-[#1f384c] transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )} */}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f384c]">{profileData.name}</h3>
                <p className="text-gray-600 flex items-center text-sm">
                  Ficha
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-2 py-0.5 rounded-full text-xs font-medium ml-2">
                    {profileData.courseNumber}
                  </span>
                </p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Presentation className="mr-1" size={14} />
                  Programa: {profileData.program}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#1f384c]/20 rounded-lg focus:ring-2 focus:ring-[#1f384c] focus:border-transparent bg-white"
                    />
                  ) : (
                    <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-[#1f384c]/20 rounded-lg focus:ring-2 focus:ring-[#1f384c] focus:border-transparent bg-white"
                    />
                  ) : (
                    <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                  <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.document}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-[#1f384c]/20 rounded-lg focus:ring-2 focus:ring-[#1f384c] focus:border-transparent bg-white"
                    />
                  ) : (
                    <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.program}
                      onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
                      className="w-full px-3 py-2 border border-[#1f384c]/20 rounded-lg focus:ring-2 focus:ring-[#1f384c] focus:border-transparent bg-white"
                    />
                  ) : (
                    <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.program}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Puntos</label>
                  <p className="text-[#1f384c] bg-[#1f384c]/5 px-3 py-2 rounded-lg">{profileData.points}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de Progreso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1f384c]/10 to-[#2d4a5c]/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-[#1f384c] to-[#2d4a5c] p-2 rounded-lg">
                <BookOpen className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Cursos Completados</h3>
                <p className="text-lg font-bold text-[#1f384c]">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-2 rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Días de Estudio</h3>
                <p className="text-lg font-bold text-emerald-600">45</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-center relative z-10">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg">
                <Trophy className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-800">Logros</h3>
                <p className="text-lg font-bold text-amber-600">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos niveles */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1f384c]/5 to-[#2d4a5c]/5 p-4 border-b border-[#1f384c]/20">
            <h2 className="text-lg font-bold text-[#1f384c] flex items-center">
              <Target className="mr-2" size={20} />
              Tu camino de aprendizaje
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#1f384c] flex items-center">
                <Lock className="mr-1" size={16} />
                Próximos niveles
              </h4>

              {[
                { level: 2, title: "Conjugations", description: "Domina las conjugaciones verbales" },
                { level: 3, title: "Writing", description: "Desarrolla tus habilidades de escritura" },
                { level: 4, title: "Listening", description: "Mejora tu comprensión auditiva" },
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
    </div>
  )
}

export default ApprenticeProfile