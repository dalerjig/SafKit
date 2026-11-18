import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, shkitSpin, space, zIndex } from "../../tokens";

export type SpinnerSize = "sm" | "md" | "lg";

export type SpinnerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  size?: SpinnerSize;
  label?: ReactNode;
  centered?: boolean;
  overlay?: boolean;
};

const spinnerSizes: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 36
};

const spinnerBorderWidths: Record<SpinnerSize, number> = {
  sm: 2,
  md: 3,
  lg: 4
};

export const Spinner = ({ size = "md", label, centered, overlay, className, ...rest }: SpinnerProps) => {
  return (
    <div
      className={classes(
        spinnerStyles.root,
        centered && spinnerStyles.centered,
        overlay && spinnerStyles.overlay,
        className
      )}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className={spinnerStyles.indicator(size)} aria-hidden="true" />
      {label && <span className={spinnerStyles.label}>{label}</span>}
    </div>
  );
}

const spinnerStyles = {
  root: style({
    alignItems: "center",
    color: color.primary,
    display: "inline-flex",
    gap: space[8],
    minWidth: 0
  }),
  centered: style({
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }),
  overlay: style({
    background: "rgba(255, 255, 255, 0.72)",
    borderRadius: radius.sm,
    inset: 0,
    justifyContent: "center",
    minHeight: 120,
    position: "absolute",
    zIndex: zIndex.contentOverlay
  }),
  indicator: (size: SpinnerSize) =>
    style({
      animationDuration: "0.75s",
      animationIterationCount: "infinite",
      animationName: shkitSpin,
      animationTimingFunction: "linear",
      border: `${spinnerBorderWidths[size]}px solid currentColor`,
      borderRadius: radius.round,
      borderRightColor: "transparent",
      flex: "0 0 auto",
      height: spinnerSizes[size],
      width: spinnerSizes[size]
    }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  })
};
