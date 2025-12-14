import { Request, Response } from 'express';
import prisma from '../config/database.js';
import { TipoOrden, Prioridad, EstadoOrden } from '@prisma/client';

// Datos demo para modo sin base de datos
const ordenesDemo = [
  {
    id: 'orden-001',
    tipo: 'CORRECTIVO' as TipoOrden,
    prioridad: 'ALTA' as Prioridad,
    estado: 'PENDIENTE' as EstadoOrden,
    titulo: 'Reparación bomba hidráulica',
    descripcion: 'La bomba principal presenta fugas y ruidos anormales',
    ubicacion: 'Planta 2 - Zona C',
    equipoAfectado: 'Bomba HYD-001',
    tecnicoAsignadoId: 'demo-tecnico-001',
    supervisorId: 'demo-supervisor-001',
    fechaCreacion: new Date('2025-12-10'),
    fechaInicio: new Date('2025-12-11'),
    fechaEstimada: new Date('2025-12-15'),
    horasEstimadas: 8,
    horasReales: 6
  },
  {
    id: 'orden-002',
    tipo: 'PREVENTIVO' as TipoOrden,
    prioridad: 'MEDIA' as Prioridad,
    estado: 'EN_PROGRESO' as EstadoOrden,
    titulo: 'Mantenimiento preventivo motor eléctrico',
    descripcion: 'Revisión trimestral según protocolo MP-003',
    ubicacion: 'Planta 1 - Zona A',
    equipoAfectado: 'Motor MTR-045',
    tecnicoAsignadoId: 'demo-tecnico-001',
    supervisorId: 'demo-supervisor-001',
    fechaCreacion: new Date('2025-12-12'),
    fechaInicio: new Date('2025-12-13'),
    fechaEstimada: new Date('2025-12-14'),
    horasEstimadas: 4,
    horasReales: 3
  },
  {
    id: 'orden-003',
    tipo: 'MEJORA' as TipoOrden,
    prioridad: 'BAJA' as Prioridad,
    estado: 'COMPLETADA' as EstadoOrden,
    titulo: 'Actualización sistema de lubricación',
    descripcion: 'Instalación de sistema de lubricación automática',
    ubicacion: 'Planta 3 - Zona B',
    equipoAfectado: 'Compresor CMP-012',
    tecnicoAsignadoId: 'demo-tecnico-001',
    supervisorId: 'demo-supervisor-001',
    fechaCreacion: new Date('2025-12-01'),
    fechaInicio: new Date('2025-12-05'),
    fechaEstimada: new Date('2025-12-08'),
    fechaCompletada: new Date('2025-12-08'),
    horasEstimadas: 12,
    horasReales: 10
  }
];

const demoMode = process.env.DEMO_MODE === 'true';

export const getOrdenes = async (req: Request, res: Response) => {
  try {
    if (demoMode) {
      return res.json({ ordenes: ordenesDemo });
    }

    const ordenes = await prisma.ordenTrabajo.findMany({
      include: {
        tecnicoAsignado: {
          select: { id: true, nombre: true, email: true }
        },
        creadoPor: {
          select: { id: true, nombre: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ordenes });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes de trabajo' });
  }
};

export const getOrdenById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (demoMode) {
      const orden = ordenesDemo.find(o => o.id === id);
      if (!orden) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
      return res.json(orden);
    }

    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id },
      include: {
        tecnicoAsignado: {
          select: { id: true, nombre: true, email: true }
        },
        creadoPor: {
          select: { id: true, nombre: true, email: true }
        }
      }
    });

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json({ orden });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ message: 'Error al obtener la orden de trabajo' });
  }
};

export const createOrden = async (req: Request, res: Response) => {
  try {
    const {
      equipo,
      tipo,
      prioridad,
      estado,
      descripcion,
      tecnicoAsignadoId,
      progreso,
      fechaInicio,
      fechaFin
    } = req.body;

    // Obtener el ID del usuario actual del token
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Generar ID único basado en el último ID en la base de datos
    // Buscar todas las órdenes que empiezan con 'OT-' y extraer el número más alto
    const ultimasOrdenes = await prisma.ordenTrabajo.findMany({
      where: {
        id: {
          startsWith: 'OT-'
        }
      },
      orderBy: {
        id: 'desc'
      },
      take: 1
    });

    let siguienteNumero = 1;
    if (ultimasOrdenes.length > 0) {
      // Extraer el número del último ID (ej: 'OT-005' -> 5)
      const ultimoId = ultimasOrdenes[0].id;
      const numeroActual = parseInt(ultimoId.replace('OT-', ''));
      siguienteNumero = numeroActual + 1;
    }

    // Formatear el ID con padding de 3 dígitos
    const ordenId = `OT-${String(siguienteNumero).padStart(3, '0')}`;

    const orden = await prisma.ordenTrabajo.create({
      data: {
        id: ordenId,
        equipo,
        tipo: tipo as TipoOrden,
        prioridad: prioridad as Prioridad,
        estado: estado as EstadoOrden || 'PENDIENTE',
        descripcion,
        tecnicoAsignadoId,
        progreso: progreso || 0,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        creadoPorId: userId
      },
      include: {
        tecnicoAsignado: {
          select: { id: true, nombre: true, email: true }
        },
        creadoPor: {
          select: { id: true, nombre: true }
        }
      }
    });

    res.status(201).json({ orden });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al crear la orden de trabajo' });
  }
};

export const updateOrden = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convertir fechas si vienen como string
    if (updateData.fechaInicio) {
      updateData.fechaInicio = new Date(updateData.fechaInicio);
    }
    if (updateData.fechaFin) {
      updateData.fechaFin = new Date(updateData.fechaFin);
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id },
      data: updateData,
      include: {
        tecnicoAsignado: {
          select: { id: true, nombre: true, email: true }
        },
        creadoPor: {
          select: { id: true, nombre: true }
        }
      }
    });

    res.json({ orden });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ message: 'Error al actualizar la orden de trabajo' });
  }
};

export const deleteOrden = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.ordenTrabajo.delete({
      where: { id }
    });

    res.json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ message: 'Error al eliminar la orden de trabajo' });
  }
};

export const updateEstadoOrden = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (demoMode) {
      const index = ordenesDemo.findIndex(o => o.id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
      ordenesDemo[index].estado = estado as EstadoOrden;
      if (estado === 'EN_PROGRESO' && !ordenesDemo[index].fechaInicio) {
        ordenesDemo[index].fechaInicio = new Date();
      }
      if (estado === 'COMPLETADA') {
        ordenesDemo[index].fechaCompletada = new Date();
      }
      return res.json(ordenesDemo[index]);
    }

    const updateData: any = { estado: estado as EstadoOrden };
    
    if (estado === 'EN_PROGRESO') {
      updateData.fechaInicio = new Date();
    }
    if (estado === 'COMPLETADA') {
      updateData.fechaCompletada = new Date();
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id },
      data: updateData,
      include: {
        tecnicoAsignado: {
          select: { id: true, nombre: true, email: true }
        },
        supervisor: {
          select: { id: true, nombre: true, email: true }
        }
      }
    });

    res.json(orden);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la orden' });
  }
};
