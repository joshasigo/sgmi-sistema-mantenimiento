/**
 * InventarioSection.tsx
 * 
 * Sección de gestión de inventario del SGMI
 * Conectada a base de datos PostgreSQL con CRUD completo
 * 
 * Funcionalidades:
 * - Listado de items desde BD
 * - Indicadores de stock bajo
 * - Crear, editar y eliminar items
 * - Control de permisos por rol
 */

import { useState, useEffect } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingDown, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
import { inventarioService, ItemInventario, CreateInventarioData } from '../services/inventarioService';
import { useAuthStore } from '../store/authStore';
import { Alert, AlertDescription } from './ui/alert';

export function InventarioSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ItemInventario | null>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemInventario | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { user, isDemoMode } = useAuthStore();

  const [formData, setFormData] = useState<CreateInventarioData>({
    nombre: '',
    codigo: '',
    categoria: '',
    cantidad: 0,
    ubicacion: '',
    proveedor: '',
    stockMinimo: 0,
  });

  const hasPermission = () => {
    const userRol = typeof user?.rol === 'string' ? user.rol : user?.rol?.nombre;
    const isDemo = isDemoMode();
    
    if (isDemo) return false;
    if (!userRol) return false;
    // Todos pueden gestionar inventario excepto Visualizador
    return userRol !== 'Visualizador';
  };

  useEffect(() => {
    loadItems();
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

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await inventarioService.getItems();
      setItems(data);
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      showAlert('error', 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateItem = () => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para crear items de inventario');
      return;
    }
    setEditingItem(null);
    setFormData({
      nombre: '',
      codigo: '',
      categoria: '',
      cantidad: 0,
      ubicacion: '',
      proveedor: '',
      stockMinimo: 0,
    });
    setShowItemDialog(true);
  };

  const handleEditItem = (item: ItemInventario) => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para editar items de inventario');
      return;
    }
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      codigo: item.codigo,
      categoria: item.categoria,
      cantidad: item.cantidad,
      ubicacion: item.ubicacion,
      proveedor: item.proveedor,
      stockMinimo: item.stockMinimo,
    });
    setShowItemDialog(true);
    setOpenMenuId(null);
  };

  const handleDeleteItem = async (item: ItemInventario) => {
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para eliminar items de inventario');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar "${item.nombre}"?`)) {
      return;
    }

    try {
      await inventarioService.deleteItem(item.id);
      showAlert('success', 'Item eliminado exitosamente');
      await loadItems();
    } catch (error) {
      console.error('Error al eliminar item:', error);
      showAlert('error', 'Error al eliminar el item');
    }
    setOpenMenuId(null);
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasPermission()) {
      showAlert('error', 'No tienes permisos para esta acción');
      return;
    }

    try {
      if (editingItem) {
        await inventarioService.updateItem(editingItem.id, formData);
        showAlert('success', 'Item actualizado exitosamente');
      } else {
        await inventarioService.createItem(formData);
        showAlert('success', 'Item creado exitosamente');
      }
      setShowItemDialog(false);
      await loadItems();
    } catch (error: any) {
      console.error('Error al guardar item:', error);
      showAlert('error', error.response?.data?.message || 'Error al guardar el item');
    }
  };

  const getStockBadge = (item: ItemInventario) => {
    if (item.cantidad === 0) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Sin Stock</Badge>;
    }
    if (item.cantidad < item.stockMinimo) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Stock Bajo</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200">Stock OK</Badge>;
  };

  const filteredItems = items.filter(item => {
    const search = searchTerm.toLowerCase();
    return (
      item.nombre.toLowerCase().includes(search) ||
      item.codigo.toLowerCase().includes(search) ||
      item.categoria.toLowerCase().includes(search) ||
      item.ubicacion.toLowerCase().includes(search) ||
      item.proveedor.toLowerCase().includes(search)
    );
  });

  const stats = [
    { 
      label: 'Total de Items', 
      value: items.length.toString(), 
      icon: Package, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100' 
    },
    { 
      label: 'Stock Bajo', 
      value: items.filter(i => i.cantidad > 0 && i.cantidad < i.stockMinimo).length.toString(), 
      icon: TrendingDown, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100' 
    },
    { 
      label: 'Sin Stock', 
      value: items.filter(i => i.cantidad === 0).length.toString(), 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando inventario...</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-gray-600">Gestión de repuestos y materiales</p>
        </div>
        <Button onClick={handleCreateItem} className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, código, categoría, ubicación o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Stock Mínimo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  {searchTerm ? 'No se encontraron items' : 'No hay items en inventario'}
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={selectedItem?.id === item.id ? 'bg-purple-50' : ''}
                >
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={item.cantidad < item.stockMinimo ? 'text-orange-600 font-semibold' : ''}>
                      {item.cantidad}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.stockMinimo}</TableCell>
                  <TableCell className="text-sm">{item.ubicacion}</TableCell>
                  <TableCell className="text-sm">{item.proveedor}</TableCell>
                  <TableCell>{getStockBadge(item)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="menu-container relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                      >
                        ⋮
                      </Button>
                      {openMenuId === item.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditItem(item);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item);
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

      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item de Inventario' : 'Nuevo Item de Inventario'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Modifica los datos del item'
                : 'Completa los datos para agregar un nuevo item al inventario'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitItem}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Ej: Filtro de Aire HA-25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    required
                    placeholder="Ej: INV-001"
                    disabled={!!editingItem}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                    placeholder="Ej: Filtros, Lubricantes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proveedor">Proveedor *</Label>
                  <Input
                    id="proveedor"
                    value={formData.proveedor}
                    onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                    required
                    placeholder="Ej: SKF Colombia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Stock Actual *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="0"
                    value={formData.cantidad}
                    onChange={(e) =>
                      setFormData({ ...formData, cantidad: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockMinimo">Stock Mínimo *</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    min="0"
                    value={formData.stockMinimo}
                    onChange={(e) =>
                      setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación *</Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    required
                    placeholder="Ej: Almacén A-3"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowItemDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? 'Actualizar' : 'Crear'} Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
