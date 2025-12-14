import api from './api';

export interface DashboardStats {
  ordenesActivas: number;
  ordenesCompletadas: number;
  ordenesCriticas: number;
  equiposEnMantenimiento: number;
  totalInventario: number;
}

export interface OrdenReciente {
  id: string;
  equipo: string;
  tipo: string;
  prioridad: string;
  estado: string;
  progreso: number;
  tecnicoAsignado?: {
    nombre: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  ordenesRecientes: OrdenReciente[];
}

class DashboardService {
  async getStats(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/dashboard/stats');
    return response.data;
  }
}

export default new DashboardService();
