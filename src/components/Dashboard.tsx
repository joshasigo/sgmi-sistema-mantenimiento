/**
 * Dashboard.tsx
 * 
 * Panel de control principal del SGMI
 * Conectado a base de datos con estadísticas en tiempo real
 * 
 * Muestra:
 * - Estadísticas de órdenes de trabajo
 * - Órdenes recientes
 * - Datos dinámicos desde PostgreSQL
 */

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Wrench, TrendingUp, Bell, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import dashboardService, { DashboardData } from '../services/dashboardService';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // Recargar cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await dashboardService.getStats();
      setData(dashboardData);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error al cargar el dashboard</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Órdenes Activas',
      value: data.stats.ordenesActivas.toString(),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Órdenes Completadas',
      value: data.stats.ordenesCompletadas.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Órdenes Críticas',
      value: data.stats.ordenesCriticas.toString(),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Equipos en Mantenimiento',
      value: data.stats.equiposEnMantenimiento.toString(),
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Items en Inventario',
      value: data.stats.totalInventario.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Vista general del sistema de mantenimiento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Trabajo Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.ordenesRecientes.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{order.id}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-900">{order.equipo}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.prioridad === 'CRITICA'
                          ? 'bg-red-100 text-red-700'
                          : order.prioridad === 'ALTA'
                          ? 'bg-orange-100 text-orange-700'
                          : order.prioridad === 'MEDIA'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.prioridad}
                    </span>
                    <span className="text-sm text-gray-600">{order.estado.replace('_', ' ')}</span>
                    {order.tecnicoAsignado && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{order.tecnicoAsignado.nombre}</span>
                      </>
                    )}
                  </div>
                  <Progress value={order.progreso} className="h-2" />
                </div>
                <div className="text-lg font-semibold text-gray-900">{order.progreso}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}