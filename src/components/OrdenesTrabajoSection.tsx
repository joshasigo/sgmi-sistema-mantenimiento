/**
 * OrdenesTrabajoSection.tsx
 * 
 * Sección de gestión de órdenes de trabajo del SGMI
 * Conectada a base de datos PostgreSQL con CRUD completo
 * 
 * Funcionalidades:
 * - Listado de órdenes desde BD
 * - Búsqueda y filtrado
 * - Crear, editar y eliminar órdenes
 * - Control de permisos por rol
 * - Asignación de técnicos
 */

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { ordenService, OrdenTrabajo, CreateOrdenData } from '../services/ordenService';
import userService from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { Alert, AlertDescription } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';

export function OrdenesTrabajoSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [showOrdenDialog, setShowOrdenDialog] = useState(false);
  const [editingOrden, setEditingOrden] = useState<OrdenTrabajo | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { user, isDemoMode } = useAuthStore();

  const [formData, setFormData] = useState<CreateOrdenData>({
    equipo: '',
    tipo: 'PREVENTIVO',
    prioridad: 'MEDIA',
    estado: 'PENDIENTE',
    descripcion: '',
    progreso: 0,
  });

  const hasPermission = () => {
    const userRol = typeof user?.rol === 'string' ? user.rol : user?.rol?.nombre;
    const isDemo = isDemoMode();
    
    console.log('🔍 Checking permissions:', {
      isDemoMode: isDemo,
      user: user?.nombre,
      rol: userRol,
      rolObject: user?.rol,
      result: !isDemo && userRol && userRol !== 'Visualizador'
    });
    
    if (isDemo) return false;
    if (!userRol) return false;
    // Todos pueden crear/editar/eliminar excepto Visualizador
    return userRol !== 'Visualizador';
  };

  useEffect(() => {
    loadOrdenes();
    loadTecnicos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  const loadOrdenes = async () => {
    try {
      setLoading(true);
      const data = await ordenService.getOrdenes();
      setOrdenes(data);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      showAlert('error', 'Error al cargar las órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  };

  const loadTecnicos = async () => {
    try {
      const users = await userService.getUsers();
      console.log('👥 Usuarios cargados:', users);
      const tecnicosData = users.filter(u => u.rol === 'Técnico' || u.rol === 'Supervisor');
      console.log('🔧 Técnicos/Supervisores filtrados:', tecnicosData);
      setTecnicos(tecnicosData);
    } catch (error) {
      console.error('Error al cargar técnicos:', error);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateOrden = () => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para crear órdenes de trabajo');
      return;
    }
    setEditingOrden(null);
    setFormData({
      equipo: '',
      tipo: 'PREVENTIVO',
      prioridad: 'MEDIA',
      estado: 'PENDIENTE',
      descripcion: '',
      progreso: 0,
    });
    setShowOrdenDialog(true);
  };

  const handleEditOrden = (orden: OrdenTrabajo) => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para editar órdenes de trabajo');
      return;
    }
    setEditingOrden(orden);
    setFormData({
      equipo: orden.equipo,
      tipo: orden.tipo,
      prioridad: orden.prioridad,
      estado: orden.estado,
      descripcion: orden.descripcion,
      tecnicoAsignadoId: orden.tecnicoAsignadoId,
      progreso: orden.progreso,
      fechaInicio: orden.fechaInicio,
      fechaFin: orden.fechaFin,
    });
    setShowOrdenDialog(true);
    setOpenMenuId(null);
  };

  const handleDeleteOrden = async (orden: OrdenTrabajo) => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para eliminar órdenes de trabajo');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar la orden ${orden.id}?`)) {
      return;
    }

    try {
      await ordenService.deleteOrden(orden.id);
      showAlert('success', 'Orden eliminada exitosamente');
      await loadOrdenes();
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      showAlert('error', 'Error al eliminar la orden');
    }
    setOpenMenuId(null);
  };

  const handleSubmitOrden = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para esta acción');
      return;
    }

    try {
      if (editingOrden) {
        await ordenService.updateOrden(editingOrden.id, formData);
        showAlert('success', 'Orden actualizada exitosamente');
      } else {
        await ordenService.createOrden(formData);
        showAlert('success', 'Orden creada exitosamente');
      }
      setShowOrdenDialog(false);
      await loadOrdenes();
    } catch (error: any) {
      console.error('Error al guardar orden:', error);
      showAlert('error', error.response?.data?.message || 'Error al guardar la orden');
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'CRITICA':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'ALTA':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'BAJA':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADA':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDIENTE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatFecha = (fecha?: Date) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const filteredOrdenes = ordenes.filter(orden => {
    const search = searchTerm.toLowerCase();
    return (
      orden.id.toLowerCase().includes(search) ||
      orden.equipo.toLowerCase().includes(search) ||
      orden.descripcion.toLowerCase().includes(search) ||
      orden.tecnicoAsignado?.nombre?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando órdenes de trabajo...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h2>
          <p className="text-gray-600">Gestión de órdenes de mantenimiento</p>
        </div>
        <Button onClick={handleCreateOrden} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Orden
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar órdenes por ID, equipo, descripción o técnico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Progreso</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrdenes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  {searchTerm ? 'No se encontraron órdenes' : 'No hay órdenes de trabajo'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrdenes.map((orden) => (
                <TableRow
                  key={orden.id}
                  onClick={() => setSelectedOrden(orden)}
                  className={selectedOrden?.id === orden.id ? 'bg-purple-50' : ''}
                >
                  <TableCell className="font-medium">{orden.id}</TableCell>
                  <TableCell>{orden.equipo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{orden.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPrioridadColor(orden.prioridad)}>
                      {orden.prioridad}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEstadoColor(orden.estado)}>
                      {orden.estado.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {orden.tecnicoAsignado?.nombre || (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${orden.progreso}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{orden.progreso}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatFecha(orden.fechaInicio)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="menu-container relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === orden.id ? null : orden.id);
                        }}
                      >
                        ⋮
                      </Button>
                      {openMenuId === orden.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrden(orden);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrden(orden);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
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

      <Dialog open={showOrdenDialog} onOpenChange={setShowOrdenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingOrden ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
            </DialogTitle>
            <DialogDescription>
              {editingOrden
                ? 'Modifica los datos de la orden de trabajo'
                : 'Completa los datos para crear una nueva orden de trabajo'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitOrden}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipo">Equipo *</Label>
                  <Input
                    id="equipo"
                    value={formData.equipo}
                    onChange={(e) => setFormData({ ...formData, equipo: e.target.value })}
                    required
                    placeholder="Ej: Compresor A-23"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREVENTIVO">Preventivo</SelectItem>
                      <SelectItem value="CORRECTIVO">Correctivo</SelectItem>
                      <SelectItem value="PREDICTIVO">Predictivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad *</Label>
                  <Select
                    value={formData.prioridad}
                    onValueChange={(value: any) => setFormData({ ...formData, prioridad: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAJA">Baja</SelectItem>
                      <SelectItem value="MEDIA">Media</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                      <SelectItem value="CRITICA">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value: any) => setFormData({ ...formData, estado: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="EN_PROGRESO">En Progreso</SelectItem>
                      <SelectItem value="COMPLETADA">Completada</SelectItem>
                      <SelectItem value="CANCELADA">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tecnico">Técnico Asignado</Label>
                  <Select
                    value={formData.tecnicoAsignadoId || 'sin-asignar'}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tecnicoAsignadoId: value === 'sin-asignar' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-asignar">Sin asignar</SelectItem>
                      {tecnicos.map((tecnico) => (
                        <SelectItem key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progreso">Progreso (%)</Label>
                  <Input
                    id="progreso"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progreso}
                    onChange={(e) =>
                      setFormData({ ...formData, progreso: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formData.fechaInicio ? new Date(formData.fechaInicio).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha de Finalización</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={formData.fechaFin ? new Date(formData.fechaFin).toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaFin: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe la orden de trabajo..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowOrdenDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingOrden ? 'Actualizar' : 'Crear'} Orden
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
