import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { useAuthStore } from '../store/authStore';
import userService, { Usuario } from '../services/userService';

interface Rol {
  id: number;
  nombre: string;
}

interface UserFormData {
  nombre: string;
  email: string;
  password: string;
  rolId: string;
  departamento: string;
  estado: string;
}

export function UsuariosSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([
    { id: 1, nombre: 'Técnico' },
    { id: 2, nombre: 'Administrador' },
    { id: 3, nombre: 'Supervisor' },
    { id: 4, nombre: 'Visualizador' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    email: '',
    password: '',
    rolId: '',
    departamento: '',
    estado: 'ACTIVO'
  });
  const [formLoading, setFormLoading] = useState(false);

  const { hasPermission, isDemoMode } = useAuthStore();

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = () => {
    if (isDemoMode()) {
      setPermissionMessage('Los usuarios demo no pueden crear nuevos usuarios. Esta es una cuenta de solo lectura.');
      setShowPermissionAlert(true);
      return;
    }

    if (!hasPermission('usuarios', 'crear')) {
      setPermissionMessage('No tienes permisos para crear usuarios. Solo los administradores pueden realizar esta acción.');
      setShowPermissionAlert(true);
      return;
    }

    setEditingUser(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rolId: '',
      departamento: '',
      estado: 'ACTIVO'
    });
    setShowUserDialog(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    if (isDemoMode()) {
      setPermissionMessage('Los usuarios demo no pueden editar usuarios. Esta es una cuenta de solo lectura.');
      setShowPermissionAlert(true);
      return;
    }

    if (!hasPermission('usuarios', 'editar')) {
      setPermissionMessage('No tienes permisos para editar usuarios. Solo los administradores pueden realizar esta acción.');
      setShowPermissionAlert(true);
      return;
    }

    setEditingUser(usuario);
    const rolId = roles.find(r => r.nombre === usuario.rol)?.id.toString() || '';
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '', // No mostramos la contraseña
      rolId,
      departamento: usuario.departamento,
      estado: usuario.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO'
    });
    setShowUserDialog(true);
  };

  const handleDeleteUser = async (usuario: Usuario) => {
    if (isDemoMode()) {
      setPermissionMessage('Los usuarios demo no pueden eliminar usuarios. Esta es una cuenta de solo lectura.');
      setShowPermissionAlert(true);
      return;
    }

    if (!hasPermission('usuarios', 'eliminar')) {
      setPermissionMessage('No tienes permisos para eliminar usuarios. Solo los administradores pueden realizar esta acción.');
      setShowPermissionAlert(true);
      return;
    }

    const confirmacion = confirm(
      `⚠️ CONFIRMACIÓN DE ELIMINACIÓN\n\n` +
      `¿Estás seguro de que deseas eliminar al usuario?\n\n` +
      `Nombre: ${usuario.nombre}\n` +
      `Email: ${usuario.email}\n` +
      `Rol: ${usuario.rol}\n\n` +
      `Esta acción NO se puede deshacer y el usuario será eliminado permanentemente de la base de datos.`
    );

    if (confirmacion) {
      try {
        setLoading(true);
        await userService.deleteUser(usuario.id);
        if (selectedUser?.id === usuario.id) {
          setSelectedUser(null);
        }
        await loadUsuarios();
        alert(`✅ Usuario "${usuario.nombre}" eliminado exitosamente de la base de datos.`);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al eliminar usuario');
        alert(`❌ Error al eliminar usuario: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoleChange = () => {
    if (isDemoMode()) {
      setPermissionMessage('Los usuarios demo no pueden cambiar roles. Esta es una cuenta de solo lectura.');
      setShowPermissionAlert(true);
      return;
    }

    if (!selectedUser) {
      setPermissionMessage('Por favor selecciona un usuario primero haciendo clic en su fila.');
      setShowPermissionAlert(true);
      return;
    }

    if (!hasPermission('usuarios', 'editar')) {
      setPermissionMessage('No tienes permisos para cambiar roles. Solo los administradores pueden realizar esta acción.');
      setShowPermissionAlert(true);
      return;
    }

    const rolId = roles.find(r => r.nombre === selectedUser.rol)?.id.toString() || '';
    setFormData({
      nombre: selectedUser.nombre,
      email: selectedUser.email,
      password: '',
      rolId,
      departamento: selectedUser.departamento,
      estado: selectedUser.estado === 'Activo' ? 'ACTIVO' : 'INACTIVO'
    });
    setShowRoleDialog(true);
  };

  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !formData.rolId) {
      setError('Por favor selecciona un rol');
      return;
    }

    const nuevoRol = roles.find(r => r.id === parseInt(formData.rolId))?.nombre;

    try {
      setFormLoading(true);
      setError(null);

      await userService.updateUser(selectedUser.id, {
        rolId: parseInt(formData.rolId)
      });

      alert(
        `✅ Rol actualizado exitosamente en la base de datos.\n\n` +
        `Usuario: ${selectedUser.nombre}\n` +
        `Rol anterior: ${selectedUser.rol}\n` +
        `Rol nuevo: ${nuevoRol}\n\n` +
        `Los permisos del usuario se han actualizado.`
      );

      setShowRoleDialog(false);
      setSelectedUser(null);
      await loadUsuarios();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al cambiar rol';
      setError(errorMsg);
      alert(`❌ Error al cambiar rol: ${errorMsg}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.rolId || !formData.departamento) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (!editingUser && !formData.password) {
      setError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    try {
      setFormLoading(true);
      setError(null);

      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        rolId: parseInt(formData.rolId),
        departamento: formData.departamento,
        estado: formData.estado,
        ...(formData.password && { password: formData.password })
      };

      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        alert(`✅ Usuario "${formData.nombre}" actualizado exitosamente en la base de datos.\n\nLos cambios se han guardado correctamente.`);
      } else {
        await userService.createUser(userData as any);
        alert(`✅ Usuario "${formData.nombre}" creado exitosamente en la base de datos.\n\nEl nuevo usuario ya puede iniciar sesión.`);
      }

      setShowUserDialog(false);
      setEditingUser(null);
      await loadUsuarios();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al guardar usuario';
      setError(errorMsg);
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setFormLoading(false);
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Supervisor':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Técnico':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'Activo'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-gray-900">Usuarios</h2>
            {isDemoMode() && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                👁️ Solo Lectura
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {isDemoMode() 
              ? 'Cuenta demo - Solo puedes visualizar la información' 
              : 'Gestión de usuarios y permisos del sistema'}
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={handleNewUser}
          disabled={isDemoMode()}
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant={selectedUser ? "default" : "outline"}
          className={`gap-2 transition-colors ${
            selectedUser 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : ''
          }`}
          onClick={handleRoleChange}
        >
          <Shield className="w-4 h-4" />
          {selectedUser ? `Cambiar Rol de ${selectedUser.nombre.split(' ')[0]}` : 'Roles y Permisos'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último Acceso</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              filteredUsuarios.map((usuario) => (
                <TableRow 
                  key={usuario.id}
                  className={`cursor-pointer transition-colors ${
                    selectedUser?.id === usuario.id 
                      ? 'bg-purple-50 hover:bg-purple-100' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUser(usuario.id === selectedUser?.id ? null : usuario)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={
                          selectedUser?.id === usuario.id 
                            ? 'bg-purple-600 text-white' 
                            : ''
                        }>
                          {getInitials(usuario.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={selectedUser?.id === usuario.id ? 'font-semibold' : ''}>
                        {usuario.nombre}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRolColor(usuario.rol)}>
                      {usuario.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>{usuario.departamento}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEstadoColor(usuario.estado)}>
                      {usuario.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {usuario.ultimoAcceso || 'Nunca'}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === usuario.id ? null : usuario.id);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      
                      {/* Menú personalizado */}
                      {openMenuId === usuario.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                            onClick={() => {
                              setOpenMenuId(null);
                              setSelectedUser(usuario);
                              handleEditUser(usuario);
                            }}
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                            <span>Actualizar Usuario</span>
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            onClick={() => {
                              setOpenMenuId(null);
                              setSelectedUser(usuario);
                              handleDeleteUser(usuario);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Borrar Usuario</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? 'Modifica los datos del usuario. Los campos marcados con * son obligatorios.'
                : 'Completa los datos del nuevo usuario. Todos los campos son obligatorios.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez García"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@sgmi.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                required={!editingUser}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol *</Label>
              <Select 
                value={formData.rolId} 
                onValueChange={(value) => setFormData({ ...formData, rolId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id.toString()}>
                      {rol.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento *</Label>
              <Input
                id="departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                placeholder="Ej: Mantenimiento, Administración"
                required
              />
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  value={formData.estado} 
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowUserDialog(false)}
                disabled={formLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingUser ? 'Actualizar' : 'Crear Usuario'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para cambiar rol */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Cambiar Rol de Usuario
            </DialogTitle>
            <DialogDescription>
              Modifica el rol de <span className="font-semibold">{selectedUser?.nombre}</span>
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitRoleChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rol-change">Nuevo Rol *</Label>
              <Select 
                value={formData.rolId} 
                onValueChange={(value) => setFormData({ ...formData, rolId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getRolColor(rol.nombre)}>
                          {rol.nombre}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="font-semibold mb-1">⚠️ Advertencia</p>
              <p>Cambiar el rol modificará los permisos del usuario inmediatamente.</p>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowRoleDialog(false)}
                disabled={formLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading} className="bg-purple-600 hover:bg-purple-700">
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Cambiar Rol'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert de permisos */}
      <AlertDialog open={showPermissionAlert} onOpenChange={setShowPermissionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permisos Insuficientes</AlertDialogTitle>
            <AlertDialogDescription>
              {permissionMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPermissionAlert(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
