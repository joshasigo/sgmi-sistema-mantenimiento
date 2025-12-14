import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Briefcase, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
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

  if (!user) return null;

  const avatar = getAvatarUrl(user.nombre);
  const initials = getInitials(user.nombre);

  // Formatear fecha
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mi Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar y nombre */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt={user.nombre} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">{user.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">{user.rol}</p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">Correo Electrónico</p>
                <p className="text-gray-900 font-medium break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Rol del Sistema</p>
                <p className="text-gray-900 font-medium">{user.rol}</p>
              </div>
            </div>

            {user.departamento && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Departamento</p>
                  <p className="text-gray-900 font-medium">{user.departamento}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Estado</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.estado === 'ACTIVO' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.estado || 'ACTIVO'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Último Acceso</p>
                <p className="text-gray-900 font-medium">
                  {formatDate(user.ultimoAcceso)}
                </p>
              </div>
            </div>
          </div>

          {/* Permisos */}
          {user.permisos && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Permisos del Sistema</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(user.permisos).map(([modulo, permisos]: [string, any]) => (
                  <div key={modulo} className="text-sm">
                    <p className="font-medium text-gray-700 capitalize">{modulo}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(permisos).map(([accion, habilitado]: [string, any]) => (
                        habilitado && (
                          <span 
                            key={accion} 
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {accion}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
