export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRange(start, end) {
  const s = formatDate(start);
  const e = formatDate(end);
  return s === e ? s : `${s} - ${e}`;
}

export function prettyToken(raw) {
  return String(raw)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function safeDateNumber(value) {
  const num = new Date(value).getTime();
  return Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER;
}
