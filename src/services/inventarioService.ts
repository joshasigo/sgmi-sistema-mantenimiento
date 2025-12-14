import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const inventarioService = {
  getItems: async (): Promise<ItemInventario[]> => {
    const response = await axios.get(`${API_URL}/inventario`, {
      headers: getAuthHeaders()
    });
    return response.data.items || response.data;
  },

  getItemById: async (id: number): Promise<ItemInventario> => {
    const response = await axios.get(`${API_URL}/inventario/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data.item || response.data;
  },

  createItem: async (data: CreateInventarioData): Promise<ItemInventario> => {
    const response = await axios.post(`${API_URL}/inventario`, data, {
      headers: getAuthHeaders()
    });
    return response.data.item || response.data;
  },

  updateItem: async (id: number, data: UpdateInventarioData): Promise<ItemInventario> => {
    const response = await axios.put(`${API_URL}/inventario/${id}`, data, {
      headers: getAuthHeaders()
    });
    return response.data.item || response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/inventario/${id}`, {
      headers: getAuthHeaders()
    });
  }
};
