import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, palette, radius, space } from "../../tokens";

export type BadgePaletteTone = "neutral" | "grey" | "dark" | "green" | "lime" | "orange" | "red" | "beige" | "white" | "black" | "transparent";
export type BadgeSemanticTone = "default" | "success" | "warning" | "danger" | "info";
export type BadgeTone = BadgePaletteTone | BadgeSemanticTone;
export type BadgeSize = "sm" | "md" | "lg";

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  count?: number;
  text?: ReactNode;
  dot?: boolean;
  tone?: BadgeTone;
  size?: BadgeSize;
  fontWeight?: number;
  maxCount?: number;
  showZero?: boolean;
};

const toneStyles: Record<BadgeTone, string> = {
  neutral: style({ background: color.surfaceMuted, color: color.primary }),
  grey: style({ background: palette.ironGrey, color: color.primary }),
  dark: style({ background: color.primary, color: color.surface }),
  green: style({ background: palette.green, color: color.surface }),
  lime: style({ background: color.accent, color: palette.darkGreen }),
  orange: style({ background: color.warning, color: color.surface }),
  red: style({ background: color.danger, color: color.surface }),
  beige: style({ background: color.surfaceSecondary, color: color.primary }),
  white: style({ background: color.surface, boxShadow: `inset 0 0 0 1px ${color.border}`, color: color.primary }),
  black: style({ background: palette.black, color: color.surface }),
  transparent: style({ background: "transparent", color: color.primary }),
  default: style({ background: color.surfaceSecondary, color: color.primary }),
  success: style({ background: color.accent, color: palette.darkGreen }),
  warning: style({ background: color.warning, color: color.surface }),
  danger: style({ background: color.danger, color: color.surface }),
  info: style({ background: color.primary, color: color.surface })
};

const dotColors: Record<BadgeTone, string> = {
  neutral: palette.greyLight,
  grey: palette.ironGrey,
  dark: palette.darkGreen,
  green: palette.green,
  lime: palette.babyGreen,
  orange: palette.orange,
  red: palette.red,
  beige: palette.beige,
  white: palette.white,
  black: palette.black,
  transparent: "transparent",
  default: palette.ironGrey,
  success: palette.babyGreen,
  warning: palette.orange,
  danger: palette.red,
  info: palette.darkGreen
};

export const Badge = ({
  count,
  text,
  dot,
  tone = "default",
  size = "md",
  fontWeight = 900,
  maxCount = 99,
  showZero,
  className,
  ...rest
}: BadgeProps) => {
  const hasCount = typeof count === "number";
  const isHiddenZero = hasCount && count === 0 && !showZero;
  const label = hasCount ? (count > maxCount ? `${maxCount}+` : String(count)) : text;

  if (dot) {
    return (
      <span
        className={classes(badgeStyles.dot(dotColors[tone]), dotSizeStyles[size], className)}
        aria-label={typeof text === "string" ? text : undefined}
        {...rest}
      />
    );
  }

  if (isHiddenZero || label === undefined || label === null || label === false) {
    return null;
  }

  return (
    <span className={classes(badgeStyles.root, style({ fontWeight }), sizeStyles[size], toneStyles[tone], className)} {...rest}>
      {label}
    </span>
  );
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: style({
    fontSize: 10,
    height: 16,
    minWidth: 16,
    padding: `0 ${space[4]}px`
  }),
  md: style({
    fontSize: 11,
    height: 20,
    minWidth: 20,
    padding: `0 ${space[6]}px`
  }),
  lg: style({
    fontSize: 12,
    height: 24,
    minWidth: 24,
    padding: `0 ${space[8]}px`
  })
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: style({
    height: 6,
    width: 6
  }),
  md: style({
    height: 8,
    width: 8
  }),
  lg: style({
    height: 10,
    width: 10
  })
};

const badgeStyles = {
  root: style({
    alignItems: "center",
    borderRadius: radius.round,
    boxSizing: "border-box",
    display: "inline-flex",
    justifyContent: "center",
    lineHeight: 1,
    whiteSpace: "nowrap"
  }),
  dot: (background: string) =>
    style({
      background,
      borderRadius: radius.round,
      display: "inline-block",
    })
};
