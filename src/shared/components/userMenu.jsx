// components/UserMenu.jsx

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User2Icon, UserIcon } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import ConfirmationModal from "./ConfirmationModal";

const UserMenu = () => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Asegúrate de que `user` esté disponible en tu context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-[#1f384c] font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <UserIcon className="w-5 h-5" />
          <span className="truncate max-w-[150px] font-medium">
            {user?.name
              ? user.name.split(" ").slice(0, 1).join(" ")
              : "Usuario"}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md z-50 animate-fade-in-up">
            <button
              onClick={handleLogoutClick}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Está seguro de que desea cerrar la sesión actual?"
        confirmText="Cerrar Sesión"
      />
    </>
  );
};

export default UserMenu;
