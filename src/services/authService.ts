import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
  demoMode?: boolean;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rolId?: number;
  departamento?: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  departamento?: string;
  permisos: any;
  isDemo?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async register(data: RegisterData): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isDemoMode(): boolean {
    const user = this.getStoredUser();
    return user?.isDemo || false;
  }
}

export default new AuthService();
