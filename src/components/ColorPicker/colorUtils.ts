export type Rgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

export type ColorOutputFormat = "hex" | "rgb" | "hsb";

const hexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const hex8Pattern = /^#(?:[0-9a-fA-F]{4}){1,2}$/;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const expandHex = (hex: string) => {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
};

export const isHexColor = (value: string) => hexPattern.test(value) || hex8Pattern.test(value);

export const parseColor = (input: string): Rgba | null => {
  const trimmed = input.trim();

  if (hex8Pattern.test(trimmed)) {
    const hex = trimmed.slice(1);
    if (hex.length === 8) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
        a: Number.parseInt(hex.slice(6, 8), 16) / 255
      };
    }
    const expanded = expandHex(`#${hex.slice(0, 3)}`).slice(1);
    return {
      r: Number.parseInt(expanded.slice(0, 2), 16),
      g: Number.parseInt(expanded.slice(2, 4), 16),
      b: Number.parseInt(expanded.slice(4, 6), 16),
      a: Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255
    };
  }

  if (hexPattern.test(trimmed)) {
    const hex = expandHex(trimmed).slice(1);
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: 1
    };
  }

  const rgbaMatch = trimmed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgbaMatch) {
    return {
      r: clamp(Math.round(Number(rgbaMatch[1])), 0, 255),
      g: clamp(Math.round(Number(rgbaMatch[2])), 0, 255),
      b: clamp(Math.round(Number(rgbaMatch[3])), 0, 255),
      a: rgbaMatch[4] === undefined ? 1 : clamp(Number(rgbaMatch[4]), 0, 1)
    };
  }

  const hsbMatch = trimmed.match(/^hsba?\(\s*([-+]?[\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (hsbMatch) {
    const hueRaw = Number(hsbMatch[1]);
    const normalizedHue = Number.isFinite(hueRaw) ? ((hueRaw % 360) + 360) % 360 : 0;
    const saturation = clamp(Number(hsbMatch[2]) / 100, 0, 1);
    const value = clamp(Number(hsbMatch[3]) / 100, 0, 1);
    const rgb = hsvToRgb(normalizedHue, saturation, value);
    return {
      ...rgb,
      a: hsbMatch[4] === undefined ? 1 : clamp(Number(hsbMatch[4]), 0, 1)
    };
  }

  return null;
};

export const rgbToHsv = (r: number, g: number, b: number): Hsv => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  return { h, s, v: max };
};

export const hsvToRgb = (h: number, s: number, v: number) => {
  const hue = ((h % 360) + 360) % 360;
  const chroma = v * s;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = v - chroma;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (hue < 60) {
    rn = chroma;
    gn = secondary;
  } else if (hue < 120) {
    rn = secondary;
    gn = chroma;
  } else if (hue < 180) {
    gn = chroma;
    bn = secondary;
  } else if (hue < 240) {
    gn = secondary;
    bn = chroma;
  } else if (hue < 300) {
    rn = secondary;
    bn = chroma;
  } else {
    rn = chroma;
    bn = secondary;
  }

  return {
    r: clamp(Math.round((rn + match) * 255), 0, 255),
    g: clamp(Math.round((gn + match) * 255), 0, 255),
    b: clamp(Math.round((bn + match) * 255), 0, 255)
  };
};

export const rgbaToCss = ({ r, g, b, a }: Rgba) => {
  if (a >= 1) return rgbToHex(r, g, b);
  if (a <= 0) return "#00000000";
  const alpha = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  return `${rgbToHex(r, g, b)}${alpha}`.toUpperCase();
};

export const rgbaToOutputCss = (rgba: Rgba, formatOrLegacyRgb: ColorOutputFormat | boolean) => {
  const format: ColorOutputFormat = typeof formatOrLegacyRgb === "boolean" ? (formatOrLegacyRgb ? "rgb" : "hex") : formatOrLegacyRgb;
  if (format === "hex") return rgbaToCss(rgba);
  if (format === "hsb") {
    const { h, s, v } = rgbToHsv(rgba.r, rgba.g, rgba.b);
    const hue = Math.round(h);
    const saturation = Math.round(s * 100);
    const brightness = Math.round(v * 100);
    if (rgba.a >= 1) return `hsb(${hue}, ${saturation}%, ${brightness}%)`;
    const alpha = Math.round(rgba.a * 1000) / 1000;
    return `hsba(${hue}, ${saturation}%, ${brightness}%, ${alpha})`;
  }
  const { r, g, b, a } = rgba;
  if (a >= 1) return `rgb(${r}, ${g}, ${b})`;
  const alpha = Math.round(a * 1000) / 1000;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const isValidColorString = (value: string) => parseColor(value) !== null;

export const colorsEqual = (a: string, b: string) => {
  const parsedA = parseColor(a);
  const parsedB = parseColor(b);
  if (!parsedA || !parsedB) return a.toLowerCase() === b.toLowerCase();
  return (
    parsedA.r === parsedB.r &&
    parsedA.g === parsedB.g &&
    parsedA.b === parsedB.b &&
    Math.round(parsedA.a * 1000) === Math.round(parsedB.a * 1000)
  );
};

export const rgbToHex = (r: number, g: number, b: number) => {
  const channel = (value: number) => clamp(value, 0, 255).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
};

export const formatHexInput = (rgba: Rgba) => rgbToHex(rgba.r, rgba.g, rgba.b).slice(1).toUpperCase();

export const formatAlphaPercent = (alpha: number) => `${Math.round(alpha * 100)}%`;

export const hueToRgb = (hue: number) => hsvToRgb(hue, 1, 1);
