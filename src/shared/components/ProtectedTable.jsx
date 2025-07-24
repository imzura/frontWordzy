"use client";

import { usePermissions } from "../hooks/usePermissions";
import GenericTable from "./Table";

const ProtectedTable = ({
  data,
  columns,
  module, // Nombre del módulo (ej: "Temas")
  onAdd,
  onEdit,
  onDelete,
  onShow,
  onMassiveUpdate, // Nueva prop
  showActions,
  customActions,
  massiveUpdate = { enabled: false, buttonText: "Actualización Masiva" },
  exportToExcel = { enabled: false, filename: "datos", exportFunction: null },
  ...props
}) => {
  const { getModulePermissions, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-2">Cargando permisos...</span>
      </div>
    );
  }

  const modulePermissions = getModulePermissions(module);

  // Configurar qué acciones mostrar basándose en permisos
  const protectedShowActions = {
    add: modulePermissions.create,
    edit: modulePermissions.update,
    delete: modulePermissions.delete,
    // Solo mostrar el botón "show" si:
    // 1. El usuario tiene permisos de lectura Y
    // 2. Se proporciona la función onShow Y
    // 3. No se ha deshabilitado explícitamente en showActions
    show: modulePermissions.read && onShow && showActions?.show !== false,
    massiveUpdate: modulePermissions.update, // Actualización masiva requiere permisos de update
    exportToExcel: modulePermissions.export,
    ...showActions, // Permitir override manual
  };

  // Configurar el objeto massiveUpdate con permisos
  const protectedMassiveUpdate = {
    ...massiveUpdate,
    enabled: massiveUpdate.enabled && modulePermissions.update, // Solo habilitar si tiene permisos de update
  };

  // Configurar el objeto massiveUpdate con permisos
  const protectedExportToExcel = {
    ...exportToExcel,
    enabled: exportToExcel.enabled && modulePermissions.export, // Solo habilitar si tiene permisos de update
  };

  // Filtrar custom actions basándose en permisos
  const protectedCustomActions = customActions?.filter((action) => {
    if (action.requiredPermission) {
      const { module: reqModule, privilege } = action.requiredPermission;
      return modulePermissions[privilege] || false;
    }
    return true;
  });

  return (
    <GenericTable
      data={data}
      columns={columns}
      onAdd={modulePermissions.create ? onAdd : undefined}
      onEdit={modulePermissions.update ? onEdit : undefined}
      onDelete={modulePermissions.delete ? onDelete : undefined}
      onShow={modulePermissions.read ? onShow : undefined}
      onMassiveUpdate={modulePermissions.update ? onMassiveUpdate : undefined}
      showActions={protectedShowActions}
      customActions={protectedCustomActions}
      massiveUpdate={protectedMassiveUpdate}
      exportToExcel={protectedExportToExcel}
      {...props}
    />
  );
};

export default ProtectedTable;
