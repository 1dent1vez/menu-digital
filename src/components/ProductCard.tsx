import Image from "next/image";
import type { MenuItem } from "@/lib/types";
import { formatMoney, getProductStartingPrice } from "@/lib/money";

type ProductCardProps = {
  item: MenuItem;
  currency: string;
  onAdd: (item: MenuItem) => void;
  isStoreOpen?: boolean; // Nueva prop para controlar el estado
};

export default function ProductCard({ 
  item, 
  currency, 
  onAdd,
  isStoreOpen = true // Por defecto abierto para no romper si falta la prop
}: ProductCardProps) {
  const startingPrice = getProductStartingPrice(item);
  const hasOptions = Boolean(item.variants?.length || item.extras?.length);

  return (
    <div 
      className={`flex flex-col gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-md shadow-amber-100 transition-all duration-300 ${
        !isStoreOpen ? "opacity-70 grayscale-[0.8]" : ""
      }`}
    >
      <div className="relative h-32 w-full overflow-hidden rounded-2xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
            {item.description ? (
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            ) : null}
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {item.category}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Precio desde</p>
            <p className="text-base font-semibold text-slate-900">
              {formatMoney(startingPrice, currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={!isStoreOpen}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition ${
              !isStoreOpen
                ? "cursor-not-allowed bg-slate-400 shadow-none"
                : "bg-amber-500 shadow-amber-200 hover:bg-amber-600"
            }`}
          >
            {!isStoreOpen 
              ? "Cerrado" 
              : hasOptions 
                ? "Agregar" 
                : "Agregar rápido"}
          </button>
        </div>
      </div>
    </div>
  );
}