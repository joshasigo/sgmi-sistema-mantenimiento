import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

// Usuarios DEMO (solo lectura - para visualización)
const DEMO_USERS = [
  {
    id: 'demo-visualizador-001',
    nombre: 'Visualizador Demo',
    email: 'admin@demo.com',
    password: 'admin123',
    rol: 'Visualizador',
    departamento: 'Demo',
    permisos: {
      ordenes: { crear: false, editar: false, eliminar: false, ver: true },
      usuarios: { crear: false, editar: false, eliminar: false, ver: true },
      inventario: { crear: false, editar: false, ver: true },
      reportes: { generar: false, exportar: false, ver: true }
    }
  },
  {
    id: 'demo-visualizador-002',
    nombre: 'Supervisor Demo',
    email: 'supervisor@demo.com',
    password: 'super123',
    rol: 'Visualizador',
    departamento: 'Demo',
    permisos: {
      ordenes: { crear: false, editar: false, eliminar: false, ver: true },
      usuarios: { crear: false, editar: false, eliminar: false, ver: true },
      inventario: { crear: false, editar: false, ver: true },
      reportes: { generar: false, exportar: false, ver: true }
    }
  },
  {
    id: 'demo-visualizador-003',
    nombre: 'Técnico Demo',
    email: 'tecnico@demo.com',
    password: 'tecnico123',
    rol: 'Visualizador',
    departamento: 'Demo',
    permisos: {
      ordenes: { crear: false, editar: false, eliminar: false, ver: true },
      usuarios: { crear: false, editar: false, eliminar: false, ver: true },
      inventario: { crear: false, editar: false, ver: true },
      reportes: { generar: false, exportar: false, ver: true }
    }
  }
];

// ==================== LOGIN ====================
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, demoMode } = req.body;

    if (!email || !password) {
      return next(new AppError('Email y contraseña son requeridos', 400));
    }

    // Modo DEMO
    if (demoMode || process.env.DEMO_MODE === 'true') {
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const token = jwt.sign(
          {
            userId: demoUser.id,
            email: demoUser.email,
            rol: demoUser.rol,
            permisos: demoUser.permisos,
            isDemo: true
          },
          process.env.JWT_SECRET!,
          { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );

        return res.json({
          success: true,
          token,
          user: {
            id: demoUser.id,
            nombre: demoUser.nombre,
            email: demoUser.email,
            rol: demoUser.rol,
            departamento: demoUser.departamento,
            permisos: demoUser.permisos,
            isDemo: true
          },
          message: '✅ Login exitoso (Modo DEMO)'
        });
      }
    }

    // Modo PRODUCCIÓN - Base de datos real
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    });

    if (!usuario) {
      return next(new AppError('Credenciales inválidas', 401));
    }

    const validPassword = await bcrypt.compare(password, usuario.passwordHash);
    
    if (!validPassword) {
      return next(new AppError('Credenciales inválidas', 401));
    }

    if (usuario.estado !== 'ACTIVO') {
      return next(new AppError('Usuario inactivo. Contacta al administrador', 403));
    }

    // Generar tokens
    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol.nombre,
        permisos: usuario.rol.permisos,
        isDemo: false
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: usuario.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d' }
    );

    // Actualizar último acceso y refresh token
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        ultimoAcceso: new Date(),
        refreshToken
      }
    });

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre,
        departamento: usuario.departamento,
        permisos: usuario.rol.permisos,
        isDemo: false
      },
      message: '✅ Login exitoso'
    });

  } catch (error) {
    next(error);
  }
};

// ==================== REGISTER ====================
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password, rolId, departamento } = req.body;

    if (!nombre || !email || !password) {
      return next(new AppError('Todos los campos son requeridos', 400));
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next(new AppError('El email ya está registrado', 409));
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario (por defecto rol Técnico = 3)
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rolId: rolId || 3, // Default: Técnico
        departamento
      },
      include: { rol: true }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol.nombre
      }
    });

  } catch (error) {
    next(error);
  }
};

// ==================== REFRESH TOKEN ====================
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token requerido', 400));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: { rol: true }
    });

    if (!usuario || usuario.refreshToken !== refreshToken) {
      return next(new AppError('Refresh token inválido', 403));
    }

    // Generar nuevo access token
    const newToken = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol.nombre,
        permisos: usuario.rol.permisos
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    next(new AppError('Refresh token inválido o expirado', 403));
  }
};

// ==================== LOGOUT ====================
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.isDemo) {
      return res.json({
        success: true,
        message: 'Logout exitoso (Demo)'
      });
    }

    // Limpiar refresh token en BD
    await prisma.usuario.update({
      where: { id: req.user.userId },
      data: { refreshToken: null }
    });

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    next(error);
  }
};

// ==================== OBTENER USUARIO ACTUAL ====================
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    // Usuario DEMO
    if (req.user.isDemo) {
      const demoUser = DEMO_USERS.find(u => u.id === req.user!.userId);
      return res.json({
        success: true,
        user: demoUser
      });
    }

    // Usuario REAL
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.userId },
      include: { rol: true },
      select: {
        id: true,
        nombre: true,
        email: true,
        departamento: true,
        estado: true,
        ultimoAcceso: true,
        rol: {
          select: {
            nombre: true,
            permisos: true
          }
        }
      }
    });

    if (!usuario) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    res.json({
      success: true,
      user: {
        ...usuario,
        rol: usuario.rol.nombre,
        permisos: usuario.rol.permisos
      }
    });

  } catch (error) {
    next(error);
  }
};
