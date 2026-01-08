"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AddToCartModal from "@/components/AddToCartModal";
import CartItemRow from "@/components/CartItemRow";
import OrderForm from "@/components/OrderForm";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, Config, MenuItem, OrderDetails, OrderType } from "@/lib/types";
import { formatMoney, getCartSubtotal } from "@/lib/money";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/wa";
import { validateOrder } from "@/lib/validators";
import configData from "@/data/config.json";
import menuData from "@/data/menu.json";

const config = configData as Config;
const menu = menuData as MenuItem[];

const getEnabledOrderTypes = (
  enabled: Config["orderTypesEnabled"],
): OrderType[] => {
  const types: OrderType[] = [];
  if (enabled.mesa) types.push("mesa");
  if (enabled.pickup) types.push("pickup");
  if (enabled.delivery) types.push("delivery");
  return types.length > 0 ? types : ["mesa"];
};

type CartClientProps = {
  mesaParam?: string | null;
};

export default function CartClient({ mesaParam }: CartClientProps) {
  const tableLocked = Boolean(mesaParam && config.lockTableFromUrl !== false);

  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const enabledTypes = useMemo(
    () => getEnabledOrderTypes(config.orderTypesEnabled),
    [],
  );

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    type: enabledTypes[0] ?? "mesa",
    tableNumber: mesaParam ?? "",
  });

  const productMap = useMemo(() => {
    return new Map(menu.map((item) => [item.id, item]));
  }, []);

  const subtotal = getCartSubtotal(items);
  const deliveryFee =
    orderDetails.type === "delivery" ? config.deliveryFee ?? 0 : 0;
  const total = subtotal + deliveryFee;

  const handleEdit = (item: CartItem) => {
    const product = productMap.get(item.productId) ?? null;
    if (!product) return;
    setEditingItem(item);
    setEditingProduct(product);
  };

  const handleUpdate = (item: CartItem) => {
    updateItem(item);
    setEditingItem(null);
    setEditingProduct(null);
  };

  const handleWhatsApp = () => {
    if (items.length === 0) {
      setFormError("Tu carrito esta vacio.");
      return;
    }

    const validation = validateOrder(orderDetails, subtotal, config);
    if (!validation.valid) {
      setFormError(validation.errors.join(" "));
      return;
    }

    const message = buildWhatsAppMessage(items, orderDetails, config);
    const url = buildWhatsAppUrl(config.whatsappNumber, message);
    window.open(url, "_blank");
    setFormError(null);
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-amber-100">
          <Link
            href={mesaParam ? `/menu?mesa=${mesaParam}` : "/menu"}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600"
          >
            Volver al menu
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Carrito</h1>
              <p className="mt-2 text-sm text-slate-600">
                Revisa tu pedido antes de enviarlo por WhatsApp.
              </p>
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              {items.length} item(s)
            </div>
          </div>
        </header>

        <div className="grid gap-4">
          {items.map((item) => (
            <CartItemRow
              key={item.cartItemId}
              item={item}
              currency={config.currency}
              onEdit={handleEdit}
              onRemove={removeItem}
            />
          ))}
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
              Aun no tienes productos. Vuelve al menu y agrega algo.
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-amber-100">
          <h2 className="text-base font-semibold text-slate-900">Resumen</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal, config.currency)}</span>
            </div>
            {orderDetails.type === "delivery" ? (
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>{formatMoney(deliveryFee, config.currency)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>Total estimado</span>
              <span>{formatMoney(total, config.currency)}</span>
            </div>
            {config.minOrder !== undefined ? (
              <p className="text-xs text-slate-500">
                Pedido minimo: {formatMoney(config.minOrder, config.currency)}.
              </p>
            ) : null}
          </div>
        </div>

        <OrderForm
          value={orderDetails}
          onChange={setOrderDetails}
          orderTypesEnabled={config.orderTypesEnabled}
          tableLocked={tableLocked}
          tableFromUrl={mesaParam}
        />

        {formError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {formError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={items.length === 0}
          className="w-full rounded-full bg-slate-900 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Pedir por WhatsApp
        </button>
      </div>

      {editingItem && editingProduct ? (
        <AddToCartModal
          isOpen
          product={editingProduct}
          currency={config.currency}
          initialItem={editingItem}
          onClose={() => {
            setEditingItem(null);
            setEditingProduct(null);
          }}
          onConfirm={handleUpdate}
        />
      ) : null}
    </div>
  );
}
