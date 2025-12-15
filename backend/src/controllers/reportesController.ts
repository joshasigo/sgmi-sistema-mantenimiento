import { Request, Response } from 'express';
import prisma from '../config/database.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const demoMode = process.env.DEMO_MODE === 'true';

/**
 * Obtiene estadísticas generales de órdenes de trabajo
 * @route GET /api/reportes/estadisticas
 * @access Private
 */
export const getEstadisticasOrdenes = async (_req: Request, res: Response) => {
  try {
    if (demoMode) {
      return res.json({
        total: 3,
        pendientes: 1,
        enProgreso: 1,
        completadas: 1,
        canceladas: 0,
        porTipo: {
          CORRECTIVO: 1,
          PREVENTIVO: 1,
          PREDICTIVO: 0,
          MEJORA: 1
        },
        porPrioridad: {
          BAJA: 1,
          MEDIA: 1,
          ALTA: 1,
          CRITICA: 0
        },
        tiempoPromedioCompletacion: 9, // horas
        cumplimientoTiempos: 100 // porcentaje
      });
    }

    const [
      total,
      pendientes,
      enProgreso,
      completadas,
      canceladas,
      ordenes
    ] = await Promise.all([
      prisma.ordenTrabajo.count(),
      prisma.ordenTrabajo.count({ where: { estado: 'PENDIENTE' } }),
      prisma.ordenTrabajo.count({ where: { estado: 'EN_PROGRESO' } }),
      prisma.ordenTrabajo.count({ where: { estado: 'COMPLETADA' } }),
      prisma.ordenTrabajo.count({ where: { estado: 'CANCELADA' } }),
      prisma.ordenTrabajo.findMany({
        select: { tipo: true, prioridad: true, horasReales: true, horasEstimadas: true }
      })
    ]);

    const porTipo = ordenes.reduce((acc: any, orden) => {
      acc[orden.tipo] = (acc[orden.tipo] || 0) + 1;
      return acc;
    }, {});

    const porPrioridad = ordenes.reduce((acc: any, orden) => {
      acc[orden.prioridad] = (acc[orden.prioridad] || 0) + 1;
      return acc;
    }, {});

    const ordenesCompletadas = ordenes.filter(o => o.horasReales !== null);
    const tiempoPromedio = ordenesCompletadas.length > 0
      ? ordenesCompletadas.reduce((sum, o) => sum + (o.horasReales || 0), 0) / ordenesCompletadas.length
      : 0;

    const cumplimientoTiempos = ordenesCompletadas.length > 0
      ? (ordenesCompletadas.filter(o => (o.horasReales || 0) <= o.horasEstimadas).length / ordenesCompletadas.length) * 100
      : 100;

    res.json({
      total,
      pendientes,
      enProgreso,
      completadas,
      canceladas,
      porTipo,
      porPrioridad,
      tiempoPromedioCompletacion: Math.round(tiempoPromedio * 100) / 100,
      cumplimientoTiempos: Math.round(cumplimientoTiempos * 100) / 100
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas de órdenes' });
  }
};

/**
 * Obtiene estadísticas del inventario
 * @route GET /api/reportes/inventario
 * @access Private
 */
export const getEstadisticasInventario = async (_req: Request, res: Response) => {
  try {
    if (demoMode) {
      return res.json({
        totalItems: 4,
        itemsBajoStock: 1,
        valorTotal: 8445000,
        categorias: {
          'Repuestos': 2,
          'Herramientas': 1,
          'Lubricantes': 1
        },
        alertasBajoStock: [
          {
            id: 'inv-003',
            codigo: 'LUB-MOT-020',
            nombre: 'Aceite motor SAE 15W-40',
            cantidadActual: 2,
            cantidadMinima: 10
          }
        ]
      });
    }

    const [
      totalItems,
      itemsBajoStock,
      items
    ] = await Promise.all([
      prisma.itemInventario.count(),
      prisma.itemInventario.findMany({
        where: {
          cantidad: {
            lt: { _ref: 'stockMinimo' }
          }
        }
      }),
      prisma.itemInventario.findMany()
    ]);
    
    // Calcular valor total del inventario
    const valorTotal = items.reduce((sum: number, item: any) =>
      sum + ((item.cantidad || 0) * (item.precioUnitario || 0)), 0
    );

    // Agrupar por categoría
    const categorias = items.reduce((acc: Record<string, number>, item: any) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + 1;
      return acc;
    }, {});

    const alertasBajoStock = items
      .filter(item => item.cantidadActual < item.cantidadMinima)
      .map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        cantidadActual: item.cantidadActual,
        cantidadMinima: item.cantidadMinima
      }));

    res.json({
      totalItems,
      itemsBajoStock,
      valorTotal,
      categorias,
      alertasBajoStock
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de inventario:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas de inventario' });
  }
};

export const getReporteRendimientoTecnicos = async (req: Request, res: Response) => {
  try {
    if (demoMode) {
      return res.json([
        {
          tecnicoId: 'demo-tecnico-001',
          nombre: 'Técnico Demo',
          ordenesAsignadas: 3,
          ordenesCompletadas: 1,
          ordenesEnProgreso: 1,
          ordenesPendientes: 1,
          promedioHoras: 6.33,
          eficiencia: 95.5 // porcentaje
        }
      ]);
    }

    const tecnicos = await prisma.usuario.findMany({
      where: {
        rol: {
          nombre: 'Técnico'
        }
      },
      include: {
        ordenesAsignadas: {
          select: {
            id: true,
            estado: true,
            horasReales: true,
            horasEstimadas: true
          }
        }
      }
    });

    const reporte = tecnicos.map(tecnico => {
      const ordenes = tecnico.ordenesAsignadas;
      const completadas = ordenes.filter(o => o.estado === 'COMPLETADA');
      
      const promedioHoras = completadas.length > 0
        ? completadas.reduce((sum, o) => sum + (o.horasReales || 0), 0) / completadas.length
        : 0;

      const eficiencia = completadas.length > 0
        ? (completadas.reduce((sum, o) => {
            if (o.horasReales && o.horasEstimadas > 0) {
              return sum + (o.horasEstimadas / o.horasReales);
            }
            return sum;
          }, 0) / completadas.length) * 100
        : 100;

      return {
        tecnicoId: tecnico.id,
        nombre: tecnico.nombre,
        ordenesAsignadas: ordenes.length,
        ordenesCompletadas: completadas.length,
        ordenesEnProgreso: ordenes.filter(o => o.estado === 'EN_PROGRESO').length,
        ordenesPendientes: ordenes.filter(o => o.estado === 'PENDIENTE').length,
        promedioHoras: Math.round(promedioHoras * 100) / 100,
        eficiencia: Math.round(eficiencia * 100) / 100
      };
    });

    res.json(reporte);
  } catch (error) {
    console.error('Error al obtener reporte de técnicos:', error);
    res.status(500).json({ message: 'Error al obtener reporte de rendimiento' });
  }
};

export const getReporteMensual = async (req: Request, res: Response) => {
  try {
    const { mes, anio } = req.query;
    
    if (demoMode) {
      return res.json({
        periodo: `${mes}/${anio}`,
        ordenesCreadas: 3,
        ordenesCompletadas: 1,
        horasTrabajadas: 19,
        costosMantenimiento: 1850000,
        disponibilidadEquipos: 96.5,
        tiempoPromedioRespuesta: 4.2 // horas
      });
    }

    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);
    
    const fechaInicio = new Date(anioNum, mesNum - 1, 1);
    const fechaFin = new Date(anioNum, mesNum, 0);

    const ordenes = await prisma.ordenTrabajo.findMany({
      where: {
        fechaCreacion: {
          gte: fechaInicio,
          lte: fechaFin
        }
      }
    });

    const horasTrabajadas = ordenes.reduce((sum, o) => sum + (o.horasReales || 0), 0);
    
    res.json({
      periodo: `${mes}/${anio}`,
      ordenesCreadas: ordenes.length,
      ordenesCompletadas: ordenes.filter(o => o.estado === 'COMPLETADA').length,
      horasTrabajadas,
      costosMantenimiento: 0, // Implementar cálculo de costos
      disponibilidadEquipos: 0, // Implementar cálculo de disponibilidad
      tiempoPromedioRespuesta: 0 // Implementar cálculo
    });
  } catch (error) {
    console.error('Error al obtener reporte mensual:', error);
    res.status(500).json({ message: 'Error al obtener reporte mensual' });
  }
};

// Función auxiliar para obtener datos de órdenes de trabajo
async function getOrdenesData(periodo: string) {
  const fechaInicio = calcularFechaInicio(periodo);
  
  const ordenes = await prisma.ordenTrabajo.findMany({
    where: {
      createdAt: {
        gte: fechaInicio
      }
    },
    include: {
      tecnicoAsignado: {
        select: {
          nombre: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return ordenes;
}

// Función auxiliar para obtener datos de inventario
async function getInventarioData() {
  const items = await prisma.itemInventario.findMany({
    orderBy: {
      nombre: 'asc'
    }
  });

  return items;
}

// Función auxiliar para calcular fecha de inicio según período
function calcularFechaInicio(periodo: string): Date {
  const hoy = new Date();
  const fecha = new Date();

  switch (periodo) {
    case 'semana':
      fecha.setDate(hoy.getDate() - 7);
      break;
    case 'mes':
      fecha.setMonth(hoy.getMonth() - 1);
      break;
    case 'trimestre':
      fecha.setMonth(hoy.getMonth() - 3);
      break;
    case 'ano':
      fecha.setFullYear(hoy.getFullYear() - 1);
      break;
    default:
      fecha.setMonth(hoy.getMonth() - 1);
  }

  return fecha;
}

// Generar reporte de órdenes completadas en PDF
export async function generarReporteOrdenesCompletadasPDF(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA');

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ordenes-completadas-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Órdenes de Trabajo Completadas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${periodo}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Resumen
    doc.fontSize(14).text(`Total de órdenes completadas: ${ordenesCompletadas.length}`, { underline: true });
    doc.moveDown();

    // Tabla de órdenes
    ordenesCompletadas.forEach((orden, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).text(`${index + 1}. ${orden.id} - ${orden.equipo}`, { bold: true });
      doc.fontSize(10)
        .text(`   Tipo: ${orden.tipo}`)
        .text(`   Descripción: ${orden.descripcion}`)
        .text(`   Prioridad: ${orden.prioridad}`)
        .text(`   Técnico: ${orden.tecnicoAsignado ? orden.tecnicoAsignado.nombre : 'No asignado'}`)
        .text(`   Progreso: ${orden.progreso}%`)
        .text(`   Fecha creación: ${orden.createdAt ? new Date(orden.createdAt).toLocaleDateString('es-ES') : 'N/A'}`);
      
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar reporte PDF:', error);
    res.status(500).json({ error: 'Error al generar reporte PDF' });
  }
}

// Generar reporte de órdenes completadas en Excel
export async function generarReporteOrdenesCompletadasExcel(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Órdenes Completadas');

    // Configurar columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Equipo', key: 'equipo', width: 25 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Descripción', key: 'descripcion', width: 40 },
      { header: 'Prioridad', key: 'prioridad', width: 12 },
      { header: 'Técnico', key: 'tecnico', width: 25 },
      { header: 'Progreso', key: 'progreso', width: 10 },
      { header: 'Fecha Creación', key: 'fechaCreacion', width: 15 }
    ];

    // Estilo del encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agregar datos
    ordenesCompletadas.forEach(orden => {
      worksheet.addRow({
        id: orden.id,
        equipo: orden.equipo,
        tipo: orden.tipo,
        descripcion: orden.descripcion,
        prioridad: orden.prioridad,
        tecnico: orden.tecnicoAsignado ? orden.tecnicoAsignado.nombre : 'No asignado',
        progreso: `${orden.progreso}%`,
        fechaCreacion: orden.createdAt ? new Date(orden.createdAt).toLocaleDateString('es-ES') : 'N/A'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=ordenes-completadas-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar reporte Excel:', error);
    res.status(500).json({ error: 'Error al generar reporte Excel' });
  }
}

// Generar reporte de órdenes completadas en CSV
export async function generarReporteOrdenesCompletadasCSV(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA');

    const tmpFile = path.join(os.tmpdir(), `ordenes-${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: tmpFile,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'equipo', title: 'Equipo' },
        { id: 'tipo', title: 'Tipo' },
        { id: 'descripcion', title: 'Descripción' },
        { id: 'prioridad', title: 'Prioridad' },
        { id: 'tecnico', title: 'Técnico' },
        { id: 'progreso', title: 'Progreso' },
        { id: 'fechaCreacion', title: 'Fecha Creación' }
      ]
    });

    const records = ordenesCompletadas.map(orden => ({
      id: orden.id,
      equipo: orden.equipo,
      tipo: orden.tipo,
      descripcion: orden.descripcion,
      prioridad: orden.prioridad,
      tecnico: orden.tecnicoAsignado ? orden.tecnicoAsignado.nombre : 'No asignado',
      progreso: `${orden.progreso}%`,
      fechaCreacion: orden.createdAt ? new Date(orden.createdAt).toLocaleDateString('es-ES') : 'N/A'
    }));

    await csvWriter.writeRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ordenes-completadas-${Date.now()}.csv`);

    const fileStream = fs.createReadStream(tmpFile);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      fs.unlinkSync(tmpFile);
    });
  } catch (error) {
    console.error('Error al generar reporte CSV:', error);
    res.status(500).json({ error: 'Error al generar reporte CSV' });
  }
}

// Generar reporte de inventario en PDF
export async function generarReporteInventarioPDF(req: Request, res: Response) {
  try {
    const items = await getInventarioData();

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Inventario', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Resumen
    doc.fontSize(14).text(`Total de items en inventario: ${items.length}`, { underline: true });
    const itemsBajoStock = items.filter(i => i.cantidad < i.stockMinimo);
    doc.fontSize(12).text(`Items con stock bajo: ${itemsBajoStock.length}`);
    doc.moveDown();

    // Tabla de items
    items.forEach((item, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      const bajoStock = item.cantidad < item.stockMinimo;
      doc.fontSize(12).text(`${index + 1}. ${item.nombre} (${item.codigo})`, { bold: true });
      doc.fontSize(10)
        .text(`   Categoría: ${item.categoria}`)
        .text(`   Cantidad: ${item.cantidad} ${bajoStock ? '⚠️ BAJO STOCK' : ''}`)
        .text(`   Stock Mínimo: ${item.stockMinimo}`)
        .text(`   Ubicación: ${item.ubicacion}`)
        .text(`   Proveedor: ${item.proveedor}`);
      
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar reporte PDF de inventario:', error);
    res.status(500).json({ error: 'Error al generar reporte PDF de inventario' });
  }
}

// Generar reporte de inventario en Excel
export async function generarReporteInventarioExcel(req: Request, res: Response) {
  try {
    const items = await getInventarioData();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Categoría', key: 'categoria', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Stock Mínimo', key: 'stockMinimo', width: 15 },
      { header: 'Ubicación', key: 'ubicacion', width: 20 },
      { header: 'Proveedor', key: 'proveedor', width: 25 },
      { header: 'Estado', key: 'estado', width: 15 }
    ];

    // Estilo del encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agregar datos
    items.forEach(item => {
      const bajoStock = item.cantidad < item.stockMinimo;
      worksheet.addRow({
        codigo: item.codigo,
        nombre: item.nombre,
        categoria: item.categoria,
        cantidad: item.cantidad,
        stockMinimo: item.stockMinimo,
        ubicacion: item.ubicacion,
        proveedor: item.proveedor,
        estado: bajoStock ? 'BAJO STOCK' : 'OK'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar reporte Excel de inventario:', error);
    res.status(500).json({ error: 'Error al generar reporte Excel de inventario' });
  }
}

// Generar reporte de inventario en CSV
export async function generarReporteInventarioCSV(req: Request, res: Response) {
  try {
    const items = await getInventarioData();

    const tmpFile = path.join(os.tmpdir(), `inventario-${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: tmpFile,
      header: [
        { id: 'codigo', title: 'Código' },
        { id: 'nombre', title: 'Nombre' },
        { id: 'categoria', title: 'Categoría' },
        { id: 'cantidad', title: 'Cantidad' },
        { id: 'stockMinimo', title: 'Stock Mínimo' },
        { id: 'ubicacion', title: 'Ubicación' },
        { id: 'proveedor', title: 'Proveedor' },
        { id: 'estado', title: 'Estado' }
      ]
    });

    const records = items.map(item => ({
      codigo: item.codigo,
      nombre: item.nombre,
      categoria: item.categoria,
      cantidad: item.cantidad,
      stockMinimo: item.stockMinimo,
      ubicacion: item.ubicacion,
      proveedor: item.proveedor,
      estado: item.cantidad < item.stockMinimo ? 'BAJO STOCK' : 'OK'
    }));

    await csvWriter.writeRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.csv`);

    const fileStream = fs.createReadStream(tmpFile);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      fs.unlinkSync(tmpFile);
    });
  } catch (error) {
    console.error('Error al generar reporte CSV de inventario:', error);
    res.status(500).json({ error: 'Error al generar reporte CSV de inventario' });
  }
}

// Generar reporte de KPIs en PDF
export async function generarReporteKPIsPDF(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);

    const totalOrdenes = ordenes.length;
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA').length;
    const ordenesEnProgreso = ordenes.filter(o => o.estado === 'EN_PROGRESO').length;
    const ordenesPendientes = ordenes.filter(o => o.estado === 'PENDIENTE').length;
    const ordenesCriticas = ordenes.filter(o => o.prioridad === 'CRITICA').length;
    
    const tasaCompletadas = totalOrdenes > 0 ? ((ordenesCompletadas / totalOrdenes) * 100).toFixed(2) : '0';

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=kpis-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Indicadores de Mantenimiento (KPIs)', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${periodo}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // KPIs
    doc.fontSize(14).text('Indicadores Clave:', { underline: true });
    doc.moveDown();
    
    doc.fontSize(12)
      .text(`• Total de órdenes de trabajo: ${totalOrdenes}`)
      .text(`• Órdenes completadas: ${ordenesCompletadas} (${tasaCompletadas}%)`)
      .text(`• Órdenes en progreso: ${ordenesEnProgreso}`)
      .text(`• Órdenes pendientes: ${ordenesPendientes}`)
      .text(`• Órdenes críticas: ${ordenesCriticas}`)
      .moveDown();

    // Distribución por tipo
    const tiposCount = ordenes.reduce((acc, orden) => {
      acc[orden.tipo] = (acc[orden.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    doc.fontSize(14).text('Distribución por Tipo de Mantenimiento:', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    Object.entries(tiposCount).forEach(([tipo, count]) => {
      const porcentaje = totalOrdenes > 0 ? ((count / totalOrdenes) * 100).toFixed(2) : '0';
      doc.text(`• ${tipo}: ${count} (${porcentaje}%)`);
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar reporte KPIs PDF:', error);
    res.status(500).json({ error: 'Error al generar reporte KPIs PDF' });
  }
}

// Generar reporte de KPIs en Excel
export async function generarReporteKPIsExcel(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);

    const totalOrdenes = ordenes.length;
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA').length;
    const ordenesEnProgreso = ordenes.filter(o => o.estado === 'EN_PROGRESO').length;
    const ordenesPendientes = ordenes.filter(o => o.estado === 'PENDIENTE').length;
    const ordenesCriticas = ordenes.filter(o => o.prioridad === 'CRITICA').length;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('KPIs');

    // Título
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = 'Indicadores de Mantenimiento (KPIs)';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Resumen
    worksheet.getCell('A3').value = 'Indicador';
    worksheet.getCell('B3').value = 'Valor';
    worksheet.getRow(3).font = { bold: true };

    worksheet.addRow(['Total de órdenes', totalOrdenes]);
    worksheet.addRow(['Órdenes completadas', ordenesCompletadas]);
    worksheet.addRow(['Órdenes en progreso', ordenesEnProgreso]);
    worksheet.addRow(['Órdenes pendientes', ordenesPendientes]);
    worksheet.addRow(['Órdenes críticas', ordenesCriticas]);

    // Ajustar anchos
    worksheet.getColumn('A').width = 30;
    worksheet.getColumn('B').width = 15;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=kpis-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar reporte KPIs Excel:', error);
    res.status(500).json({ error: 'Error al generar reporte KPIs Excel' });
  }
}

// Generar reporte de KPIs en CSV
export async function generarReporteKPIsCSV(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);

    const totalOrdenes = ordenes.length;
    const ordenesCompletadas = ordenes.filter(o => o.estado === 'COMPLETADA').length;
    const ordenesEnProgreso = ordenes.filter(o => o.estado === 'EN_PROGRESO').length;
    const ordenesPendientes = ordenes.filter(o => o.estado === 'PENDIENTE').length;
    const ordenesCriticas = ordenes.filter(o => o.prioridad === 'CRITICA').length;

    const tmpFile = path.join(os.tmpdir(), `kpis-${Date.now()}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: tmpFile,
      header: [
        { id: 'indicador', title: 'Indicador' },
        { id: 'valor', title: 'Valor' }
      ]
    });

    const records = [
      { indicador: 'Total de órdenes', valor: totalOrdenes },
      { indicador: 'Órdenes completadas', valor: ordenesCompletadas },
      { indicador: 'Órdenes en progreso', valor: ordenesEnProgreso },
      { indicador: 'Órdenes pendientes', valor: ordenesPendientes },
      { indicador: 'Órdenes críticas', valor: ordenesCriticas }
    ];

    await csvWriter.writeRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=kpis-${Date.now()}.csv`);

    const fileStream = fs.createReadStream(tmpFile);
    fileStream.pipe(res);
    fileStream.on('end', () => {
      fs.unlinkSync(tmpFile);
    });
  } catch (error) {
    console.error('Error al generar reporte KPIs CSV:', error);
    res.status(500).json({ error: 'Error al generar reporte KPIs CSV' });
  }
}

// Función auxiliar para calcular días trabajados
function calcularDiasTrabajados(fechaInicio: Date | null, fechaFin: Date | null): number {
  if (!fechaInicio || !fechaFin) return 0;
  const diff = new Date(fechaFin).getTime() - new Date(fechaInicio).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Función auxiliar para calcular costos según prioridad (COP - Pesos colombianos)
function calcularCostosDiarios(prioridad: string, tipo: string): { manoObra: number; estimadoRepuestos: number } {
  const costosTecnico = {
    BAJA: 150000,      // $150,000 COP/día
    MEDIA: 200000,     // $200,000 COP/día
    ALTA: 300000,      // $300,000 COP/día
    CRITICA: 450000    // $450,000 COP/día
  };

  const costosRepuestos = {
    PREVENTIVO: { BAJA: 100000, MEDIA: 200000, ALTA: 350000, CRITICA: 500000 },
    CORRECTIVO: { BAJA: 300000, MEDIA: 500000, ALTA: 800000, CRITICA: 1500000 },
    PREDICTIVO: { BAJA: 150000, MEDIA: 250000, ALTA: 400000, CRITICA: 600000 }
  };

  return {
    manoObra: costosTecnico[prioridad as keyof typeof costosTecnico] || 200000,
    estimadoRepuestos: costosRepuestos[tipo as keyof typeof costosRepuestos]?.[prioridad as keyof typeof costosTecnico] || 200000
  };
}

// Generar reporte de tiempo de técnicos en PDF
export async function generarReporteTiempoTecnicosPDF(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);
    
    // Agrupar por técnico
    const tecnicosMap = new Map<string, any>();
    
    ordenes.forEach(orden => {
      const tecnicoNombre = orden.tecnicoAsignado?.nombre || 'No asignado';
      const dias = calcularDiasTrabajados(orden.fechaInicio, orden.fechaFin);
      
      if (!tecnicosMap.has(tecnicoNombre)) {
        tecnicosMap.set(tecnicoNombre, {
          nombre: tecnicoNombre,
          totalOrdenes: 0,
          diasTrabajados: 0,
          ordenesCompletadas: 0,
          ordenesPendientes: 0,
          ordenes: []
        });
      }
      
      const tecnico = tecnicosMap.get(tecnicoNombre);
      tecnico.totalOrdenes++;
      tecnico.diasTrabajados += dias;
      if (orden.estado === 'COMPLETADA') tecnico.ordenesCompletadas++;
      if (orden.estado === 'PENDIENTE') tecnico.ordenesPendientes++;
      tecnico.ordenes.push({
        id: orden.id,
        equipo: orden.equipo,
        dias,
        estado: orden.estado,
        fechaInicio: orden.fechaInicio,
        fechaFin: orden.fechaFin
      });
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tiempo-tecnicos-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Tiempo de Técnicos por Días', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${periodo}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Detalles por técnico
    tecnicosMap.forEach((tecnico, nombre) => {
      if (doc.y > 650) doc.addPage();
      
      doc.fontSize(14).text(`Técnico: ${nombre}`, { underline: true, bold: true });
      doc.fontSize(10)
        .text(`Total de órdenes: ${tecnico.totalOrdenes}`)
        .text(`Días trabajados: ${tecnico.diasTrabajados}`)
        .text(`Órdenes completadas: ${tecnico.ordenesCompletadas}`)
        .text(`Órdenes pendientes: ${tecnico.ordenesPendientes}`)
        .moveDown(0.5);

      doc.fontSize(11).text('Detalle de órdenes:', { bold: true });
      tecnico.ordenes.forEach((orden: any, idx: number) => {
        if (doc.y > 700) doc.addPage();
        doc.fontSize(9)
          .text(`  ${idx + 1}. ${orden.id} - ${orden.equipo}`)
          .text(`     Días: ${orden.dias} | Estado: ${orden.estado}`)
          .text(`     Inicio: ${orden.fechaInicio ? new Date(orden.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}`)
          .text(`     Fin: ${orden.fechaFin ? new Date(orden.fechaFin).toLocaleDateString('es-ES') : 'N/A'}`);
      });
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar reporte de tiempo de técnicos PDF:', error);
    res.status(500).json({ error: 'Error al generar reporte de tiempo de técnicos PDF' });
  }
}

// Generar reporte de costos de mantenimiento en PDF
export async function generarReporteCostosMantenimientoPDF(req: Request, res: Response) {
  try {
    const { periodo = 'mes' } = req.query;
    const ordenes = await getOrdenesData(periodo as string);
    
    let costoTotalManoObra = 0;
    let costoTotalRepuestos = 0;
    
    const ordenesConCostos = ordenes.map(orden => {
      const dias = calcularDiasTrabajados(orden.fechaInicio, orden.fechaFin);
      const costos = calcularCostosDiarios(orden.prioridad, orden.tipo);
      const costoManoObra = costos.manoObra * dias;
      const costoRepuestos = costos.estimadoRepuestos;
      const costoTotal = costoManoObra + costoRepuestos;
      
      costoTotalManoObra += costoManoObra;
      costoTotalRepuestos += costoRepuestos;
      
      return {
        ...orden,
        dias,
        costoManoObra,
        costoRepuestos,
        costoTotal
      };
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=costos-mantenimiento-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Reporte de Costos de Mantenimiento', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${periodo}`, { align: 'center' });
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Resumen
    doc.fontSize(14).text('Resumen de Costos (COP):', { underline: true });
    doc.fontSize(11)
      .text(`Costo total mano de obra: $${costoTotalManoObra.toLocaleString('es-CO')}`)
      .text(`Costo total repuestos: $${costoTotalRepuestos.toLocaleString('es-CO')}`)
      .text(`COSTO TOTAL: $${(costoTotalManoObra + costoTotalRepuestos).toLocaleString('es-CO')}`, { bold: true })
      .moveDown();

    // Detalle por orden
    doc.fontSize(12).text('Detalle por Orden:', { underline: true });
    doc.moveDown(0.5);
    
    ordenesConCostos.forEach((orden, index) => {
      if (doc.y > 650) doc.addPage();
      
      doc.fontSize(10)
        .text(`${index + 1}. ${orden.id} - ${orden.equipo}`, { bold: true })
        .text(`   Tipo: ${orden.tipo} | Prioridad: ${orden.prioridad} | Estado: ${orden.estado}`)
        .text(`   Días trabajados: ${orden.dias}`)
        .text(`   Mano de obra: $${orden.costoManoObra.toLocaleString('es-CO')}`)
        .text(`   Repuestos: $${orden.costoRepuestos.toLocaleString('es-CO')}`)
        .text(`   TOTAL: $${orden.costoTotal.toLocaleString('es-CO')}`, { bold: true })
        .moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar reporte de costos PDF:', error);
    res.status(500).json({ error: 'Error al generar reporte de costos PDF' });
  }
}

// Generar reporte de historial de equipos en PDF
export async function generarReporteHistorialEquiposPDF(req: Request, res: Response) {
  try {
    const ordenes = await prisma.ordenTrabajo.findMany({
      include: {
        tecnicoAsignado: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        equipo: 'asc'
      }
    });
    
    // Agrupar por equipo
    const equiposMap = new Map<string, any>();
    
    ordenes.forEach(orden => {
      if (!equiposMap.has(orden.equipo)) {
        equiposMap.set(orden.equipo, {
          nombre: orden.equipo,
          totalIntervenciones: 0,
          intervencionesCriticas: 0,
          intervencionesAltas: 0,
          intervencionesMedias: 0,
          intervencionesBajas: 0,
          diasTotales: 0,
          completadas: 0,
          pendientes: 0,
          enProgreso: 0,
          historial: []
        });
      }
      
      const equipo = equiposMap.get(orden.equipo);
      equipo.totalIntervenciones++;
      
      // Contar por prioridad
      if (orden.prioridad === 'CRITICA') equipo.intervencionesCriticas++;
      if (orden.prioridad === 'ALTA') equipo.intervencionesAltas++;
      if (orden.prioridad === 'MEDIA') equipo.intervencionesMedias++;
      if (orden.prioridad === 'BAJA') equipo.intervencionesBajas++;
      
      // Contar por estado
      if (orden.estado === 'COMPLETADA') equipo.completadas++;
      if (orden.estado === 'PENDIENTE') equipo.pendientes++;
      if (orden.estado === 'EN_PROGRESO') equipo.enProgreso++;
      
      const dias = calcularDiasTrabajados(orden.fechaInicio, orden.fechaFin);
      equipo.diasTotales += dias;
      
      equipo.historial.push({
        id: orden.id,
        tipo: orden.tipo,
        prioridad: orden.prioridad,
        estado: orden.estado,
        dias,
        tecnico: orden.tecnicoAsignado?.nombre || 'No asignado',
        fechaInicio: orden.fechaInicio,
        fechaFin: orden.fechaFin,
        descripcion: orden.descripcion
      });
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=historial-equipos-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('Historial de Equipos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);

    // Detalles por equipo
    equiposMap.forEach((equipo, nombre) => {
      doc.addPage();
      
      doc.fontSize(16).text(`Equipo: ${nombre}`, { underline: true, bold: true });
      doc.moveDown();
      
      doc.fontSize(11).text('Estadísticas:', { bold: true });
      doc.fontSize(10)
        .text(`Total de intervenciones: ${equipo.totalIntervenciones}`)
        .text(`Días totales de mantenimiento: ${equipo.diasTotales}`)
        .moveDown(0.5);
      
      doc.fontSize(10).text('Por prioridad:');
      doc.fontSize(9)
        .text(`  Críticas: ${equipo.intervencionesCriticas}`)
        .text(`  Altas: ${equipo.intervencionesAltas}`)
        .text(`  Medias: ${equipo.intervencionesMedias}`)
        .text(`  Bajas: ${equipo.intervencionesBajas}`)
        .moveDown(0.5);
      
      doc.fontSize(10).text('Por estado:');
      doc.fontSize(9)
        .text(`  Completadas: ${equipo.completadas}`)
        .text(`  En progreso: ${equipo.enProgreso}`)
        .text(`  Pendientes: ${equipo.pendientes}`)
        .moveDown();

      doc.fontSize(11).text('Historial de intervenciones:', { bold: true });
      doc.moveDown(0.5);
      
      equipo.historial.forEach((intervencion: any, idx: number) => {
        if (doc.y > 650) doc.addPage();
        
        doc.fontSize(9)
          .text(`${idx + 1}. Orden ${intervencion.id} - ${intervencion.tipo}`, { bold: true })
          .text(`   Prioridad: ${intervencion.prioridad} | Estado: ${intervencion.estado}`)
          .text(`   Técnico: ${intervencion.tecnico}`)
          .text(`   Días empleados: ${intervencion.dias}`)
          .text(`   Inicio: ${intervencion.fechaInicio ? new Date(intervencion.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}`)
          .text(`   Fin: ${intervencion.fechaFin ? new Date(intervencion.fechaFin).toLocaleDateString('es-ES') : 'N/A'}`)
          .text(`   Descripción: ${intervencion.descripcion || 'N/A'}`)
          .moveDown(0.5);
      });
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar historial de equipos PDF:', error);
    res.status(500).json({ error: 'Error al generar historial de equipos PDF' });
  }
}

export const exportarReporte = async (req: Request, res: Response) => {
  try {
    const { tipo, formato } = req.query; // tipo: 'ordenes' | 'inventario' | 'tecnicos'
    
    // En modo demo, retornar un CSV simple
    if (formato === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=reporte_${tipo}_${Date.now()}.csv`);
      
      if (tipo === 'ordenes') {
        const csv = 'ID,Título,Tipo,Estado,Prioridad,Técnico,Fecha Creación\n' +
          'orden-001,Reparación bomba hidráulica,CORRECTIVO,PENDIENTE,ALTA,Técnico Demo,2025-12-10\n' +
          'orden-002,Mantenimiento preventivo motor,PREVENTIVO,EN_PROGRESO,MEDIA,Técnico Demo,2025-12-12\n';
        return res.send(csv);
      }
      
      if (tipo === 'inventario') {
        const csv = 'Código,Nombre,Categoría,Cantidad,Stock Mínimo,Ubicación\n' +
          'REP-HYD-001,Sello mecánico bomba,Repuestos,15,5,Bodega A - Estante 12\n' +
          'HER-LLV-015,Llave dinamométrica,Herramientas,3,2,Taller - Gabinete 3\n';
        return res.send(csv);
      }
    }

    res.status(400).json({ message: 'Formato no soportado' });
  } catch (error) {
    console.error('Error al exportar reporte:', error);
    res.status(500).json({ message: 'Error al exportar reporte' });
  }
};
