const percentFormatter = new Intl.NumberFormat("tr-TR", {
  style: "percent",
  maximumFractionDigits: 0
});

const compactNumberFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  maximumFractionDigits: 1
});

const integerFormatter = new Intl.NumberFormat("tr-TR");

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short"
});

const dateTimeFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit"
});

export function formatPercent(value) {
  return percentFormatter.format(value);
}

export function formatCompactNumber(value) {
  return compactNumberFormatter.format(value);
}

export function formatInteger(value) {
  return integerFormatter.format(value);
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatRelativeDays(dayCount) {
  if (dayCount <= 0) {
    return "Bugün";
  }

  if (dayCount === 1) {
    return "Dün";
  }

  return `${dayCount} gün önce`;
}

export function formatDelta(value) {
  const direction = value > 0 ? "+" : "";
  return `${direction}${Math.round(value * 100)} puan`;
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
