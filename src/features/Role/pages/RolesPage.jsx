import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../../shared/components/Table";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import ConfirmationModal from "../../../shared/components/ConfirmationModal";
import { formatDate } from "../../../shared/utils/dateFormatter";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { useGetRoles } from "../hooks/useGetRoles";

const columns = [
  { key: "name", label: "Nombre" },
  {
    key: "description",
    label: "Descripción",
    render: (item) => (
      <span className="text-gray-600">
        {item.description || "Sin descripción"}
      </span>
    )
  },
  { key: "creationDate", label: "Fecha de creación" },
  {
    key: "status",
    label: "Estado",
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === true
          ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {item.status ? "Activo" : "Inactivo"}
      </span>
    ),
  },
];

const RolesPage = () => {
  const navigate = useNavigate();
  const { roles, loading: fetchLoading, error: fetchError, refetch } = useGetRoles();
  const { deleteRole, loading: deleteLoading, error: deleteError } = useDeleteRole();

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef(null);

  // Actualizar el estado de carga y error cuando cambien los hooks
  useEffect(() => {
    setIsLoading(fetchLoading || deleteLoading)
  }, [fetchLoading, deleteLoading])

  // Consolidar errores de los diferentes hooks
  useEffect(() => {
    const error = fetchError || deleteError
    setErrorMessage(error ? `Error: ${error}` : "")
  }, [fetchError, deleteError])

  const formattedRoles = roles.map(role => ({
    ...role,
    creationDate: formatDate(role.creationDate),
  }));

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

  const handleAddRole = () => {
    navigate("/configuracion/roles/registrarRol");
  };

  const handleEditRole = (role) => {
    // Usar _id en lugar de id para la navegación
    const roleId = role._id || role.id
    navigate(`/configuracion/roles/editar/${roleId}`)
  }

  const handleDeleteRole = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = async () => {
    try {
      setIsDeleting(true);
      await deleteRole(itemToDelete);
      await refetch();
      setSuccessMessage("Rol eliminado exitosamente");
      setShowSuccessModal(true);
    } catch (error) {
      setSuccessMessage(error.message || "Ocurrió un error al eliminar el rol");
      setShowSuccessModal(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="max-h-screen">
      <header className="bg-white py-4 px-6 border-b border-[#d6dade] mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1f384c]">Roles</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-[#1f384c] font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <span>Administrador</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-[#f44144] hover:bg-gray-50 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Mostrar error si existe */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{errorMessage}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-2">Cargando...</span>
          </div>
        ) : (
          <GenericTable
            data={formattedRoles}
            columns={columns}
            onAdd={handleAddRole}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
            showActions={{ show: false, edit: true, delete: true, add: true }}
          />
        )}

        {/* Modal de confirmación para cerrar sesión */}
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Cerrar Sesión"
          message="¿Está seguro de que desea cerrar la sesión actual?"
          confirmText="Cerrar Sesión"
          confirmColor="bg-[#f44144] hover:bg-red-600"
        />

        {/* Modal de confirmación para eliminar rol */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDeleteRole}
          title="Eliminar Rol"
          message="¿Está seguro que desea eliminar este rol? Esta acción no se puede deshacer."
          confirmText={isDeleting ? "Eliminando..." : "Eliminar"}
          confirmColor="bg-[#f44144] hover:bg-red-600"
          isLoading={isDeleting}
        />

        {/* Modal de éxito/error */}
        <ConfirmationModal
          isOpen={showSuccessModal}
          onConfirm={() => setShowSuccessModal(false)}
          title={successMessage.includes("exitosamente") ? "Operación Exitosa" : "Error"}
          message={successMessage}
          confirmText="Aceptar"
          confirmColor={successMessage.includes("exitosamente") ? "bg-green-500 hover:bg-green-600" : "bg-[#f44144] hover:bg-red-600"}
          showButtonCancel={false}
        />
      </div>
    </div>
  );
};

export default RolesPage;