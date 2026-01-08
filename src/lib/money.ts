import type { CartItem, MenuItem } from "@/lib/types";

export function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function getItemUnitPrice(item: CartItem) {
  const variantTotal = item.variantSelections.reduce(
    (sum, option) => sum + option.price,
    0,
  );
  const extrasTotal = item.extraSelections.reduce(
    (sum, option) => sum + option.price,
    0,
  );
  return item.basePrice + variantTotal + extrasTotal;
}

export function getItemTotal(item: CartItem) {
  return getItemUnitPrice(item) * item.quantity;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
}

export function getProductStartingPrice(product: MenuItem) {
  const requiredGroups = product.variants?.filter((group) => group.required);
  if (!requiredGroups || requiredGroups.length === 0) {
    return product.basePrice;
  }
  const minRequiredTotal = requiredGroups.reduce((sum, group) => {
    if (group.options.length === 0) {
      return sum;
    }
    const minOption = Math.min(...group.options.map((option) => option.price));
    return sum + minOption;
  }, 0);
  return product.basePrice + minRequiredTotal;
}
