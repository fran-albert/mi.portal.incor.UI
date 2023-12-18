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
