import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService, { User, LoginCredentials } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  checkAuth: () => void;
  
  // Permissions
  hasPermission: (modulo: string, accion: string) => boolean;
  isAdmin: () => boolean;
  isSupervisor: () => boolean;
  isTechnician: () => boolean;
  isDemoMode: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Error en logout:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const isAuth = authService.isAuthenticated();
        const user = authService.getStoredUser();
        set({
          isAuthenticated: isAuth,
          user: user,
          token: localStorage.getItem('token')
        });
      },

      // Permissions helpers
      hasPermission: (modulo: string, accion: string) => {
        const { user } = get();
        if (!user || !user.permisos) return false;
        return user.permisos[modulo]?.[accion] || false;
      },

      isAdmin: () => {
        const { user } = get();
        return user?.rol === 'Administrador';
      },

      isSupervisor: () => {
        const { user } = get();
        return user?.rol === 'Supervisor';
      },

      isTechnician: () => {
        const { user } = get();
        return user?.rol === 'Técnico';
      },

      isDemoMode: () => {
        const { user } = get();
        return user?.isDemo || false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
