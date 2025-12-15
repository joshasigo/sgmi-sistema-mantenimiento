import api from './api';

export interface ItemInventario {
  id: number;
  nombre: string;
  codigo: string;
  categoria: string;
  cantidad: number;
  ubicacion: string;
  proveedor: string;
  stockMinimo: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventarioData {
  nombre: string;
  codigo: string;
  categoria: string;
  cantidad: number;
  ubicacion: string;
  proveedor: string;
  stockMinimo: number;
}

export interface UpdateInventarioData extends Partial<CreateInventarioData> {}

// Headers manejados automáticamente por api.ts

export const inventarioService = {
  getItems: async (): Promise<ItemInventario[]> => {
    const response = await api.get('/inventario');
    return response.data.items || response.data;
  },

  getItemById: async (id: number): Promise<ItemInventario> => {
    const response = await api.get(`/inventario/${id}`);
    return response.data.item || response.data;
  },

  createItem: async (data: CreateInventarioData): Promise<ItemInventario> => {
    const response = await api.post('/inventario', data);
    return response.data.item || response.data;
  },

  updateItem: async (id: number, data: UpdateInventarioData): Promise<ItemInventario> => {
    const response = await api.put(`/inventario/${id}`, data);
    return response.data.item || response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/inventario/${id}`);
  }
};
