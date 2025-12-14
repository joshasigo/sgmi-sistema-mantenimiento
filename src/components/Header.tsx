/**
 * Header.tsx
 * 
 * Encabezado y navegación principal del SGMI
 * Diseñado en Figma con componentes de shadcn/ui
 * 
 * Elementos:
 * - Logo y branding
 * - Selector de proyectos
 * - Menú de navegación principal
 * - Información de usuario
 * - Menú de acciones
 */

import { Settings, FileText, Package, BarChart3, Users, Smartphone, ClipboardList, LayoutDashboard, Building2, ChevronDown, MapPin, LogOut, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserProfileDialog } from './UserProfileDialog';

type Section = 'dashboard' | 'ordenes' | 'app-movil' | 'inventario' | 'reportes' | 'usuarios' | 'configuracion';

interface HeaderProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout?: () => void;
}

export function Header({ activeSection, onSectionChange, onLogout }: HeaderProps) {
  const [selectedProject, setSelectedProject] = useState('PROJ-001');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const { user } = useAuthStore();

  // Generar avatar basado en el nombre del usuario
  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  };

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

  const usuarioActual = {
    nombre: user?.nombre || 'Usuario',
    rol: user?.rol || 'Sin rol',
    ubicacion: user?.departamento || 'Sin departamento',
    email: user?.email || '',
    avatar: getAvatarUrl(user?.nombre || 'User'),
    initials: getInitials(user?.nombre || 'US')
  };

  const proyectos = [
    { id: 'PROJ-001', nombre: 'Industrias ACME S.A.', cuenta: 'SGMI-2025-001' },
    { id: 'PROJ-002', nombre: 'Manufactura XYZ Ltda.', cuenta: 'SGMI-2025-002' },
    { id: 'PROJ-003', nombre: 'Procesadora ABC Corp.', cuenta: 'SGMI-2025-003' },
    { id: 'PROJ-004', nombre: 'Textiles del Norte S.A.', cuenta: 'SGMI-2025-004' },
    { id: 'PROJ-005', nombre: 'Alimentos del Pacífico', cuenta: 'SGMI-2025-005' },
  ];

  const proyectoActual = proyectos.find(p => p.id === selectedProject) || proyectos[0];

  const menuItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ordenes' as Section, label: 'Órdenes de Trabajo', icon: ClipboardList },
    { id: 'app-movil' as Section, label: 'App Móvil', icon: Smartphone },
    { id: 'inventario' as Section, label: 'Inventario', icon: Package },
    { id: 'reportes' as Section, label: 'Reportes', icon: BarChart3 },
    { id: 'usuarios' as Section, label: 'Usuarios', icon: Users },
    { id: 'configuracion' as Section, label: 'Configuración', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <UserProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
      />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">SGMI</h1>
              <p className="text-sm text-gray-500">Sistema de Gestión de Mantenimiento Industrial</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{usuarioActual.ubicacion}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1 transition-colors">
                  <Avatar>
                    <AvatarImage src={usuarioActual.avatar} alt={usuarioActual.nombre} />
                    <AvatarFallback>{usuarioActual.initials}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={usuarioActual.avatar} alt={usuarioActual.nombre} />
                      <AvatarFallback>{usuarioActual.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-900">{usuarioActual.nombre}</p>
                      <p className="text-xs text-gray-600">{usuarioActual.rol}</p>
                      <p className="text-xs text-gray-500">{usuarioActual.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <MapPin className="w-4 h-4" />
                  <div>
                    <p className="text-sm">Ubicación Actual</p>
                    <p className="text-xs text-gray-600">{usuarioActual.ubicacion}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={() => setShowProfileDialog(true)}>
                  <User className="w-4 h-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Salir de Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              <label className="text-sm text-gray-700">Proyecto:</label>
            </div>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proyectos.map((proyecto) => (
                  <SelectItem key={proyecto.id} value={proyecto.id}>
                    {proyecto.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-6 flex items-center gap-2">
              <span className="text-sm text-gray-600">Empresa:</span>
              <span className="text-gray-900">{proyectoActual.nombre}</span>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-600">Cuenta SGMI:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {proyectoActual.cuenta}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}