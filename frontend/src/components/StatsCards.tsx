import React from 'react';
import { ProductStats } from '../types/product';

interface StatsCardsProps {
  stats: ProductStats | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const totalProducts = stats?.totalProducts ?? 0;
  const activeProducts = stats?.activeProducts ?? 0;
  const totalStock = stats?.totalStock ?? 0;
  const totalValue = Number(stats?.totalInventoryValue ?? 0);

  const cards = [
    {
      title: 'Total Productos',
      value: totalProducts.toString(),
      border: 'border-l-4 border-l-indigo-600',
    },
    {
      title: 'Activos en Tienda',
      value: activeProducts.toString(),
      border: 'border-l-4 border-l-emerald-600',
    },
    {
      title: 'Unidades en Stock',
      value: totalStock.toLocaleString('es-MX'),
      border: 'border-l-4 border-l-amber-500',
    },
    {
      title: 'Valor del Inventario',
      value: `$${totalValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      border: 'border-l-4 border-l-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl bg-white border border-slate-200 ${card.border} shadow-xs`}
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {card.title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            {loading && !stats ? (
              <span className="inline-block w-16 h-7 bg-slate-200 animate-pulse rounded"></span>
            ) : (
              card.value
            )}
          </h3>
        </div>
      ))}
    </div>
  );
};
