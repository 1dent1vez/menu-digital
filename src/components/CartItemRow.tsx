import type { CartItem } from "@/lib/types";
import { formatMoney, getItemTotal, getItemUnitPrice } from "@/lib/money";

type CartItemRowProps = {
  item: CartItem;
  currency: string;
  onEdit: (item: CartItem) => void;
  onRemove: (cartItemId: string) => void;
};

export default function CartItemRow({
  item,
  currency,
  onEdit,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-md shadow-amber-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
          <p className="text-xs text-slate-500">
            {item.quantity} x {formatMoney(getItemUnitPrice(item), currency)}
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-900">
          {formatMoney(getItemTotal(item), currency)}
        </p>
      </div>
      {item.variantSelections.length > 0 ? (
        <p className="mt-2 text-xs text-slate-600">
          Variantes:{" "}
          {item.variantSelections
            .map((option) => `${option.groupName}: ${option.name}`)
            .join(", ")}
        </p>
      ) : null}
      {item.extraSelections.length > 0 ? (
        <p className="mt-1 text-xs text-slate-600">
          Extras:{" "}
          {item.extraSelections
            .map((option) => `${option.groupName}: ${option.name}`)
            .join(", ")}
        </p>
      ) : null}
      {item.notes?.trim() ? (
        <p className="mt-1 text-xs text-slate-500">Nota: {item.notes}</p>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.cartItemId)}
          className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
