"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../features/auth/hooks/useAuth"
import { BookOpen, Trophy, Clock, TrendingUp, Target, Calendar } from "lucide-react"

const ApprenticeDashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos del dashboard
    setTimeout(() => {
      setDashboardData({
        currentCourses: 3,
        completedLessons: 24,
        totalPoints: 1250,
        currentStreak: 7,
        nextClass: "Mañana 10:00 AM",
        recentAchievements: [
          { id: 1, title: "Primera Semana", icon: "🎯", date: "Hace 2 días" },
          { id: 2, title: "Racha de 5 días", icon: "🔥", date: "Hace 3 días" },
        ],
        upcomingTasks: [
          { id: 1, title: "Completar ejercicios de Present Simple", due: "Hoy" },
          { id: 2, title: "Revisar vocabulario Unit 3", due: "Mañana" },
          { id: 3, title: "Práctica de pronunciación", due: "Viernes" },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header de Bienvenida */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">¡Hola, {user?.name || "Estudiante"}! 👋</h1>
          <p className="text-gray-600 text-lg">Continúa tu aprendizaje donde lo dejaste</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.currentCourses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lecciones Completadas</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.completedLessons}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                <p className="text-3xl font-bold text-yellow-600">{dashboardData.totalPoints}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardData.currentStreak} días</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próxima Clase */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Próxima Clase
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800">Inglés Intermedio</h3>
              <p className="text-gray-600 text-sm">Present Perfect Tense</p>
              <div className="flex items-center mt-3 text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">{dashboardData.nextClass}</span>
              </div>
            </div>
          </div>

          {/* Logros Recientes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Logros Recientes
            </h2>
            <div className="space-y-3">
              {dashboardData.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tareas Pendientes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Tareas Pendientes
            </h2>
            <div className="space-y-3">
              {dashboardData.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">{task.title}</h3>
                    <p className="text-xs text-gray-600">Vence: {task.due}</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">Ir</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progreso Semanal */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tu Progreso Esta Semana</h2>
          <div className="grid grid-cols-7 gap-2">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{day}</p>
                <div className={`w-8 h-8 rounded-full mx-auto ${index < 5 ? "bg-green-500" : "bg-gray-200"}`}></div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¡Llevas 5 días consecutivos! 🔥 Sigue así para mantener tu racha.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApprenticeDashboard
