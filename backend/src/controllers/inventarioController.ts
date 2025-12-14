import { Request, Response } from 'express';
import prisma from '../config/database.js';

// Datos demo para modo sin base de datos
const inventarioDemo = [
  {
    id: 'inv-001',
    codigo: 'REP-HYD-001',
    nombre: 'Sello mecánico bomba hidráulica',
    descripcion: 'Sello mecánico para bomba serie HYD',
    categoria: 'Repuestos',
    ubicacion: 'Bodega A - Estante 12',
    cantidadActual: 15,
    cantidadMinima: 5,
    cantidadMaxima: 30,
    unidadMedida: 'unidades',
    precioUnitario: 125000,
    proveedor: 'Hidráulica Industrial Ltda',
    fechaUltimaActualizacion: new Date('2025-12-10'),
    estado: 'disponible'
  },
  {
    id: 'inv-002',
    codigo: 'HER-LLV-015',
    nombre: 'Llave dinamométrica 1/2"',
    descripcion: 'Llave dinamométrica 10-150 Nm',
    categoria: 'Herramientas',
    ubicacion: 'Taller - Gabinete 3',
    cantidadActual: 3,
    cantidadMinima: 2,
    cantidadMaxima: 5,
    unidadMedida: 'unidades',
    precioUnitario: 380000,
    proveedor: 'Herramientas Profesionales SAS',
    fechaUltimaActualizacion: new Date('2025-12-12'),
    estado: 'disponible'
  },
  {
    id: 'inv-003',
    codigo: 'LUB-MOT-020',
    nombre: 'Aceite motor SAE 15W-40',
    descripcion: 'Aceite sintético para motores industriales',
    categoria: 'Lubricantes',
    ubicacion: 'Bodega B - Zona líquidos',
    cantidadActual: 2,
    cantidadMinima: 10,
    cantidadMaxima: 50,
    unidadMedida: 'galones',
    precioUnitario: 65000,
    proveedor: 'Lubricantes Industriales SA',
    fechaUltimaActualizacion: new Date('2025-12-13'),
    estado: 'bajo_stock'
  },
  {
    id: 'inv-004',
    codigo: 'REP-MTR-088',
    nombre: 'Rodamiento 6205',
    descripcion: 'Rodamiento rígido de bolas 25x52x15mm',
    categoria: 'Repuestos',
    ubicacion: 'Bodega A - Estante 8',
    cantidadActual: 45,
    cantidadMinima: 20,
    cantidadMaxima: 100,
    unidadMedida: 'unidades',
    precioUnitario: 28000,
    proveedor: 'Rodamientos y Transmisiones',
    fechaUltimaActualizacion: new Date('2025-12-11'),
    estado: 'disponible'
  }
];

const demoMode = process.env.DEMO_MODE === 'true';

export const getInventario = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.itemInventario.findMany({
      orderBy: { nombre: 'asc' }
    });

    res.json({ items });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ message: 'Error al obtener el inventario' });
  }
};

export const getInventarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);

    const item = await prisma.itemInventario.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ message: 'Error al obtener el item' });
  }
};

export const createInventario = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      codigo,
      categoria,
      cantidad,
      ubicacion,
      proveedor,
      stockMinimo
    } = req.body;

    const item = await prisma.itemInventario.create({
      data: {
        nombre,
        codigo,
        categoria,
        cantidad: cantidad || 0,
        ubicacion,
        proveedor,
        stockMinimo: stockMinimo || 0
      }
    });

    res.status(201).json({ item });
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ message: 'Error al crear el item' });
  }
};

export const updateInventario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);
    const updateData = req.body;

    const item = await prisma.itemInventario.update({
      where: { id: itemId },
      data: updateData
    });

    res.json({ item });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ message: 'Error al actualizar el item' });
  }
};

export const deleteInventario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itemId = parseInt(id);

    await prisma.itemInventario.delete({
      where: { id: itemId }
    });

    res.json({ message: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ message: 'Error al eliminar el item' });
  }
};

export const ajustarCantidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo, motivo } = req.body; // tipo: 'entrada' | 'salida'

    if (demoMode) {
      const index = inventarioDemo.findIndex(i => i.id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }

      const item = inventarioDemo[index];
      const nuevaCantidad = tipo === 'entrada' 
        ? item.cantidadActual + cantidad 
        : item.cantidadActual - cantidad;

      if (nuevaCantidad < 0) {
        return res.status(400).json({ message: 'Cantidad insuficiente en inventario' });
      }

      item.cantidadActual = nuevaCantidad;
      item.fechaUltimaActualizacion = new Date();
      item.estado = nuevaCantidad < item.cantidadMinima ? 'bajo_stock' : 'disponible';

      return res.json(item);
    }

    const item = await prisma.itemInventario.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    const nuevaCantidad = tipo === 'entrada' 
      ? item.cantidadActual + cantidad 
      : item.cantidadActual - cantidad;

    if (nuevaCantidad < 0) {
      return res.status(400).json({ message: 'Cantidad insuficiente en inventario' });
    }

    const itemActualizado = await prisma.itemInventario.update({
      where: { id },
      data: {
        cantidadActual: nuevaCantidad,
        fechaUltimaActualizacion: new Date()
      }
    });

    res.json(itemActualizado);
  } catch (error) {
    console.error('Error al ajustar cantidad:', error);
    res.status(500).json({ message: 'Error al ajustar la cantidad' });
  }
};

/**
 * Obtiene items con stock bajo el mínimo
 * @route GET /api/inventario/bajo-stock
 * @access Private
 */
export const getBajoStock = async (_req: Request, res: Response) => {
  try {
    if (demoMode) {
      const bajoStock = inventarioDemo.filter(i => i.cantidadActual < i.cantidadMinima);
      return res.json(bajoStock);
    }

    // Obtener items donde cantidad < stockMinimo
    const items = await prisma.itemInventario.findMany({
      orderBy: { cantidad: 'asc' }
    });
    
    const bajoStock = items.filter(item => item.cantidad < item.stockMinimo);

    return res.json(bajoStock);
  } catch (error) {
    console.error('Error al obtener items bajo stock:', error);
    res.status(500).json({ message: 'Error al obtener items con bajo stock' });
  }
};
