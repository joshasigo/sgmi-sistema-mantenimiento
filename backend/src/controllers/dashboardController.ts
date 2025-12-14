import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Total de órdenes por estado
    const ordenesActivas = await prisma.ordenTrabajo.count({
      where: {
        estado: {
          in: ['PENDIENTE', 'EN_PROGRESO']
        }
      }
    });

    const ordenesCompletadas = await prisma.ordenTrabajo.count({
      where: { estado: 'COMPLETADA' }
    });

    const ordenesCriticas = await prisma.ordenTrabajo.count({
      where: { 
        prioridad: 'CRITICA',
        estado: { not: 'COMPLETADA' }
      }
    });

    // Equipos únicos en mantenimiento
    const equiposEnMantenimiento = await prisma.ordenTrabajo.groupBy({
      by: ['equipo'],
      where: {
        estado: {
          in: ['PENDIENTE', 'EN_PROGRESO']
        }
      },
      _count: true
    });

    // Total de items en inventario
    const totalInventario = await prisma.itemInventario.count();

    // Órdenes recientes (últimas 5)
    const ordenesRecientes = await prisma.ordenTrabajo.findMany({
      take: 5,
      orderBy: {
        id: 'desc'
      },
      include: {
        tecnicoAsignado: {
          select: { nombre: true }
        }
      }
    });

    res.json({
      stats: {
        ordenesActivas,
        ordenesCompletadas,
        ordenesCriticas,
        equiposEnMantenimiento: equiposEnMantenimiento.length,
        totalInventario
      },
      ordenesRecientes
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas del dashboard' });
  }
};
