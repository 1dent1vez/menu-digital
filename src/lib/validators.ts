import type { Config, OrderDetails } from "@/lib/types";
import { formatMoney } from "@/lib/money";

export function validateOrder(
  details: OrderDetails,
  subtotal: number,
  config: Config,
) {
  const errors: string[] = [];

  if (config.minOrder !== undefined && subtotal < config.minOrder) {
    errors.push(
      `El pedido minimo es ${formatMoney(config.minOrder, config.currency)}.`,
    );
  }

  if (details.type === "mesa") {
    if (!details.tableNumber?.trim()) {
      errors.push("Ingresa el numero de mesa.");
    }
  }

  if (details.type === "pickup") {
    if (!details.pickupName?.trim()) {
      errors.push("Ingresa tu nombre para retiro.");
    }
  }

  if (details.type === "delivery") {
    if (!details.deliveryName?.trim()) {
      errors.push("Ingresa tu nombre para la entrega.");
    }
    if (!details.deliveryAddress?.trim()) {
      errors.push("Ingresa la direccion de entrega.");
    }
    if (!details.deliveryReferences?.trim()) {
      errors.push("Ingresa referencias para la entrega.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
