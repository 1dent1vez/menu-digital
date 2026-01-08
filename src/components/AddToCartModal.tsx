"use client";

import { useState } from "react";
import type {
  CartItem,
  MenuExtraGroup,
  MenuItem,
  MenuVariantGroup,
  SelectedOption,
} from "@/lib/types";
import { formatMoney, getItemTotal, getItemUnitPrice } from "@/lib/money";

type AddToCartModalProps = {
  isOpen: boolean;
  product: MenuItem | null;
  currency: string;
  initialItem?: CartItem | null;
  onClose: () => void;
  onConfirm: (item: CartItem) => void;
};

type VariantSelectionMap = Record<string, string>;
type ExtraSelectionMap = Record<string, string[]>;

const createCartItemId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export default function AddToCartModal({
  isOpen,
  product,
  currency,
  initialItem,
  onClose,
  onConfirm,
}: AddToCartModalProps) {
  const getInitialVariantMap = () => {
    const variantMap: VariantSelectionMap = {};
    if (initialItem) {
      initialItem.variantSelections.forEach((selection) => {
        variantMap[selection.groupId] = selection.optionId;
      });
    }
    return variantMap;
  };

  const getInitialExtraMap = () => {
    const extraMap: ExtraSelectionMap = {};
    if (initialItem) {
      initialItem.extraSelections.forEach((selection) => {
        extraMap[selection.groupId] = [
          ...(extraMap[selection.groupId] ?? []),
          selection.optionId,
        ];
      });
    }
    return extraMap;
  };

  const [quantity, setQuantity] = useState(() => initialItem?.quantity ?? 1);
  const [notes, setNotes] = useState(() => initialItem?.notes ?? "");
  const [selectedVariants, setSelectedVariants] = useState<VariantSelectionMap>(
    () => getInitialVariantMap(),
  );
  const [selectedExtras, setSelectedExtras] = useState<ExtraSelectionMap>(
    () => getInitialExtraMap(),
  );
  const [extraErrors, setExtraErrors] = useState<Record<string, string>>({});
  const missingRequiredVariant =
    product?.variants?.some(
      (group) => group.required && !selectedVariants[group.id],
    ) ?? false;

  const buildVariantSelections = (
    groups: MenuVariantGroup[] | undefined,
  ): SelectedOption[] => {
    if (!groups) return [];
    return groups.flatMap((group) => {
      const optionId = selectedVariants[group.id];
      if (!optionId) return [];
      const option = group.options.find((entry) => entry.id === optionId);
      if (!option) return [];
      return [
        {
          groupId: group.id,
          groupName: group.name,
          optionId: option.id,
          name: option.name,
          price: option.price,
        },
      ];
    });
  };

  const buildExtraSelections = (
    groups: MenuExtraGroup[] | undefined,
  ): SelectedOption[] => {
    if (!groups) return [];
    return groups.flatMap((group) => {
      const optionIds = selectedExtras[group.id] ?? [];
      return optionIds
        .map((optionId) => {
          const option = group.options.find((entry) => entry.id === optionId);
          if (!option) return null;
          return {
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            name: option.name,
            price: option.price,
          };
        })
        .filter((option): option is SelectedOption => option !== null);
    });
  };

  const previewItem: CartItem | null = product
    ? {
        cartItemId: initialItem?.cartItemId ?? "preview",
        productId: product.id,
        name: product.name,
        basePrice: product.basePrice,
        quantity,
        notes,
        variantSelections: buildVariantSelections(product.variants),
        extraSelections: buildExtraSelections(product.extras),
      }
    : null;

  if (!isOpen || !product) {
    return null;
  }

  const handleVariantChange = (groupId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  const toggleExtra = (
    group: MenuExtraGroup,
    optionId: string,
  ) => {
    setSelectedExtras((prev) => {
      const existing = new Set(prev[group.id] ?? []);
      if (existing.has(optionId)) {
        existing.delete(optionId);
        setExtraErrors((errors) => ({ ...errors, [group.id]: "" }));
      } else {
        if (group.maxSelect && existing.size >= group.maxSelect) {
          setExtraErrors((errors) => ({
            ...errors,
            [group.id]: `Maximo ${group.maxSelect} seleccion(es).`,
          }));
          return prev;
        }
        existing.add(optionId);
        setExtraErrors((errors) => ({ ...errors, [group.id]: "" }));
      }
      return {
        ...prev,
        [group.id]: Array.from(existing),
      };
    });
  };

  const handleConfirm = () => {
    if (!product || missingRequiredVariant) return;

    const item: CartItem = {
      cartItemId: initialItem?.cartItemId ?? createCartItemId(),
      productId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      quantity,
      notes: notes.trim() ? notes.trim() : undefined,
      variantSelections: buildVariantSelections(product.variants),
      extraSelections: buildExtraSelections(product.extras),
    };

    onConfirm(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 py-6 backdrop-blur">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              Personaliza
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {product.name}
            </h2>
            {product.description ? (
              <p className="mt-2 text-sm text-slate-600">
                {product.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            -
          </button>
          <p className="text-base font-semibold text-slate-900">{quantity}</p>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
          >
            +
          </button>
          {previewItem ? (
            <p className="ml-auto text-sm font-semibold text-slate-900">
              {formatMoney(getItemTotal(previewItem), currency)}
            </p>
          ) : null}
        </div>

        {product.variants?.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-900">Variantes</h3>
            <div className="mt-3 grid gap-4">
              {product.variants.map((group) => (
                <div key={group.id}>
                  <p className="text-xs font-semibold text-slate-700">
                    {group.name}
                    {group.required ? " (requerido)" : ""}
                  </p>
                  <div className="mt-2 grid gap-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`variant-${group.id}`}
                            value={option.id}
                            checked={selectedVariants[group.id] === option.id}
                            onChange={() =>
                              handleVariantChange(group.id, option.id)
                            }
                          />
                          {option.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {option.price > 0
                            ? `+${formatMoney(option.price, currency)}`
                            : "Incluido"}
                        </span>
                      </label>
                    ))}
                  </div>
                  {group.required && !selectedVariants[group.id] ? (
                    <p className="mt-2 text-xs text-rose-500">
                      Selecciona una opcion.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {product.extras?.length ? (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-900">Extras</h3>
            <div className="mt-3 grid gap-4">
              {product.extras.map((group) => (
                <div key={group.id}>
                  <p className="text-xs font-semibold text-slate-700">
                    {group.name}
                    {group.maxSelect
                      ? ` (max ${group.maxSelect})`
                      : ""}
                  </p>
                  <div className="mt-2 grid gap-2">
                    {group.options.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={
                              selectedExtras[group.id]?.includes(option.id) ??
                              false
                            }
                            onChange={() => toggleExtra(group, option.id)}
                          />
                          {option.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {option.price > 0
                            ? `+${formatMoney(option.price, currency)}`
                            : "Incluido"}
                        </span>
                      </label>
                    ))}
                  </div>
                  {extraErrors[group.id] ? (
                    <p className="mt-2 text-xs text-rose-500">
                      {extraErrors[group.id]}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700">
            Notas del producto (opcional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
          />
        </div>

        {previewItem ? (
          <div className="mt-5 rounded-2xl bg-slate-900 px-4 py-3 text-white">
            <p className="text-xs text-white/70">Total estimado</p>
            <p className="text-lg font-semibold">
              {formatMoney(getItemTotal(previewItem), currency)}
            </p>
            <p className="text-xs text-white/70">
              {formatMoney(getItemUnitPrice(previewItem), currency)} por unidad
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={missingRequiredVariant}
          className="mt-5 w-full rounded-full bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-200 transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {initialItem ? "Guardar cambios" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
