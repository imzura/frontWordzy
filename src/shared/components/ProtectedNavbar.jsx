"use client"

import { useState, useContext, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { usePermissions } from "../hooks/usePermissions"
import NavItem from "./NavItem"
import NavSubItem from "./NavSubItem"
import logo from "../../assets/logo.png"
import {
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Users,
  Settings,
  Award,
  TrendingUp,
  MessageSquare,
  CalendarCheck,
  BookOpenText,
  ShieldCheck,
  ClipboardCheck,
  ClipboardList,
  UserCog,
  Paperclip,
  TestTubes,
  Gauge,
  ListChecks,
} from "lucide-react"

const ProtectedNavbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 🎯 Función para verificar si una ruta está activa
  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  // 🎯 Función para verificar si una sección padre está activa
  const isSectionActive = (sectionPath) => {
    return location.pathname.startsWith(sectionPath)
  }

  const { user } = useContext(AuthContext)
  const { hasPermission, loading, isAdmin } = usePermissions()

  // 🎯 Determinar qué secciones deben estar abiertas basándose en la ruta actual
  const getInitialOpenSections = () => {
    const path = location.pathname
    return {
      formacion: path.startsWith("/formacion"),
      programacion: path.startsWith("/programacion"),
      progreso: path.startsWith("/progreso"),
      configuracion: path.startsWith("/configuracion"),
    }
  }

  const [openSections, setOpenSections] = useState(getInitialOpenSections())

  // 🎯 Función para verificar si una ruta está activa

  // 🎯 Función para verificar si una sección padre está activa

  // 🚀 Memoizar permisos para evitar recálculos constantes
  const permissions = useMemo(() => {
    if (loading) return {}

    return {
      // Dashboard
      dashboard: hasPermission("Dashboard", "read"),

      // Formación
      programas: hasPermission("Programas", "read"),
      fichas: hasPermission("Fichas", "read"),
      instructores: hasPermission("Instructores", "read"),
      aprendices: hasPermission("Aprendices", "read"),

      // Programación
      temas: hasPermission("Temas", "read"),
      materiales: hasPermission("Material De Apoyo", "read"),
      evaluaciones: hasPermission("Evaluaciones", "read"),
      programacionCursos: hasPermission("Programacion De Cursos", "read"),
      asignacionNiveles: hasPermission("Asignación de Niveles", "read"),
      insignias: hasPermission("Insignias", "read"),

      // Progreso
      cursosProgramados: hasPermission("Cursos Programados", "read"),
      ranking: hasPermission("Ranking", "read"),
      retroalimentacion: hasPermission("Retroalimentacion", "read"),

      // Configuración
      roles: hasPermission("Roles", "read"),
    }
  }, [hasPermission, loading])

  // 🚀 Memoizar visibilidad de secciones
  const sectionVisibility = useMemo(
    () => ({
      formacion: permissions.programas || permissions.fichas || permissions.instructores || permissions.aprendices,
      programacion:
        permissions.temas ||
        permissions.materiales ||
        permissions.evaluaciones ||
        permissions.programacionCursos ||
        permissions.asignacionNiveles ||
        permissions.insignias,
      progreso: permissions.cursosProgramados || permissions.ranking || permissions.retroalimentacion,
      configuracion: permissions.roles,
    }),
    [permissions],
  )

  const handleLogoClick = () => {
    navigate("/dashboard")
  }

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const newState = {
        formacion: false,
        programacion: false,
        progreso: false,
        configuracion: false,
      }
      newState[section] = !prev[section]
      return newState
    })
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Si no hay usuario, no mostrar navbar
  if (!user) return null

  // 🚀 Mostrar skeleton mientras carga
  if (loading) {
    return (
      <div className="h-screen w-56 bg-[#1f384c] text-white flex flex-col flex-shrink-0 shadow-lg">
        <div className="p-4 flex items-center shrink-0">
          <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold font-['Poppins']">WORDZY</h1>
        </div>

        <div className="mt-4 flex-1 p-4 space-y-3">
          {/* Skeleton items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#2a4a64] rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-56 bg-[#1f384c] text-white flex flex-col flex-shrink-0 shadow-lg">
      <div
        className="p-4 flex items-center shrink-0 cursor-pointer hover:bg-[#2a4a64] transition-colors duration-200"
        onClick={handleLogoClick}
      >
        <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold font-['Poppins']">WORDZY</h1>
      </div>

      <div className="mt-4 text-sm flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a5d7a] scrollbar-track-[#1f384c] hover:scrollbar-thumb-[#4a6d8a] font-['Poppins'] font-medium">
        <p className="px-4 py-2 text-[#c8cbd9] text-xs uppercase tracking-wide">MENÚ</p>

        {/* Dashboard */}
        {permissions.dashboard && (
          <NavItem
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
            onClick={() => handleNavigation("/dashboard")}
            isActive={isActiveRoute("/dashboard")}
          />
        )}

        {/* Formación */}
        {sectionVisibility.formacion && (
          <div>
            <NavItem
              icon={<GraduationCap size={18} />}
              text="Formación"
              hasSubmenu={true}
              isOpen={openSections.formacion}
              isActive={isSectionActive("/formacion")}
              onClick={() => toggleSection("formacion")}
              chevron={
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openSections.formacion ? "rotate-180" : ""}`}
                />
              }
            />

            {openSections.formacion && (
              <div className="ml-4 border-l border-[#3a5d7a] pl-4 py-1 space-y-1 animate-slideDown">
                {permissions.programas && (
                  <NavSubItem
                    icon={<GraduationCap size={16} />}
                    text="Programas"
                    onClick={() => handleNavigation("/formacion/programas")}
                    isActive={isActiveRoute("/formacion/programas")}
                  />
                )}

                {permissions.fichas && (
                  <NavSubItem
                    icon={<ClipboardList size={16} />}
                    text="Fichas"
                    onClick={() => handleNavigation("/formacion/fichas")}
                    isActive={isActiveRoute("/formacion/fichas")}
                  />
                )}

                {permissions.instructores && (
                  <NavSubItem
                    icon={<UserCog size={16} />}
                    text="Instructores"
                    onClick={() => handleNavigation("/formacion/instructores")}
                    isActive={location.pathname.startsWith("/formacion/instructores")}
                  />
                )}

                {permissions.aprendices && (
                  <NavSubItem
                    icon={<Users size={16} />}
                    text="Aprendices"
                    onClick={() => handleNavigation("/formacion/aprendices")}
                    isActive={isActiveRoute("/formacion/aprendices")}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Programación */}
        {sectionVisibility.programacion && (
          <div>
            <NavItem
              icon={<Calendar size={18} />}
              text="Programación"
              hasSubmenu={true}
              isOpen={openSections.programacion}
              isActive={isSectionActive("/programacion")}
              onClick={() => toggleSection("programacion")}
              chevron={
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openSections.programacion ? "rotate-180" : ""}`}
                />
              }
            />

            {openSections.programacion && (
              <div className="ml-4 border-l border-[#707fdd] pl-4 animate-slideDown">
                {permissions.temas && (
                  <NavSubItem
                    icon={<BookOpenText size={16} />}
                    text="Temas"
                    onClick={() => handleNavigation("/programacion/temas")}
                    isActive={isActiveRoute("/programacion/temas")}
                  />
                )}

                {permissions.materiales && (
                  <NavSubItem
                    icon={<Paperclip size={16} />}
                    text="Materiales de Apoyo"
                    onClick={() => handleNavigation("/programacion/materiales")}
                    isActive={isActiveRoute("/programacion/materiales")}
                  />
                )}

                {permissions.evaluaciones && (
                  <NavSubItem
                    icon={<TestTubes size={16} />}
                    text="Evaluaciones"
                    onClick={() => handleNavigation("/programacion/evaluaciones")}
                    isActive={location.pathname.startsWith("/programacion/evaluaciones")}
                  />
                )}

                {permissions.programacionCursos && (
                  <NavSubItem
                    icon={<CalendarCheck size={16} />}
                    text="Programación de Cursos"
                    onClick={() => handleNavigation("/programacion/programacionCursos")}
                    isActive={location.pathname.startsWith("/programacion/programacionCursos")}
                  />
                )}

                {permissions.asignacionNiveles && (
                  <NavSubItem
                    icon={<ClipboardCheck size={16} />}
                    text="Asignación de Niveles"
                    onClick={() => handleNavigation("/programacion/asignacionNiveles")}
                    isActive={isActiveRoute("/programacion/asignacionNiveles")}
                  />
                )}

                {permissions.insignias && (
                  <NavSubItem
                    icon={<Award size={16} />}
                    text="Insignias"
                    onClick={() => handleNavigation("/programacion/insigneas2")}
                    isActive={location.pathname.startsWith("/programacion/insigneas")}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Progreso */}
        {sectionVisibility.progreso && (
          <div>
            <NavItem
              icon={<Gauge size={18} />}
              text="Progreso"
              hasSubmenu={true}
              isOpen={openSections.progreso}
              isActive={isSectionActive("/progreso")}
              onClick={() => toggleSection("progreso")}
              chevron={
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openSections.progreso ? "rotate-180" : ""}`}
                />
              }
            />

            {openSections.progreso && (
              <div className="ml-4 border-l border-[#707fdd] pl-4 animate-slideDown">
                {permissions.cursosProgramados && (
                  <NavSubItem
                    icon={<ListChecks size={16} />}
                    text="Cursos Programados"
                    onClick={() => handleNavigation("/progreso/cursosProgramados")}
                    isActive={location.pathname.startsWith("/progreso/cursosProgramados")}
                  />
                )}

                {permissions.ranking && (
                  <NavSubItem
                    icon={<TrendingUp size={16} />}
                    text="Ranking"
                    onClick={() => handleNavigation("/progreso/ranking")}
                    isActive={isActiveRoute("/progreso/ranking")}
                  />
                )}

                {permissions.retroalimentacion && (
                  <NavSubItem
                    icon={<MessageSquare size={16} />}
                    text="Retroalimentación"
                    onClick={() => handleNavigation("/progreso/retroalimentacion")}
                    isActive={location.pathname.startsWith("/progreso/retroalimentacion")}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Configuración */}
        {sectionVisibility.configuracion && (
          <div>
            <NavItem
              icon={<Settings size={18} />}
              text="Configuración"
              hasSubmenu={true}
              isOpen={openSections.configuracion}
              isActive={isSectionActive("/configuracion")}
              onClick={() => toggleSection("configuracion")}
              chevron={
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${openSections.configuracion ? "rotate-180" : ""}`}
                />
              }
            />

            {openSections.configuracion && (
              <div className="ml-4 border-l border-[#707fdd] pl-4 animate-slideDown">
                {permissions.roles && (
                  <NavSubItem
                    icon={<ShieldCheck size={16} />}
                    text="Roles"
                    onClick={() => handleNavigation("/configuracion/roles")}
                    isActive={location.pathname.startsWith("/configuracion/roles")}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProtectedNavbar
