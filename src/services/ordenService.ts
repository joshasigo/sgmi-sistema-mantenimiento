import api from './api';

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

// Headers manejados automáticamente por api.ts

export const ordenService = {
  getOrdenes: async (): Promise<OrdenTrabajo[]> => {
    const response = await api.get('/ordenes');
    return response.data.ordenes || response.data;
  },

  getOrdenById: async (id: string): Promise<OrdenTrabajo> => {
    const response = await api.get(`/ordenes/${id}`);
    return response.data.orden || response.data;
  },

  createOrden: async (data: CreateOrdenData): Promise<OrdenTrabajo> => {
    const response = await api.post('/ordenes', data);
    return response.data.orden || response.data;
  },

  updateOrden: async (id: string, data: UpdateOrdenData): Promise<OrdenTrabajo> => {
    const response = await api.put(`/ordenes/${id}`, data);
    return response.data.orden || response.data;
  },

  deleteOrden: async (id: string): Promise<void> => {
    await api.delete(`/ordenes/${id}`);
  }
};
