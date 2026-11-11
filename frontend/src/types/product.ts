export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock?: number;
  category: string;
  is_active?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  totalInventoryValue: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
}
