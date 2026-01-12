"use client";

import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import HeaderBar from "@/components/HeaderBar";
import SearchBar from "@/components/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import AddToCartModal from "@/components/AddToCartModal";
import StickyCart from "@/components/StickyCart"; // <--- 1. IMPORTARLO
import { useCartStore } from "@/store/cartStore";
import type { CartItem, Config, MenuItem } from "@/lib/types";
import { isStoreOpen } from "@/lib/schedule";
import configData from "@/data/config.json";
import menuData from "@/data/menu.json";

const config = configData as Config;
const menu = menuData as MenuItem[];

const createCartItemId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

type MenuClientProps = {
  mesaParam?: string | null;
};

export default function MenuClient({ mesaParam }: MenuClientProps) {
  const cartHref = mesaParam ? `/cart?mesa=${mesaParam}` : "/cart";

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(null);
  
  const [isOpen, setIsOpen] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    const checkSchedule = () => {
      setIsOpen(isStoreOpen(config));
    };
    const initialCheck = setTimeout(checkSchedule, 0);
    const intervalId = setInterval(checkSchedule, 60000);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(intervalId);
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(menu.map((item) => item.category)));
    return ["Todo", ...unique];
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return menu.filter((item) => {
      const matchesCategory =
        activeCategory === "Todo" || item.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.description ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const handleAdd = (item: MenuItem) => {
    if (!isOpen) {
      toast.error("El local está cerrado en este momento.");
      return;
    }

    const needsModal = Boolean(item.variants?.length || item.extras?.length);
    if (needsModal) {
      setActiveProduct(item);
      return;
    }

    const cartItem: CartItem = {
      cartItemId: createCartItemId(),
      productId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      quantity: 1,
      variantSelections: [],
      extraSelections: [],
    };
    addItem(cartItem);
    
    toast.success(`${item.name} agregado`, {
      description: "Revisa tu carrito para completar el pedido.",
      duration: 2000,
    });
  };

  const handleConfirm = (item: CartItem) => {
    addItem(item);
    setActiveProduct(null);
    toast.success(`${item.name} agregado`, {
      description: "Se guardaron tus preferencias.",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-6"> {/* <--- AUMENTÉ EL PADDING BOTTOM (pb-24) PARA QUE EL BOTÓN NO TAPE EL CONTENIDO */}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <HeaderBar
          businessName={config.businessName}
          cartCount={cartCount}
          cartHref={cartHref}
          subtitle={config.hoursText}
        />

        {!isOpen && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl bg-rose-500 p-4 text-center text-white shadow-lg shadow-rose-200">
            <p className="text-lg font-bold">🔴 Local Cerrado</p>
            <p className="text-sm opacity-90">
              Nuestro horario es: {config.hoursText}
            </p>
          </div>
        )}

        <div className="grid gap-5 rounded-3xl border border-white/70 bg-white/60 p-5 shadow-lg shadow-amber-100">
          {/* ... Contenido del Header de búsqueda ... */}
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            {config.addressText ? (
              <p>
                Dirección:{" "}
                <span className="font-semibold">{config.addressText}</span>
              </p>
            ) : null}
            <p>Explora el menú y arma tu pedido.</p>
          </div>
          <SearchBar value={query} onChange={setQuery} />
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              currency={config.currency}
              onAdd={handleAdd}
              isStoreOpen={isOpen}
            />
          ))}
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
              No encontramos productos con ese filtro.
            </div>
          ) : null}
        </div>
      </div>

      {/* --- 2. AQUÍ VA EL STICKY CART --- */}
      <StickyCart />

      {activeProduct ? (
        <AddToCartModal
          isOpen
          product={activeProduct}
          currency={config.currency}
          onClose={() => setActiveProduct(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
}