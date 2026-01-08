type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar por nombre o descripcion",
}: SearchBarProps) {
  return (
    <div className="w-full">
      <label className="text-sm font-semibold text-slate-700" htmlFor="search">
        Buscar
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-sm outline-none ring-amber-200 transition focus:ring-2"
      />
    </div>
  );
}
