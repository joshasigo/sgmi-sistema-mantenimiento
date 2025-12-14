import api from './api';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  departamento: string;
  estado: string;
  ultimoAcceso: string | null;
  createdAt: string;
}

class UserService {
  async getUsers(): Promise<Usuario[]> {
    const response = await api.get<{ users: any[] }>('/users');
    
    // Transformar datos del backend al formato esperado por el frontend
    return response.data.users.map(user => ({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol?.nombre || 'Sin rol',
      departamento: user.departamento || 'Sin departamento',
      estado: user.estado === 'ACTIVO' ? 'Activo' : 'Inactivo',
      ultimoAcceso: user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleString('es-CO') : null,
      createdAt: user.createdAt
    }));
  }

  async getUserById(id: string): Promise<Usuario> {
    const response = await api.get<{ user: any }>(`/users/${id}`);
    const user = response.data.user;
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol?.nombre || 'Sin rol',
      departamento: user.departamento || 'Sin departamento',
      estado: user.estado === 'ACTIVO' ? 'Activo' : 'Inactivo',
      ultimoAcceso: user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleString('es-CO') : null,
      createdAt: user.createdAt
    };
  }

  async createUser(data: {
    nombre: string;
    email: string;
    password: string;
    rolId: number;
    departamento: string;
  }): Promise<Usuario> {
    const response = await api.post('/users', data);
    return response.data.usuario;
  }

  async updateUser(id: string, data: Partial<{
    nombre: string;
    email: string;
    password: string;
    rolId: number;
    departamento: string;
    estado: string;
  }>): Promise<Usuario> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.user;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export default new UserService();
