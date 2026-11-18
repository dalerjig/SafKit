export const palette = {
  offWhite: "#F4F3F4",
  greyLight: "#D9D8DA",
  ironGrey: "#B4B2B5",
  black: "#191919",
  darkGreen: "#103E36",
  green: "#25564C",
  babyGreen: "#BDDC0F",
  orange: "#FF5F2D",
  beige: "#EDECDA",
  white: "#FFFFFF",
  red: "#C03B2B"
} as const;

export const color = {
  text: `var(--shkit-color-text, ${palette.black})`,
  textMuted: `var(--shkit-color-text-muted, ${palette.green})`,
  textSubtle: "var(--shkit-color-text-subtle, #7C7C82)",
  surface: `var(--shkit-color-surface, ${palette.white})`,
  surfaceMuted: `var(--shkit-color-surface-muted, ${palette.offWhite})`,
  surfaceSecondary: `var(--shkit-color-surface-secondary, ${palette.beige})`,
  border: `var(--shkit-color-border, ${palette.greyLight})`,
  borderStrong: `var(--shkit-color-border-strong, ${palette.ironGrey})`,
  primary: `var(--shkit-color-primary, ${palette.darkGreen})`,
  primaryHover: `var(--shkit-color-primary-hover, ${palette.green})`,
  accent: `var(--shkit-color-accent, ${palette.babyGreen})`,
  danger: `var(--shkit-color-danger, ${palette.red})`,
  warning: `var(--shkit-color-warning, ${palette.orange})`,
  sidebarRail: `var(--shkit-color-sidebar-rail, ${palette.darkGreen})`,
  sidebarRailText: `var(--shkit-color-sidebar-rail-text, ${palette.white})`,
  sidebarLogo: `var(--shkit-color-sidebar-logo, ${palette.white})`,
  sidebarLogoAccent: `var(--shkit-color-sidebar-logo-accent, ${palette.babyGreen})`
} as const;

export const themes = {
  shtab: {
    color: {
      text: palette.black,
      textMuted: palette.green,
      textSubtle: "#7C7C82",
      surface: palette.white,
      surfaceMuted: palette.offWhite,
      surfaceSecondary: palette.beige,
      border: palette.greyLight,
      borderStrong: palette.ironGrey,
      primary: palette.darkGreen,
      primaryHover: palette.green,
      accent: palette.babyGreen,
      danger: palette.red,
      warning: palette.orange,
      sidebarRail: palette.darkGreen,
      sidebarRailText: palette.white,
      sidebarLogo: palette.white,
      sidebarLogoAccent: palette.babyGreen
    }
  },
  contrast: {
    color: {
      text: palette.black,
      textMuted: palette.green,
      textSubtle: "#7C7C82",
      surface: palette.white,
      surfaceMuted: palette.offWhite,
      primary: "#191919",
      primaryHover: "#3A3A3A",
      accent: "#FF5F2D",
      surfaceSecondary: "#F4F3F4",
      border: palette.greyLight,
      borderStrong: palette.ironGrey,
      danger: palette.red,
      warning: palette.orange,
      sidebarRail: palette.black,
      sidebarRailText: palette.white,
      sidebarLogo: palette.white,
      sidebarLogoAccent: palette.orange
    }
  },
  dark: {
    color: {
      text: "#CCCCCC",
      textMuted: "#A6ADB5",
      textSubtle: "#7A8490",
      surface: "#1E1E1E",
      surfaceMuted: "#252526",
      surfaceSecondary: "#2D2D30",
      border: "#3E3E42",
      borderStrong: "#5F646D",
      primary: "#B7D8C5",
      primaryHover: "#D3E8DA",
      accent: "#7FB069",
      danger: "#F48771",
      warning: "#DCDCAA",
      sidebarRail: "#181818",
      sidebarRailText: "#CCCCCC",
      sidebarLogo: "#2D2D30",
      sidebarLogoAccent: "#7FB069"
    }
  }
} as const;

export type ShKitThemeColor = Partial<Record<keyof typeof color, string>>;
export type ShKitThemePreset = keyof typeof themes;
export type ShKitTheme = {
  color?: ShKitThemeColor;
};
