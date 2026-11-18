import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, palette, radius, space } from "../../tokens";

export type AlertVariant = "info" | "success" | "warning" | "error";

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  variant?: AlertVariant;
  compact?: boolean;
};

const variantStyles: Record<AlertVariant, string> = {
  info: style({
    background: color.surfaceMuted,
    borderColor: color.borderStrong,
    color: color.primary
  }),
  success: style({
    background: "rgba(189, 220, 15, 0.18)",
    borderColor: color.accent,
    color: color.primary
  }),
  warning: style({
    background: "rgba(255, 95, 45, 0.12)",
    borderColor: color.warning,
    color: color.warning
  }),
  error: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    color: color.danger
  })
};

const markers: Record<AlertVariant, string> = {
  info: palette.darkGreen,
  success: palette.babyGreen,
  warning: palette.orange,
  error: palette.red
};

export const Alert = ({
  title,
  children,
  action,
  variant = "info",
  compact,
  className,
  ...rest
}: AlertProps) => {
  return (
    <div className={classes(alertStyles.root(compact), variantStyles[variant], className)} role={variant === "error" ? "alert" : "status"} {...rest}>
      <span className={alertStyles.marker(markers[variant])} aria-hidden="true" />
      <div className={alertStyles.content}>
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
      </div>
      {action && <div className={alertStyles.action}>{action}</div>}
    </div>
  );
}

const alertStyles = {
  root: (compact?: boolean) =>
    style({
      alignItems: "flex-start",
      border: "1px solid",
      borderRadius: radius.sm,
      boxSizing: "border-box",
      display: "grid",
      gap: compact ? space[8] : space[10],
      gridTemplateColumns: "8px minmax(0, 1fr) auto",
      minWidth: 0,
      padding: compact ? `${space[8]}px ${space[10]}px` : `${space[12]}px ${space[14]}px`
    }),
  marker: (background: string) =>
    style({
      background,
      borderRadius: radius.round,
      height: 8,
      marginTop: 5,
      width: 8
    }),
  content: style({
    color: color.text,
    display: "grid",
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& strong": {
        color: "currentColor",
        fontSize: 14,
        fontWeight: 900,
        lineHeight: 1.25
      },
      "& div": {
        color: "currentColor",
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.4,
        opacity: 0.86,
        overflowWrap: "anywhere"
      }
    }
  }),
  action: style({
    alignItems: "center",
    display: "inline-flex"
  })
};
