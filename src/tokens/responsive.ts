export const HEADER_HEIGHT = 64;
export const MOBILE_HEADER_HEIGHT = 46;
export const COLLAPSED_WIDTH = 60;
export const MOBILE_COLLAPSED_WIDTH = 44;

export const RESPONSIVE_BREAKPOINTS = {
  XS: 360,
  S: 576,
  M: 768,
  L: 1024,
  XL: 1600
} as const;

export type ResponsiveBreakpoint = keyof typeof RESPONSIVE_BREAKPOINTS;
