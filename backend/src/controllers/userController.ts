import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';

// ==================== LISTAR USUARIOS ====================
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, estado, rolId } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (estado) {
      where.estado = estado;
    }

    if (rolId) {
      where.rolId = parseInt(rolId as string);
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      include: {
        rol: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: usuarios.length,
      users: usuarios
    });

  } catch (error) {
    next(error);
  }
};

// ==================== OBTENER USUARIO POR ID ====================
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        departamento: true,
        estado: true,
        ultimoAcceso: true,
        createdAt: true,
        rol: {
          select: {
            id: true,
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
      usuario
    });

  } catch (error) {
    next(error);
  }
};

// ==================== CREAR USUARIO ====================
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password, rolId, departamento } = req.body;

    if (!nombre || !email || !password || !rolId) {
      return next(new AppError('Campos requeridos: nombre, email, password, rolId', 400));
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next(new AppError('El email ya está registrado', 409));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rolId: parseInt(rolId),
        departamento
      },
      include: {
        rol: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        departamento: usuario.departamento
      }
    });

  } catch (error) {
    next(error);
  }
};

// ==================== ACTUALIZAR USUARIO ====================
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, email, rolId, departamento, estado, password } = req.body;

    console.log('📝 Actualización de usuario recibida:', { id, nombre, email, rolId, departamento, estado });

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    const updateData: any = {};

    if (nombre !== undefined) updateData.nombre = nombre;
    if (email !== undefined) updateData.email = email;
    if (rolId !== undefined) {
      const parsedRolId = parseInt(rolId as string);
      if (isNaN(parsedRolId)) {
        return next(new AppError('rolId debe ser un número válido', 400));
      }
      updateData.rolId = parsedRolId;
      console.log('✅ rolId parseado correctamente:', parsedRolId);
    }
    if (departamento !== undefined) updateData.departamento = departamento;
    if (estado !== undefined) updateData.estado = estado;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    console.log('📤 Datos a actualizar en BD:', updateData);

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: updateData,
      include: {
        rol: {
          select: {
            id: true,
            nombre: true,
            permisos: true
          }
        }
      }
    });

    console.log('✅ Usuario actualizado exitosamente en BD:', { 
      id: updatedUser.id, 
      nombre: updatedUser.nombre, 
      rol: updatedUser.rol?.nombre 
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        departamento: updatedUser.departamento,
        estado: updatedUser.estado,
        ultimoAcceso: updatedUser.ultimoAcceso,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
};

// ==================== ELIMINAR USUARIO ====================
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    await prisma.usuario.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// ==================== LISTAR ROLES ====================
export const getRoles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await prisma.rol.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        permisos: true
      }
    });

    res.json({
      success: true,
      roles
    });

  } catch (error) {
    next(error);
  }
};
