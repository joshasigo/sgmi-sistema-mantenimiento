import api from './api';

export interface ReporteParams {
  periodo?: 'semana' | 'mes' | 'trimestre' | 'ano';
  formato?: 'pdf' | 'excel' | 'csv';
}

class ReporteService {
  // Generar reporte de órdenes completadas
  async generarReporteOrdenesCompletadas(formato: 'pdf' | 'excel' | 'csv', periodo: string = 'mes') {
    const response = await api.get(`/reportes/ordenes-completadas/${formato}`, {
      params: { periodo },
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `ordenes-completadas-${Date.now()}.${formato === 'excel' ? 'xlsx' : formato}`);
  }

  // Generar reporte de inventario
  async generarReporteInventario(formato: 'pdf' | 'excel' | 'csv') {
    const response = await api.get(`/reportes/inventario/${formato}`, {
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `inventario-${Date.now()}.${formato === 'excel' ? 'xlsx' : formato}`);
  }

  // Generar reporte de KPIs
  async generarReporteKPIs(formato: 'pdf' | 'excel' | 'csv', periodo: string = 'mes') {
    const response = await api.get(`/reportes/kpis/${formato}`, {
      params: { periodo },
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `kpis-${Date.now()}.${formato === 'excel' ? 'xlsx' : formato}`);
  }

  // Generar reporte de tiempo de técnicos (por días)
  async generarReporteTiempoTecnicos(periodo: string = 'mes') {
    const response = await api.get(`/reportes/tiempo-tecnicos/pdf`, {
      params: { periodo },
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `tiempo-tecnicos-${Date.now()}.pdf`);
  }

  // Generar reporte de costos de mantenimiento (Colombia)
  async generarReporteCostosMantenimiento(periodo: string = 'mes') {
    const response = await api.get(`/reportes/costos-mantenimiento/pdf`, {
      params: { periodo },
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `costos-mantenimiento-${Date.now()}.pdf`);
  }

  // Generar reporte de historial de equipos
  async generarReporteHistorialEquipos() {
    const response = await api.get(`/reportes/historial-equipos/pdf`, {
      responseType: 'blob'
    });
    
    this.descargarArchivo(response.data, `historial-equipos-${Date.now()}.pdf`);
  }

  // Función auxiliar para descargar archivos
  private descargarArchivo(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ReporteService();
