import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from './errorHandler';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new AppError('No tienes permisos para esta acción', 403));
    }

    next();
  };
};

export const requirePermission = (modulo: string, accion: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    const permisos = req.user.permisos;
    
    if (!permisos || !permisos[modulo] || !permisos[modulo][accion]) {
      return next(new AppError(`No tienes permiso para ${accion} en ${modulo}`, 403));
    }

    next();
  };
};
