import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ROLES } from "../utils/rolePermissions"
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
  Star,
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

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [openSections, setOpenSections] = useState({
    formacion: false,
    programacion: false,
    progreso: false,
    configuracion: false,
  })

  const handleLogoClick = () => {
    if (user?.role === ROLES.APPRENTICE) {
      navigate("/progreso/ranking")
    } else {
      navigate("/dashboard")
    }
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

  const userRole = user.role

  // Navbar simplificada para aprendices
  if (userRole === ROLES.APPRENTICE) {
    return (
      <div className="h-screen w-56 bg-[#1f384c] text-white flex flex-col flex-shrink-0 shadow-lg">
        {/* Logo */}
        <div
          className="p-4 flex items-center shrink-0 cursor-pointer hover:bg-[#2a4a64] transition-colors"
          onClick={handleLogoClick}
        >
          <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold font-['Poppins']">WORDZY</h1>
        </div>

        {/* Menú simplificado para aprendices */}
        <div className="mt-4 text-sm flex-1 font-['Poppins'] font-medium">
          <p className="px-4 py-2 text-[#c8cbd9] text-xs uppercase tracking-wide">MENÚ</p>

          <NavItem
            icon={<TrendingUp size={18} />}
            text="Ranking"
            onClick={() => handleNavigation("/progreso/ranking")}
          />

          <NavItem
            icon={<MessageSquare size={18} />}
            text="Retroalimentación"
            onClick={() => handleNavigation("/progreso/retroalimentacion")}
          />
        </div>
      </div>
    )
  }

  // Navbar completa para admin e instructor
  return (
    <div className="h-screen w-56 bg-[#1f384c] text-white flex flex-col flex-shrink-0 shadow-lg">
      {/* Logo */}
      <div
        className="p-4 flex items-center shrink-0 cursor-pointer hover:bg-[#2a4a64] transition-colors"
        onClick={handleLogoClick}
      >
        <img src={logo || "/placeholder.svg"} alt="Wordzy Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold font-['Poppins']">WORDZY</h1>
      </div>

      {/* Menú completo */}
      <div className="mt-4 text-sm flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a5d7a] scrollbar-track-[#1f384c] hover:scrollbar-thumb-[#4a6d8a] font-['Poppins'] font-medium">
        <p className="px-4 py-2 text-[#c8cbd9] text-xs uppercase tracking-wide">MENÚ</p>

        <NavItem icon={<LayoutDashboard size={18} />} text="Dashboard" onClick={() => handleNavigation("/dashboard")} />

        {/* Formación */}
        <div>
          <NavItem
            icon={<GraduationCap size={18} />}
            text="Formación"
            hasSubmenu={true}
            isOpen={openSections.formacion}
            onClick={() => toggleSection("formacion")}
            chevron={
              <ChevronDown size={16} className={`transition-transform ${openSections.formacion ? "rotate-180" : ""}`} />
            }
          />

          {openSections.formacion && (
            <div className="ml-4 border-l border-[#3a5d7a] pl-4 py-1 space-y-1">
              <NavSubItem
                icon={<GraduationCap size={16} />}
                text="Programas"
                onClick={() => handleNavigation("/formacion/programas")}
              />
              <NavSubItem
                icon={<ClipboardList size={16} />}
                text="Fichas"
                onClick={() => handleNavigation("/formacion/fichas")}
              />
              <NavSubItem
                icon={<UserCog size={16} />}
                text="Instructores"
                onClick={() => handleNavigation("/formacion/instructores")}
              />
              <NavSubItem
                icon={<Users size={16} />}
                text="Aprendices"
                onClick={() => handleNavigation("/formacion/aprendices")}
              />
            </div>
          )}
        </div>

        {/* Programación */}
        <div>
          <NavItem
            icon={<Calendar size={18} />}
            text="Programación"
            hasSubmenu={true}
            isOpen={openSections.programacion}
            onClick={() => toggleSection("programacion")}
            chevron={
              <ChevronDown
                size={16}
                className={`transition-transform ${openSections.programacion ? "rotate-180" : ""}`}
              />
            }
          />

          {openSections.programacion && (
            <div className="ml-4 border-l border-[#707fdd] pl-4">
              <NavSubItem
                icon={<BookOpenText size={16} />}
                text="Temas"
                onClick={() => handleNavigation("/programacion/temas")}
              />
              <NavSubItem
                icon={<Paperclip size={16} />}
                text="Materiales de Apoyo"
                onClick={() => handleNavigation("/programacion/materiales")}
              />
              <NavSubItem
                icon={<TestTubes size={16} />}
                text="Evaluaciones"
                onClick={() => handleNavigation("/programacion/evaluaciones")}
              />
              <NavSubItem
                icon={<CalendarCheck size={16} />}
                text="Programación de Cursos"
                onClick={() => handleNavigation("/programacion/programacionCursos")}
              />
              <NavSubItem
                icon={<ClipboardCheck size={16} />}
                text="Asignación de Niveles"
                onClick={() => handleNavigation("/programacion/asignacionNiveles")}
              />
              <NavSubItem
                icon={<Award size={16} />}
                text="Insignias"
                onClick={() => handleNavigation("/programacion/insigneas2")}
              />
            </div>
          )}
        </div>

        {/* Progreso */}
        <div>
          <NavItem
            icon={<Gauge size={18} />}
            text="Progreso"
            hasSubmenu={true}
            isOpen={openSections.progreso}
            onClick={() => toggleSection("progreso")}
            chevron={
              <ChevronDown size={16} className={`transition-transform ${openSections.progreso ? "rotate-180" : ""}`} />
            }
          />

          {openSections.progreso && (
            <div className="ml-4 border-l border-[#707fdd] pl-4">
              <NavSubItem
                icon={<ListChecks size={16} />}
                text="Cursos Programados"
                onClick={() => handleNavigation("/progreso/cursosProgramados")}
              />
              <NavSubItem
                icon={<TrendingUp size={16} />}
                text="Ranking"
                onClick={() => handleNavigation("/progreso/ranking")}
              />
              <NavSubItem
                icon={<MessageSquare size={16} />}
                text="Retroalimentación"
                onClick={() => handleNavigation("/progreso/retroalimentacion")}
              />
            </div>
          )}
        </div>

        {/* Configuración - Solo para Admin */}
        {userRole === ROLES.ADMIN && (
          <div>
            <NavItem
              icon={<Settings size={18} />}
              text="Configuración"
              hasSubmenu={true}
              isOpen={openSections.configuracion}
              onClick={() => toggleSection("configuracion")}
              chevron={
                <ChevronDown
                  size={16}
                  className={`transition-transform ${openSections.configuracion ? "rotate-180" : ""}`}
                />
              }
            />

            {openSections.configuracion && (
              <div className="ml-4 border-l border-[#707fdd] pl-4">
                <NavSubItem
                  icon={<ShieldCheck size={16} />}
                  text="Roles"
                  onClick={() => handleNavigation("/configuracion/roles")}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
