import { Save, Building2, Bell, Mail, Database, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function ConfiguracionSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Configuración</h2>
        <p className="text-gray-600">Configuración general del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>Datos generales de la organización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nombre de la Empresa</Label>
                  <Input id="empresa" defaultValue="Industrias ACME S.A." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC/NIT</Label>
                  <Input id="ruc" defaultValue="20123456789" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" defaultValue="Av. Industrial 1234, Lima, Perú" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" defaultValue="+51 1 234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-empresa">Email</Label>
                  <Input id="email-empresa" type="email" defaultValue="contacto@acme.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>Configuración de alertas y notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Órdenes de trabajo vencidas</Label>
                  <p className="text-sm text-gray-600">Recibir alertas cuando una orden de trabajo vence</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stock bajo de inventario</Label>
                  <p className="text-sm text-gray-600">Notificar cuando el stock está por debajo del mínimo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mantenimientos preventivos programados</Label>
                  <p className="text-sm text-gray-600">Recordatorios de mantenimientos programados</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-gray-600">Enviar notificaciones al correo electrónico</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription>Configurar servidor SMTP para envío de correos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Puerto</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuario</Label>
                <Input id="smtp-user" type="email" placeholder="notificaciones@acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">Contraseña</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Registros totales</span>
                  <span className="text-gray-900">2,547</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Espacio usado</span>
                  <span className="text-gray-900">248 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Último respaldo</span>
                  <span className="text-gray-900">Hoy, 03:00</span>
                </div>
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                Respaldar Ahora
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Autenticación de dos factores</Label>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>Sesiones múltiples</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Tiempo de sesión (minutos)</Label>
                <Input type="number" defaultValue="60" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    Claro
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Oscuro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
