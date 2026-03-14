export function formatDate(isoString?: string | null): string {
  if (!isoString) return "Date inconnue";
  const date = new Date(isoString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return "Date inconnue";
  const date = new Date(isoString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(minutes?: number | null): string {
  if (!minutes && minutes !== 0) return "--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m} min`;
}
