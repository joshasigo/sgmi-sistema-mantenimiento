import { useAuthStore } from '../store/authStore';

export const usePermissions = () => {
  const { hasPermission, isAdmin, isSupervisor, isTechnician, isDemoMode, user } = useAuthStore();

  return {
    // Permisos específicos
    canCreateOrder: hasPermission('ordenes', 'crear'),
    canEditOrder: hasPermission('ordenes', 'editar'),
    canDeleteOrder: hasPermission('ordenes', 'eliminar'),
    canViewOrders: hasPermission('ordenes', 'ver'),

    canCreateUser: hasPermission('usuarios', 'crear'),
    canEditUser: hasPermission('usuarios', 'editar'),
    canDeleteUser: hasPermission('usuarios', 'eliminar'),
    canViewUsers: hasPermission('usuarios', 'ver'),

    canManageInventory: hasPermission('inventario', 'editar'),
    canViewInventory: hasPermission('inventario', 'ver'),

    canGenerateReports: hasPermission('reportes', 'generar'),
    canExportReports: hasPermission('reportes', 'exportar'),

    // Roles
    isAdmin: isAdmin(),
    isSupervisor: isSupervisor(),
    isTechnician: isTechnician(),
    isDemo: isDemoMode(),

    // Usuario actual
    currentUser: user,

    // Helper genérico
    hasPermission: (modulo: string, accion: string) => hasPermission(modulo, accion)
  };
};
