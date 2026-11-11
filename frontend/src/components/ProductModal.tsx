import React, { useState, useEffect } from 'react';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => Promise<void>;
  productToEdit: Product | null;
  existingCategories: string[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  existingCategories,
}) => {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: Number(productToEdit.price),
        stock: productToEdit.stock,
        category: productToEdit.category,
        is_active: productToEdit.is_active,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        stock: 0,
        category: existingCategories[0] || 'Tecnología',
        is_active: true,
      });
    }
    setErrors([]);
  }, [productToEdit, isOpen, existingCategories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const localErrors: string[] = [];
    if (!formData.name.trim()) localErrors.push('El nombre es obligatorio.');
    if (!formData.category.trim()) localErrors.push('La categoría es obligatoria.');
    if (formData.price < 0) localErrors.push('El precio no puede ser negativo.');
    if ((formData.stock ?? 0) < 0) localErrors.push('El stock no puede ser negativo.');

    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      onClose();
    } catch (err: any) {
      const apiMessage = err.response?.data?.message;
      if (Array.isArray(apiMessage)) {
        setErrors(apiMessage);
      } else if (typeof apiMessage === 'string') {
        setErrors([apiMessage]);
      } else {
        setErrors(['Ocurrió un error inesperado al guardar el producto.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <p className="text-xs text-slate-500">
              {productToEdit
                ? `Modificando: ${productToEdit.name} (#${productToEdit.id})`
                : 'Ingresa los datos para registrar un producto en el catálogo'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del producto *
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="ej: Monitor Gamer 27 pulgadas"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                required
                list="category-suggestions"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="ej: Tecnología, Accesorios, Audio"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <datalist id="category-suggestions">
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Precio unitario ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stock (Unidades)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-800">
                  Producto Activo
                </span>
                <p className="text-[11px] text-slate-500">
                  Visible y disponible en el catálogo
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
            >
              {loading ? 'Guardando...' : productToEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
