export function pad(n) {
  return String(n).padStart(2, '0');
}

export function toHMS(s) {
  if (s <= 0) return null;
  return {
    h: Math.floor(s / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function getFeaturedOffers(offers, count = 3) {
  return [...offers].sort((a, b) => b.discount - a.discount).slice(0, count);
}