import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import reporteService from '../services/reporteService';

export function ReportesSection() {
  const [periodo, setPeriodo] = useState<string>('mes');
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [generando, setGenerando] = useState<string | null>(null);

  const handleGenerarReporte = async (tipo: string) => {
    setGenerando(tipo);
    try {
      switch (tipo) {
        case 'ordenes-completadas':
          await reporteService.generarReporteOrdenesCompletadas(formato, periodo);
          break;
        case 'kpis':
          await reporteService.generarReporteKPIs(formato, periodo);
          break;
        case 'inventario':
          await reporteService.generarReporteInventario(formato);
          break;
        case 'tecnicos':
          await reporteService.generarReporteTiempoTecnicos(periodo);
          break;
        case 'costos':
          await reporteService.generarReporteCostosMantenimiento(periodo);
          break;
        case 'equipos':
          await reporteService.generarReporteHistorialEquipos();
          break;
        default:
          console.log(`Reporte ${tipo} no implementado aún`);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte. Por favor, intenta de nuevo.');
    } finally {
      setGenerando(null);
    }
  };

  const reportes = [
    {
      id: 'ordenes-completadas',
      nombre: 'Órdenes de Trabajo Completadas',
      descripcion: 'Listado de todas las órdenes completadas en el período seleccionado',
      icono: FileText,
      usaPeriodo: true
    },
    {
      id: 'kpis',
      nombre: 'Indicadores de Mantenimiento (KPI)',
      descripcion: 'MTBF, MTTR, disponibilidad de equipos y otros indicadores clave',
      icono: BarChart3,
      usaPeriodo: true
    },
    {
      id: 'inventario',
      nombre: 'Consumo de Inventario',
      descripcion: 'Análisis de consumo de repuestos y materiales',
      icono: BarChart3,
      usaPeriodo: false
    },
    {
      id: 'tecnicos',
      nombre: 'Tiempo de Técnicos',
      descripcion: 'Horas trabajadas y productividad del personal técnico (por días calendario)',
      icono: Calendar,
      usaPeriodo: true
    },
    {
      id: 'costos',
      nombre: 'Costos de Mantenimiento',
      descripcion: 'Desglose de costos por equipo y período (COP - Colombia)',
      icono: FileText,
      usaPeriodo: true
    },
    {
      id: 'equipos',
      nombre: 'Historial de Equipos',
      descripcion: 'Historial completo de intervenciones por equipo según urgencia',
      icono: FileText,
      usaPeriodo: false
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Reportes</h2>
        <p className="text-gray-600">Generación y descarga de reportes del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mes</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="ano">Último Año</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Área</label>
              <Select defaultValue="todas">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las Áreas</SelectItem>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="calidad">Calidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Formato</label>
              <Select value={formato} onValueChange={(value) => setFormato(value as 'pdf' | 'excel' | 'csv')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.map((reporte) => {
          const Icon = reporte.icono;
          const estaGenerando = generando === reporte.id;
          return (
            <Card key={reporte.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1">{reporte.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-4">{reporte.descripcion}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleGenerarReporte(reporte.id)}
                      disabled={estaGenerando}
                    >
                      <Download className="w-4 h-4" />
                      {estaGenerando ? 'Generando...' : 'Generar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
