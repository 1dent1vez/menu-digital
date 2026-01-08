import type { OrderDetails, OrderTypesEnabled } from "@/lib/types";

type OrderFormProps = {
  value: OrderDetails;
  onChange: (value: OrderDetails) => void;
  orderTypesEnabled: OrderTypesEnabled;
  tableLocked?: boolean;
  tableFromUrl?: string | null;
};

const ORDER_TYPES: Array<{ id: OrderDetails["type"]; label: string }> = [
  { id: "mesa", label: "Mesa" },
  { id: "pickup", label: "Para llevar" },
  { id: "delivery", label: "Entrega" },
];

export default function OrderForm({
  value,
  onChange,
  orderTypesEnabled,
  tableLocked = false,
  tableFromUrl,
}: OrderFormProps) {
  const enabledTypes = ORDER_TYPES.filter((type) => {
    if (type.id === "mesa") return orderTypesEnabled.mesa;
    if (type.id === "pickup") return orderTypesEnabled.pickup;
    return orderTypesEnabled.delivery;
  });

  const updateField = (patch: Partial<OrderDetails>) => {
    onChange({
      ...value,
      ...patch,
    });
  };

  return (
    <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-md shadow-amber-100">
      <h2 className="text-base font-semibold text-slate-900">
        Datos del pedido
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {enabledTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => updateField({ type: type.id })}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              value.type === type.id
                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {value.type === "mesa" ? (
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700">
            Numero de mesa
          </label>
          <input
            type="text"
            value={value.tableNumber ?? ""}
            onChange={(event) => updateField({ tableNumber: event.target.value })}
            disabled={tableLocked}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          {tableLocked && tableFromUrl ? (
            <p className="mt-2 text-xs text-slate-500">
              Mesa bloqueada por URL: {tableFromUrl}
            </p>
          ) : null}
        </div>
      ) : null}

      {value.type === "pickup" ? (
        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={value.pickupName ?? ""}
              onChange={(event) =>
                updateField({ pickupName: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Hora estimada (opcional)
            </label>
            <input
              type="text"
              value={value.pickupTime ?? ""}
              onChange={(event) =>
                updateField({ pickupTime: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
        </div>
      ) : null}

      {value.type === "delivery" ? (
        <div className="mt-4 grid gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={value.deliveryName ?? ""}
              onChange={(event) =>
                updateField({ deliveryName: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Direccion
            </label>
            <input
              type="text"
              value={value.deliveryAddress ?? ""}
              onChange={(event) =>
                updateField({ deliveryAddress: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Referencias
            </label>
            <input
              type="text"
              value={value.deliveryReferences ?? ""}
              onChange={(event) =>
                updateField({ deliveryReferences: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Telefono (opcional)
            </label>
            <input
              type="text"
              value={value.deliveryPhone ?? ""}
              onChange={(event) =>
                updateField({ deliveryPhone: event.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Notas (opcional)
            </label>
            <textarea
              value={value.deliveryNotes ?? ""}
              onChange={(event) =>
                updateField({ deliveryNotes: event.target.value })
              }
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm outline-none ring-amber-200 transition focus:ring-2"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
