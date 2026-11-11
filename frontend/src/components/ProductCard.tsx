import React from 'react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const stock = Number(product?.stock ?? 0);
  const price = Number(product?.price ?? 0);
  const isActive = Boolean(product?.is_active);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-slate-300">
      <div>
        {/* Cabecera: Categoría y Estado */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">
            {product?.category || 'Sin categoría'}
          </span>
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Nombre e ID */}
        <div className="my-2">
          <span className="text-[11px] text-slate-400 font-mono">ID: #{product?.id}</span>
          <h4
            className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mt-0.5"
            title={product?.name}
          >
            {product?.name || 'Producto sin nombre'}
          </h4>
        </div>
      </div>

      {/* Stock, Precio y Acciones */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Stock
            </p>
            <div className="mt-0.5">
              {stock <= 5 && stock > 0 ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {stock} (Bajo)
                </span>
              ) : stock === 0 ? (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Agotado
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-700">
                  {stock} unidades
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Precio
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
