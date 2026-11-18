export const zIndexValues = {
  base: 0,
  contentOverlay: 10,
  sticky: 50,
  layoutSidebar: 80,
  layoutHeader: 100,
  layoutOverlay: 180,
  rightPanel: 300,
  sidebarPanel: 320,
  modal: 1300,
  dropdown: 1400,
  select: 1400,
  tooltip: 1500,
  imagePreview: 1500,
  docsPopup: 1600,
  dragOverlay: 10000,
  toast: 12000
} as const;

export type ShKitZIndexLayer = keyof typeof zIndexValues;
export type ShKitZIndexValue = number | string;
export type ShKitZIndexTheme = Partial<Record<ShKitZIndexLayer, ShKitZIndexValue>> & Record<string, ShKitZIndexValue | undefined>;

const toKebabCase = (value: string) => {
  return value.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`).replace(/_/g, "-").toLowerCase();
};

export const zIndexVar = (layer: string, fallback?: ShKitZIndexValue) => {
  const fallbackValue = fallback === undefined ? "" : `, ${fallback}`;
  return `var(--shkit-z-index-${toKebabCase(layer)}${fallbackValue})`;
};

export const zIndex = Object.fromEntries(
  Object.entries(zIndexValues).map(([key, value]) => [key, zIndexVar(key, value)])
) as Record<ShKitZIndexLayer, string>;

export const createZIndexScale = <TCustom extends Record<string, ShKitZIndexValue>>(custom?: TCustom) => {
  return {
    ...zIndexValues,
    ...custom
  } as typeof zIndexValues & TCustom;
};

export const createZIndexVars = (themeZIndex?: ShKitZIndexTheme) => {
  return Object.fromEntries(
    Object.entries({ ...zIndexValues, ...themeZIndex })
      .filter((entry): entry is [string, ShKitZIndexValue] => entry[1] !== undefined)
      .map(([key, value]) => [`--shkit-z-index-${toKebabCase(key)}`, value])
  );
};
