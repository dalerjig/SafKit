import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, shkitSpin, space, typography } from "../../tokens";
import { Tooltip, type TooltipPlacement } from "../Tooltip";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  square?: boolean;
  tooltip?: ReactNode;
  tooltipPlacement?: TooltipPlacement;
  tooltipDisabled?: boolean;
  tooltipDelay?: number;
  /** Класс всплывающей подсказки (встроенный Tooltip). */
  tooltipClassName?: string;
  /** Класс обёртки триггера встроенного Tooltip. */
  tooltipTriggerClassName?: string;
};

const heights: Record<ButtonSize, number> = {
  sm: 32,
  md: 40,
  lg: 56
};

const paddings: Record<ButtonSize, string> = {
  sm: `0 ${space[12]}px`,
  md: `0 ${space[16]}px`,
  lg: `0 ${space[24]}px`
};

const fontSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 20
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: style({
    background: color.primary,
    borderColor: color.primary,
    color: color.surface,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.primaryHover,
        borderColor: color.primaryHover
      }
    }
  }),
  secondary: style({
    background: color.surfaceSecondary,
    borderColor: color.surfaceSecondary,
    color: color.primary,
    $nest: {
      "&:hover:not(:disabled)": {
        borderColor: color.borderStrong,
        boxShadow: shadow.raised
      }
    }
  }),
  outline: style({
    background: color.surface,
    borderColor: color.primary,
    color: color.primary,
    $nest: {
      "&:hover:not(:disabled)": {
        borderColor: color.primaryHover,
        color: color.primaryHover,
        boxShadow: shadow.raised
      }
    }
  }),
  ghost: style({
    background: "transparent",
    borderColor: "transparent",
    color: color.primary,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.surfaceSecondary
      }
    }
  }),
  danger: style({
    background: color.danger,
    borderColor: color.danger,
    color: color.surface,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.warning,
        borderColor: color.warning
      }
    }
  })
};

export const Button = ({
  children,
  icon,
  trailingIcon,
  variant = "outline",
  size = "md",
  loading,
  square,
  tooltip,
  tooltipPlacement,
  tooltipDisabled,
  tooltipDelay,
  tooltipClassName,
  tooltipTriggerClassName,
  className,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const button = (
    <button
      type={type}
      className={classes(buttonStyles.base(size, square), variantStyles[variant], className)}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? <span className={buttonStyles.spinner} /> : icon && <span className={buttonStyles.icon}>{icon}</span>}
      {!square && children && <span className={buttonStyles.label}>{children}</span>}
      {!square && trailingIcon && <span className={buttonStyles.icon}>{trailingIcon}</span>}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip
      content={tooltip}
      placement={tooltipPlacement}
      disabled={tooltipDisabled}
      delay={tooltipDelay}
      className={tooltipTriggerClassName}
      popupClassName={tooltipClassName}
    >
      {button}
    </Tooltip>
  );
};

const buttonStyles = {
  base: (size: ButtonSize, square?: boolean) =>
    style({
      alignItems: "center",
      border: "1px solid",
      borderRadius: radius.sm,
      boxSizing: "border-box",
      cursor: "pointer",
      display: "inline-flex",
      fontSize: fontSizes[size],
      fontWeight: typography.controlWeight,
      gap: space[8],
      height: heights[size],
      justifyContent: "center",
      minWidth: square ? heights[size] : 0,
      padding: square ? 0 : paddings[size],
      transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease",
      whiteSpace: "nowrap",
      width: square ? heights[size] : undefined,
      $nest: {
        "&:focus-visible": {
          boxShadow: shadow.focus,
          outline: "none"
        },
        "&:disabled": {
          cursor: "not-allowed",
          opacity: 0.58
        }
      }
    }),
  icon: style({
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center"
  }),
  label: style({
    overflow: "hidden",
    textOverflow: "ellipsis"
  }),
  spinner: style({
    width: 16,
    height: 16,
    border: "2px solid currentColor",
    borderRightColor: "transparent",
    borderRadius: radius.round,
    animationName: shkitSpin,
    animationDuration: "0.75s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear"
  })
};
