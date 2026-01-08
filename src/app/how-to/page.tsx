import configData from "@/data/config.json";
import type { Config } from "@/lib/types";

const config = configData as Config;

export default function HowToPage() {
  return (
    <div className="min-h-screen px-4 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-amber-100">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Como pedir
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Guia rapida
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sigue estos pasos y envia tu pedido directo a WhatsApp.
          </p>
        </header>

        <div className="grid gap-4 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-amber-100">
          <ol className="grid gap-4 text-sm text-slate-600">
            <li>
              1. Explora el menu y agrega tus productos al carrito.
            </li>
            <li>
              2. Ingresa tus datos segun el tipo de pedido.
            </li>
            <li>3. Revisa el total estimado y presiona Pedir por WhatsApp.</li>
            <li>
              4. Confirma el mensaje en WhatsApp y envia tu pedido.
            </li>
          </ol>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold">Horario</p>
            <p>{config.hoursText}</p>
            {config.addressText ? (
              <>
                <p className="mt-2 font-semibold">Direccion</p>
                <p>{config.addressText}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
