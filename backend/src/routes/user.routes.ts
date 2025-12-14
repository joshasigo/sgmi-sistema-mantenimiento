import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles
} from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/roleMiddleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/users
 * @desc    Listar todos los usuarios
 * @access  Private (permiso: usuarios.ver)
 * @query   ?search=texto&estado=ACTIVO&rolId=1
 */
router.get('/', requirePermission('usuarios', 'ver'), getUsers);

/**
 * @route   GET /api/users/roles
 * @desc    Listar todos los roles disponibles
 * @access  Private
 */
router.get('/roles', getRoles);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Private (permiso: usuarios.ver)
 */
router.get('/:id', requirePermission('usuarios', 'ver'), getUserById);

/**
 * @route   POST /api/users
 * @desc    Crear nuevo usuario
 * @access  Private (permiso: usuarios.crear)
 * @body    { nombre, email, password, rolId, departamento? }
 */
router.post('/', requirePermission('usuarios', 'crear'), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private (permiso: usuarios.editar)
 * @body    { nombre?, email?, rolId?, departamento?, estado?, password? }
 */
router.put('/:id', requirePermission('usuarios', 'editar'), updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario
 * @access  Private (permiso: usuarios.eliminar)
 */
router.delete('/:id', requirePermission('usuarios', 'eliminar'), deleteUser);

export default router;
