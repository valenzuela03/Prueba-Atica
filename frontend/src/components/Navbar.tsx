import React from 'react';

interface NavbarProps {
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreate }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Catalogo
                </span>
              </div>
            </div>
          </div>

          {/* Botón Acción Nuevo Producto */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
