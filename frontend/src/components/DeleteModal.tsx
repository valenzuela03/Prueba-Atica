import React from 'react';
import { Product } from '../types/product';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  product: Product | null;
  loading: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  loading,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-100 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 font-bold text-xl flex items-center justify-center mx-auto mb-4">
          !
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1">
          ¿Eliminar producto?
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Estás a punto de eliminar <span className="font-semibold text-slate-800">"{product.name}"</span> (ID: #{product.id}). Esta acción no se puede deshacer.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};
