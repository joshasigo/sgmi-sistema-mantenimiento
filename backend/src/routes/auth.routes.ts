import { Router } from 'express';
import { login, register, refreshToken, logout, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión (usuarios reales o demo)
 * @access  Public
 * @body    { email, password, demoMode?: boolean }
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public (en producción debería ser privado)
 * @body    { nombre, email, password, rolId?, departamento? }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refrescar access token
 * @access  Public
 * @body    { refreshToken }
 */
router.post('/refresh-token', refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado actual
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;
