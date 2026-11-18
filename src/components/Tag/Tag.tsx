import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";
import { CloseButton } from "../CloseButton";

export type TagTone = "default" | "success" | "warning" | "danger" | "info";
export type TagSize = "sm" | "md";

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: ReactNode;
  tone?: TagTone;
  size?: TagSize;
  closable?: boolean;
  onClose?: () => void;
};

const toneStyles: Record<TagTone, string> = {
  default: style({
    background: color.surfaceSecondary,
    borderColor: color.surfaceSecondary,
    color: color.primary
  }),
  success: style({
    background: "rgba(189, 220, 15, 0.2)",
    borderColor: color.accent,
    color: color.primary
  }),
  warning: style({
    background: "rgba(255, 95, 45, 0.12)",
    borderColor: color.warning,
    color: color.warning
  }),
  danger: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    color: color.danger
  }),
  info: style({
    background: color.surfaceMuted,
    borderColor: color.borderStrong,
    color: color.primary
  })
};

const sizeStyles: Record<TagSize, string> = {
  sm: style({
    fontSize: 12,
    minHeight: 24,
    padding: `0 ${space[8]}px`
  }),
  md: style({
    fontSize: 13,
    minHeight: 28,
    padding: `0 ${space[10]}px`
  })
};

export const Tag = ({
  children,
  tone = "default",
  size = "md",
  closable,
  onClose,
  className,
  ...rest
}: TagProps) => {
  return (
    <span className={classes(tagStyles.root, sizeStyles[size], toneStyles[tone], className)} {...rest}>
      <span className={tagStyles.label}>{children}</span>
      {closable && (
        <CloseButton
          className={tagStyles.close}
          label="Удалить"
          onClick={event => {
            event.stopPropagation();
            onClose?.();
          }}
        />
      )}
    </span>
  );
}

const tagStyles = {
  root: style({
    alignItems: "center",
    border: "1px solid",
    borderRadius: radius.round,
    boxSizing: "border-box",
    display: "inline-flex",
    fontWeight: 900,
    gap: space[4],
    lineHeight: 1.1,
    maxWidth: "100%",
    minWidth: 0
  }),
  label: style({
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  close: style({
    color: "currentColor",
    height: 20,
    minWidth: 20,
    opacity: 0.8,
    width: 20
  })
};
