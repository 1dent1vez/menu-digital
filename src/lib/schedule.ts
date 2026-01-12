import { Config } from "./types";

export function isStoreOpen(config: Config): boolean {
  // Si no hay configuración de horario, asumimos que siempre está abierto (fallback)
  if (!config.schedule) return true;

  const { timezone, days } = config.schedule;

  // 1. Obtener la fecha actual convertida a la zona horaria del negocio
  const now = new Date();

  // Usamos Intl.DateTimeFormat para extraer las partes de la fecha en la zona horaria correcta
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short", // Necesario para depuración si quisieras ver el día
  });

  // Extraemos la hora y minutos actuales del negocio
  const parts = formatter.formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;

  if (!hour || !minute) return true; // Fallback por seguridad

  const currentTimeStr = `${hour}:${minute}`;

  // 2. Obtener el índice del día de la semana (0 = Domingo, 1 = Lunes, etc.) en la zona horaria del negocio
  // Truco: Creamos un string de fecha ISO con la zona horaria para leer el día correcto
  const businessDateStr = now.toLocaleDateString("en-US", { timeZone: timezone });
  const businessDayIndex = new Date(businessDateStr).getDay().toString();

  // 3. Buscar el horario para hoy
  const todaySchedule = days[businessDayIndex];

  // Si es null o undefined, significa que hoy no abren
  if (!todaySchedule) {
    return false;
  }

  // 4. Comparar horario (Formato HH:MM es comparable alfanuméricamente)
  // Ej: "09:00" <= "14:30" <= "22:00"
  return (
    currentTimeStr >= todaySchedule.start && currentTimeStr <= todaySchedule.end
  );
}