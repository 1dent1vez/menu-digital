"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";
import { getStorage } from "@/lib/storage";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      updateItem: (updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === updatedItem.cartItemId ? updatedItem : item,
          ),
        })),
      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "menu-cart",
      storage: createJSONStorage(() => getStorage()),
    },
  ),
);
