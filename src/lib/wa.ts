import type { CartItem, Config, OrderDetails } from "@/lib/types";
import { formatMoney, getCartSubtotal, getItemTotal, getItemUnitPrice } from "@/lib/money";

// Helper para obtener etiqueta con emoji
function getOrderTypeDetails(type: OrderDetails["type"]) {
  switch (type) {
    case "mesa":
      return { label: "🍽️ En Mesa", icon: "🍽️" };
    case "pickup":
      return { label: "🛍️ Para Llevar (Pickup)", icon: "🛍️" };
    case "delivery":
      return { label: "🛵 A Domicilio", icon: "🛵" };
    default:
      return { label: "Orden", icon: "📝" };
  }
}

export function buildWhatsAppMessage(
  items: CartItem[],
  order: OrderDetails,
  config: Config,
) {
  const lines: string[] = [];
  const subtotal = getCartSubtotal(items);
  const deliveryFee = order.type === "delivery" ? config.deliveryFee ?? 0 : 0;
  const total = subtotal + deliveryFee;
  const typeDetails = getOrderTypeDetails(order.type);
  const date = new Date().toLocaleDateString("es-MX", { hour: '2-digit', minute: '2-digit' });

  // --- CABECERA ---
  lines.push(`*${config.businessName.toUpperCase()}*`);
  lines.push(`📅 ${date}`);
  lines.push(`📄 Tipo: *${typeDetails.label}*`);
  lines.push("--------------------------------"); // Separador visual

  // --- DATOS DEL CLIENTE ---
  if (order.type === "mesa") {
    lines.push(`📍 *Mesa:* ${order.tableNumber ?? "N/A"}`);
  }

  if (order.type === "pickup") {
    lines.push(`👤 *Cliente:* ${order.pickupName ?? "No especificado"}`);
    if (order.pickupTime?.trim()) {
      lines.push(`⏰ *Hora:* ${order.pickupTime}`);
    }
  }

  if (order.type === "delivery") {
    lines.push(`👤 *Cliente:* ${order.deliveryName ?? "No especificado"}`);
    lines.push(`📍 *Dirección:* ${order.deliveryAddress ?? "No especificada"}`);
    if (order.deliveryReferences?.trim()) {
      lines.push(`🗺️ *Ref:* ${order.deliveryReferences}`);
    }
    if (order.deliveryPhone?.trim()) {
      lines.push(`📞 *Tel:* ${order.deliveryPhone}`);
    }
    if (order.deliveryNotes?.trim()) {
      lines.push(`📝 *Nota:* ${order.deliveryNotes}`);
    }
  }

  lines.push("--------------------------------"); 
  lines.push("*📝 RESUMEN DEL PEDIDO:*");
  lines.push("");

  // --- ITEMS ---
  items.forEach((item) => {
    const unit = getItemUnitPrice(item);
    const itemTotal = getItemTotal(item);
    
    // Formato: 2 x Hamburguesa Clásica ($200)
    lines.push(`▪️ *${item.quantity} x ${item.name}*`);
    // Opcional: mostrar precio unitario si quieres detalle
     lines.push(`   (Unit: ${formatMoney(unit, config.currency)})`); 

    // Variantes (con indentación visual)
    if (item.variantSelections.length > 0) {
      item.variantSelections.forEach((option) => {
         lines.push(`   └ _${option.groupName}: ${option.name}_`);
      });
    }

    // Extras
    if (item.extraSelections.length > 0) {
      item.extraSelections.forEach((option) => {
        lines.push(`   └ + ${option.name}`);
      });
    }

    // Notas del item
    if (item.notes?.trim()) {
      lines.push(`   ⚠️ Nota: ${item.notes}`);
    }
    
    // Subtotal del item
    lines.push(`   💲 Sub: ${formatMoney(itemTotal, config.currency)}`);
    lines.push(""); // Espacio entre items
  });

  lines.push("--------------------------------");

  // --- TOTALES ---
  lines.push(`💰 *Subtotal:* ${formatMoney(subtotal, config.currency)}`);
  
  if (deliveryFee > 0) {
    lines.push(`🛵 *Envío:* ${formatMoney(deliveryFee, config.currency)}`);
  }
  
  lines.push(`💵 *TOTAL A PAGAR: ${formatMoney(total, config.currency)}*`);
  lines.push("--------------------------------");

  // --- CIERRE ---
  if (config.hoursText) {
    lines.push(`🕒 Horario: ${config.hoursText}`);
  }
  
  // Un mensaje final de cortesía ayuda a la conversión
  lines.push("");
  lines.push("✅ _Envía este mensaje para confirmar tu pedido._");

  return lines.join("\n");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string) {
  // Aseguramos que el número no tenga símbolos raros
  const cleanNumber = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}