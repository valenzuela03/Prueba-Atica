import React from 'react';
import { Product } from '../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 text-right">Precio</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs text-slate-400 font-semibold">
                  #{p.id}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-900">
                  {p.name}
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                  ${Number(p.price).toFixed(2)}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${
                      p.stock > 5
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : p.stock > 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {p.stock} unid.
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {p.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
