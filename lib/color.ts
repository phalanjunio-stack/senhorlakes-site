/** "#9fc3bd" → "159 195 189", no formato que o CSS moderno usa em rgb(). */
export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  if (full.length !== 6) return "159 195 189";
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return "159 195 189";
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}
