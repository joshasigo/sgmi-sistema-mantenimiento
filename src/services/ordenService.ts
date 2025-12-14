import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface OrdenTrabajo {
  id: string;
  equipo: string;
  tipo: 'PREVENTIVO' | 'CORRECTIVO' | 'PREDICTIVO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
  descripcion: string;
  tecnicoAsignadoId?: string;
  progreso: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  creadoPorId: string;
  createdAt: Date;
  updatedAt: Date;
  tecnicoAsignado?: {
    id: string;
    nombre: string;
    email: string;
  };
  creadoPor?: {
    id: string;
    nombre: string;
  };
}

export interface CreateOrdenData {
  equipo: string;
  tipo: 'PREVENTIVO' | 'CORRECTIVO' | 'PREDICTIVO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
  descripcion: string;
  tecnicoAsignadoId?: string;
  progreso?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface UpdateOrdenData extends Partial<CreateOrdenData> {}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const ordenService = {
  getOrdenes: async (): Promise<OrdenTrabajo[]> => {
    const response = await axios.get(`${API_URL}/ordenes`, {
      headers: getAuthHeaders()
    });
    return response.data.ordenes || response.data;
  },

  getOrdenById: async (id: string): Promise<OrdenTrabajo> => {
    const response = await axios.get(`${API_URL}/ordenes/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data.orden || response.data;
  },

  createOrden: async (data: CreateOrdenData): Promise<OrdenTrabajo> => {
    const response = await axios.post(`${API_URL}/ordenes`, data, {
      headers: getAuthHeaders()
    });
    return response.data.orden || response.data;
  },

  updateOrden: async (id: string, data: UpdateOrdenData): Promise<OrdenTrabajo> => {
    const response = await axios.put(`${API_URL}/ordenes/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data.orden || response.data;
  },

  deleteOrden: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/ordenes/${id}`, {
      headers: getAuthHeaders()
    });
  }
};
