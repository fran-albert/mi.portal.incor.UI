export function formatDate(fecha: string): string {
  const date = new Date(fecha);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses empiezan en 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatearDNI(dni: string): string {
  let dniStr = dni.toString();
  let dniReversed = dniStr.split("").reverse().join("");
  let dniConPuntos = dniReversed.match(/.{1,3}/g)?.join(".") || "";
  return dniConPuntos.split("").reverse().join("");
}

export function formatDateToUTCString(date: Date | null): string {
  if (!date) return "";

  // Convierte la fecha a UTC y formatea como una cadena
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
