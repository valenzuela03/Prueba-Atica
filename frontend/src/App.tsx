import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { DeleteModal } from './components/DeleteModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { productService } from './services/api';
import {
  Product,
  ProductStats,
  CreateProductInput,
  UpdateProductInput,
} from './types/product';

export const App: React.FC = () => {
  // Estado principal
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);

  // Estados de carga y error
  const [loading, setLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Notificaciones Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error', text: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cargar productos desde el backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isActiveParam =
        statusFilter === 'active'
          ? true
          : statusFilter === 'inactive'
            ? false
            : undefined;

      const data = await productService.getProducts({
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        isActive: isActiveParam,
      });

      setProducts(data);
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      setError(
        'No se pudo conectar con el servidor',
      );
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, statusFilter]);

  // Cargar categorías y estadísticas
  const fetchMetadata = async () => {
    try {
      setStatsLoading(true);
      const [cats, st] = await Promise.all([
        productService.getCategories(),
        productService.getStats(),
      ]);
      setCategories(cats);
      setStats(st);
    } catch (err) {
      console.error('Error al obtener metadatos:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Crear o actualizar producto
  const handleSaveProduct = async (
    data: CreateProductInput | UpdateProductInput,
  ) => {
    if (productToEdit) {
      // Actualización (PATCH)
      const updated = await productService.updateProduct(productToEdit.id, data);
      addToast('success', `Producto "${updated.name}" actualizado con éxito.`);
    } else {
      // Creación (POST)
      const created = await productService.createProduct(
        data as CreateProductInput,
      );
      addToast('success', `Producto "${created.name}" agregado al catálogo.`);
    }
    // Refrescar listado y estadísticas
    await Promise.all([fetchProducts(), fetchMetadata()]);
  };

  // Confirmar y ejecutar eliminación (DELETE)
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(productToDelete.id);
      addToast(
        'success',
        `El producto "${productToDelete.name}" fue eliminado correctamente.`,
      );
      setProductToDelete(null);
      await Promise.all([fetchProducts(), fetchMetadata()]);
    } catch (err: any) {
      addToast('error', 'Ocurrió un error al intentar eliminar el producto.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Barra de navegación superior */}
      <Navbar
        onOpenCreate={() => {
          setProductToEdit(null);
          setIsModalOpen(true);
        }}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas y resumen del inventario */}
        <StatsCards stats={stats} loading={statsLoading} />

        {/* Barra de Búsqueda y Filtros */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={products.length}
        />

        {/* Estado de Error */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center my-6">
            <h3 className="text-base font-bold text-rose-900 mb-1">
              Error
            </h3>
            <p className="text-xs text-rose-700 max-w-md mx-auto mb-4">
              {error}
            </p>
            <button
              onClick={() => {
                fetchProducts();
                fetchMetadata();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* Estado de Carga (Skeletons) */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 animate-pulse"
              >
                <div className="w-1/3 h-4 bg-slate-200 rounded" />
                <div className="w-3/4 h-5 bg-slate-200 rounded" />
                <div className="w-full h-10 bg-slate-200 rounded mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Listado de Productos (Grid / Tabla) */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mostrando {products.length} {products.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onEdit={(prod) => {
                      setProductToEdit(prod);
                      setIsModalOpen(true);
                    }}
                    onDelete={(prod) => setProductToDelete(prod)}
                  />
                ))}
              </div>
            ) : (
              <ProductTable
                products={products}
                onEdit={(prod) => {
                  setProductToEdit(prod);
                  setIsModalOpen(true);
                }}
                onDelete={(prod) => setProductToDelete(prod)}
              />
            )}
          </>
        )}

        {/* Estado Vacío */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No se encontraron productos
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {search || selectedCategory || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda o categoría.'
                : 'El catálogo se encuentra vacío actualmente.'}
            </p>
            {(search || selectedCategory || statusFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            ) : (
              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Crear el primer producto
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal para Crear / Editar Producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        productToEdit={productToEdit}
        existingCategories={categories}
      />

      {/* Modal de Confirmación de Borrado */}
      <DeleteModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
        loading={deleteLoading}
      />

      {/* Notificaciones Toast */}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
