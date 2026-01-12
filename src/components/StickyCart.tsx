"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatMoney } from "@/lib/money"; // Asegúrate de que esta ruta sea correcta según tu proyecto
import config from "@/data/config.json";

export default function StickyCart() {
  const items = useCartStore((state) => state.items);

  // Si no hay items, no mostramos nada
  if (items.length === 0) return null;

  // 1. Calcular Cantidad Total de items
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // 2. Calcular Precio Subtotal (Base + Variantes + Extras) * Cantidad
  const subtotal = items.reduce((acc, item) => {
    let unitPrice = item.basePrice;
    
    // Sumar variantes
    item.variantSelections.forEach((v) => (unitPrice += v.price));
    // Sumar extras
    item.extraSelections.forEach((e) => (unitPrice += e.price));
    
    return acc + unitPrice * item.quantity;
  }, 0);

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <Link href="/cart" className="group">
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 shadow-xl shadow-slate-900/20 transition-transform active:scale-95 group-hover:bg-black">
          
          {/* Contador de Items */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold text-white backdrop-blur-sm">
              {totalQuantity}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-300">Ver pedido</span>
              <span className="text-xs text-slate-400">Ir al carrito</span>
            </div>
          </div>

          {/* Precio Total */}
          <div className="flex items-center gap-2">
             <span className="text-lg font-bold text-white">
              {formatMoney(subtotal, config.currency)}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="h-5 w-5 text-amber-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>

        </div>
      </Link>
    </div>
  );
}