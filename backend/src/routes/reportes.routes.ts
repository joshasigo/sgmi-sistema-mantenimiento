import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/roleMiddleware';
import {
  getEstadisticasOrdenes,
  getEstadisticasInventario,
  getReporteRendimientoTecnicos,
  getReporteMensual,
  exportarReporte,
  generarReporteOrdenesCompletadasPDF,
  generarReporteOrdenesCompletadasExcel,
  generarReporteOrdenesCompletadasCSV,
  generarReporteInventarioPDF,
  generarReporteInventarioExcel,
  generarReporteInventarioCSV,
  generarReporteKPIsPDF,
  generarReporteKPIsExcel,
  generarReporteKPIsCSV,
  generarReporteTiempoTecnicosPDF,
  generarReporteCostosMantenimientoPDF,
  generarReporteHistorialEquiposPDF
} from '../controllers/reportesController';

const router = Router();

// Estadísticas de órdenes
router.get('/estadisticas/ordenes',
  authenticateToken,
  requirePermission('reportes', 'ver'),
  getEstadisticasOrdenes
);

// Estadísticas de inventario
router.get('/estadisticas/inventario',
  authenticateToken,
  requirePermission('reportes', 'ver'),
  getEstadisticasInventario
);

// Reporte de rendimiento de técnicos
router.get('/tecnicos',
  authenticateToken,
  requirePermission('reportes', 'ver'),
  getReporteRendimientoTecnicos
);

// Reporte mensual
router.get('/mensual',
  authenticateToken,
  requirePermission('reportes', 'ver'),
  getReporteMensual
);

// Exportar reporte
router.get('/exportar',
  authenticateToken,
  requirePermission('reportes', 'exportar'),
  exportarReporte
);

// Reportes de órdenes completadas
router.get('/ordenes-completadas/pdf',
  authenticateToken,
  generarReporteOrdenesCompletadasPDF
);

router.get('/ordenes-completadas/excel',
  authenticateToken,
  generarReporteOrdenesCompletadasExcel
);

router.get('/ordenes-completadas/csv',
  authenticateToken,
  generarReporteOrdenesCompletadasCSV
);

// Reportes de inventario
router.get('/inventario/pdf',
  authenticateToken,
  generarReporteInventarioPDF
);

router.get('/inventario/excel',
  authenticateToken,
  generarReporteInventarioExcel
);

router.get('/inventario/csv',
  authenticateToken,
  generarReporteInventarioCSV
);

// Reportes de KPIs
router.get('/kpis/pdf',
  authenticateToken,
  generarReporteKPIsPDF
);

router.get('/kpis/excel',
  authenticateToken,
  generarReporteKPIsExcel
);

router.get('/kpis/csv',
  authenticateToken,
  generarReporteKPIsCSV
);

// Reportes de tiempo de técnicos (por días)
router.get('/tiempo-tecnicos/pdf',
  authenticateToken,
  generarReporteTiempoTecnicosPDF
);

// Reportes de costos de mantenimiento (precios Colombia)
router.get('/costos-mantenimiento/pdf',
  authenticateToken,
  generarReporteCostosMantenimientoPDF
);

// Reportes de historial de equipos
router.get('/historial-equipos/pdf',
  authenticateToken,
  generarReporteHistorialEquiposPDF
);

export default router;
