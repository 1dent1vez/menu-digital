import type { CartItem, Config, OrderDetails } from "@/lib/types";
import { formatMoney, getCartSubtotal, getItemTotal, getItemUnitPrice } from "@/lib/money";

function getOrderTypeLabel(type: OrderDetails["type"]) {
  if (type === "mesa") return "Mesa";
  if (type === "pickup") return "Para llevar";
  return "Entrega";
}

export function buildWhatsAppMessage(
  items: CartItem[],
  order: OrderDetails,
  config: Config,
) {
  const lines: string[] = [];
  const subtotal = getCartSubtotal(items);
  const deliveryFee =
    order.type === "delivery" ? config.deliveryFee ?? 0 : 0;
  const total = subtotal + deliveryFee;

  lines.push(`*${config.businessName}*`);
  lines.push(`Pedido: ${getOrderTypeLabel(order.type)}`);

  if (order.type === "mesa") {
    lines.push(`Mesa: ${order.tableNumber ?? "-"}`);
  }

  if (order.type === "pickup") {
    lines.push(`Nombre: ${order.pickupName ?? "-"}`);
    if (order.pickupTime?.trim()) {
      lines.push(`Hora estimada: ${order.pickupTime}`);
    }
  }

  if (order.type === "delivery") {
    lines.push(`Nombre: ${order.deliveryName ?? "-"}`);
    lines.push(`Direccion: ${order.deliveryAddress ?? "-"}`);
    lines.push(`Referencias: ${order.deliveryReferences ?? "-"}`);
    if (order.deliveryPhone?.trim()) {
      lines.push(`Telefono: ${order.deliveryPhone}`);
    }
    if (order.deliveryNotes?.trim()) {
      lines.push(`Notas: ${order.deliveryNotes}`);
    }
  }

  lines.push("");
  lines.push("Items:");

  items.forEach((item) => {
    const unit = getItemUnitPrice(item);
    const itemTotal = getItemTotal(item);
    lines.push(
      `- ${item.quantity}x ${item.name} (${formatMoney(
        unit,
        config.currency,
      )}) = ${formatMoney(itemTotal, config.currency)}`,
    );
    if (item.variantSelections.length > 0) {
      const variants = item.variantSelections
        .map((option) => `${option.groupName}: ${option.name}`)
        .join(", ");
      lines.push(`  Variantes: ${variants}`);
    }
    if (item.extraSelections.length > 0) {
      const extras = item.extraSelections
        .map((option) => `${option.groupName}: ${option.name}`)
        .join(", ");
      lines.push(`  Extras: ${extras}`);
    }
    if (item.notes?.trim()) {
      lines.push(`  Nota: ${item.notes}`);
    }
  });

  lines.push("");
  lines.push(`Subtotal: ${formatMoney(subtotal, config.currency)}`);
  if (deliveryFee > 0) {
    lines.push(`Delivery: ${formatMoney(deliveryFee, config.currency)}`);
  }
  lines.push(`Total: ${formatMoney(total, config.currency)}`);

  if (config.hoursText) {
    lines.push("");
    lines.push(`Horario: ${config.hoursText}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
