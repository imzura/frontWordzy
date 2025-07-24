"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../features/auth/hooks/useAuth"
import logo from "../../assets/logo.png"
import { TrendingUp, MessageSquare, User, LogOut, Home } from "lucide-react"

const ApprenticeNavbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      path: "/apprentice/dashboard",
      color: "text-blue-400",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Mi Ranking",
      path: "/apprentice/ranking",
      color: "text-emerald-400",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Retroalimentación",
      path: "/apprentice/feedback",
      color: "text-purple-400",
    },
    {
      icon: <User size={20} />,
      label: "Mi Perfil",
      path: "/apprentice/profile",
      color: "text-indigo-400",
    },
  ]

  const isActive = (path) => location.pathname === path

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#1f384c] via-[#2d4a5c] to-[#1f384c] text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#152a38] to-[#1f384c]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">WORDZY</h1>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 bg-gradient-to-r from-[#2d4a5c]/50 to-[#3b5c70]/30 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-9 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <User size={22} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-white">{user?.name || "Estudiante"}</p>
            <p className="text-blue-200 text-sm">Aprendiz</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 group ${
              isActive(item.path)
                ? "bg-gradient-to-r from-white to-blue-50 text-[#1f384c] shadow-lg transform scale-105"
                : "hover:bg-white/10 text-white hover:transform hover:scale-105"
            }`}
          >
            <span
              className={`transition-colors duration-300 ${
                isActive(item.path) ? item.color : "text-blue-200 group-hover:text-white"
              }`}
            >
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {isActive(item.path) && <div className="ml-auto w-2 h-2 bg-[#1f384c] rounded-full"></div>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-[#152a38] to-[#1f384c]">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:transform group-hover:scale-110 transition-transform duration-300" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-semibold text-[#1f384c] mb-4">¿Cerrar Sesión?</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres cerrar tu sesión?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApprenticeNavbar
