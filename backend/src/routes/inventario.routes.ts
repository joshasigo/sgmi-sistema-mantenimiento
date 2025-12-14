import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/roleMiddleware';
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  ajustarCantidad,
  getBajoStock
} from '../controllers/inventarioController';

const router = Router();

// Obtener items bajo stock
router.get('/bajo-stock',
  authenticateToken,
  requirePermission('inventario', 'ver'),
  getBajoStock
);

// Obtener todo el inventario
router.get('/',
  authenticateToken,
  requirePermission('inventario', 'ver'),
  getInventario
);

// Obtener item por ID
router.get('/:id',
  authenticateToken,
  requirePermission('inventario', 'ver'),
  getInventarioById
);

// Crear nuevo item
router.post('/',
  authenticateToken,
  requirePermission('inventario', 'crear'),
  createInventario
);

// Actualizar item
router.put('/:id',
  authenticateToken,
  requirePermission('inventario', 'editar'),
  updateInventario
);

// Ajustar cantidad (entrada/salida)
router.post('/:id/ajustar',
  authenticateToken,
  requirePermission('inventario', 'editar'),
  ajustarCantidad
);

// Eliminar item
router.delete('/:id',
  authenticateToken,
  requirePermission('inventario', 'eliminar'),
  deleteInventario
);

export default router;
