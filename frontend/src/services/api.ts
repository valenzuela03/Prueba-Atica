import axios from 'axios';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductStats,
  ProductFilters,
} from '../types/product';

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Lista de productos
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params: Record<string, any> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.isActive !== undefined) params.isActive = filters.isActive;

    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  // Obtener un solo producto por ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Crear un nuevo producto
  createProduct: async (data: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  // Actualizar un producto existente
  updateProduct: async (id: number, data: UpdateProductInput): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Eliminar un producto
  deleteProduct: async (id: number): Promise<{ message: string; deletedId: number }> => {
    const response = await apiClient.delete<{ message: string; deletedId: number }>(
      `/products/${id}`,
    );
    return response.data;
  },

  // Obtener listado de categorías disponibles
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data;
  },

  // Obtener estadísticas generales
  getStats: async (): Promise<ProductStats> => {
    const response = await apiClient.get<ProductStats>('/products/stats');
    return response.data;
  },
};
