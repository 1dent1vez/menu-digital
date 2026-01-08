type CategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
