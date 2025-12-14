import { Smartphone, Download, QrCode, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function AppMovilSection() {
  const features = [
    'Acceso offline a órdenes de trabajo',
    'Escaneo de códigos QR en equipos',
    'Captura de fotos y documentación',
    'Firma digital de trabajos completados',
    'Sincronización automática',
    'Notificaciones push en tiempo real',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">App Móvil</h2>
        <p className="text-gray-600">Gestión de mantenimiento desde dispositivos móviles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Descarga la App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Descarga la aplicación móvil SGMI para que tus técnicos puedan gestionar órdenes de trabajo desde cualquier lugar.
            </p>
            <div className="space-y-3">
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Descargar para Android
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Descargar para iOS
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Código QR
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Escanea este código QR para descargar la app
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Características de la App Móvil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa de la App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[9/16] bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <Smartphone className="w-16 h-16 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
