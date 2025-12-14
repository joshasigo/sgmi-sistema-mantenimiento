import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/roleMiddleware';
import {
  getOrdenes,
  getOrdenById,
  createOrden,
  updateOrden,
  deleteOrden,
  updateEstadoOrden
} from '../controllers/ordenesController';

const router = Router();

// Obtener todas las órdenes
router.get('/', 
  authenticateToken,
  requirePermission('ordenes', 'ver'),
  getOrdenes
);

// Obtener orden por ID
router.get('/:id',
  authenticateToken,
  requirePermission('ordenes', 'ver'),
  getOrdenById
);

// Crear nueva orden
router.post('/',
  authenticateToken,
  requirePermission('ordenes', 'crear'),
  createOrden
);

// Actualizar orden
router.put('/:id',
  authenticateToken,
  requirePermission('ordenes', 'editar'),
  updateOrden
);

// Actualizar solo el estado de la orden
router.patch('/:id/estado',
  authenticateToken,
  requirePermission('ordenes', 'editar'),
  updateEstadoOrden
);

// Eliminar orden
router.delete('/:id',
  authenticateToken,
  requirePermission('ordenes', 'eliminar'),
  deleteOrden
);

export default router;
