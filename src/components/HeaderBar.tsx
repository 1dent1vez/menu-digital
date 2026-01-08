"use client";

import Link from "next/link";

type HeaderBarProps = {
  businessName: string;
  cartCount: number;
  cartHref?: string;
  subtitle?: string;
};

export default function HeaderBar({
  businessName,
  cartCount,
  cartHref = "/cart",
  subtitle,
}: HeaderBarProps) {
  return (
    <header className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-amber-100 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Menu digital
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {businessName}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>
        <Link
          href={cartHref}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-200"
        >
          Ver carrito
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
            {cartCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
