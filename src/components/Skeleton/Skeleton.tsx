import { type CSSProperties, type HTMLAttributes } from "react";
import { classes, style } from "typestyle";
import { color, radius, shkitSkeletonShimmer, space } from "../../tokens";

export type SkeletonVariant = "text" | "row" | "card" | "table";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  rows?: number;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
};

export const Skeleton = ({
  variant = "text",
  rows = variant === "table" ? 4 : 3,
  width,
  height,
  className,
  ...rest
}: SkeletonProps) => {
  if (variant === "card") {
    return (
      <div className={classes(skeletonStyles.card, className)} style={{ width, height }} aria-hidden="true" {...rest}>
        <span className={skeletonStyles.block("38%")} />
        <span className={skeletonStyles.block("100%")} />
        <span className={skeletonStyles.block("74%")} />
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={classes(skeletonStyles.table, className)} style={{ width, height }} aria-hidden="true" {...rest}>
        <span className={skeletonStyles.tableHead} />
        {Array.from({ length: rows }).map((_, index) => (
          <span key={index} className={skeletonStyles.tableRow} />
        ))}
      </div>
    );
  }

  return (
    <div className={classes(skeletonStyles.stack, className)} style={{ width, height }} aria-hidden="true" {...rest}>
      {Array.from({ length: rows }).map((_, index) => (
        <span
          key={index}
          className={variant === "row" ? skeletonStyles.row : skeletonStyles.block(index === rows - 1 ? "62%" : "100%")}
        />
      ))}
    </div>
  );
}

const shimmer = "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.72), rgba(255,255,255,0))";

const skeletonStyles = {
  base: style({
    background: color.surfaceMuted,
    overflow: "hidden",
    position: "relative",
    $nest: {
      "&::after": {
        animationDuration: "1.25s",
        animationIterationCount: "infinite",
        animationName: shkitSkeletonShimmer,
        animationTimingFunction: "ease-in-out",
        background: shimmer,
        content: '""',
        inset: 0,
        position: "absolute",
        transform: "translateX(-100%)"
      }
    }
  }),
  stack: style({
    display: "grid",
    gap: space[8],
    minWidth: 0
  }),
  block: (width: CSSProperties["width"]) =>
    style({
      background: color.surfaceMuted,
      borderRadius: radius.xs,
      display: "block",
      height: 14,
      overflow: "hidden",
      position: "relative",
      width,
      $nest: {
        "&::after": {
          animationDuration: "1.25s",
          animationIterationCount: "infinite",
          animationName: shkitSkeletonShimmer,
          animationTimingFunction: "ease-in-out",
          background: shimmer,
          content: '""',
          inset: 0,
          position: "absolute",
          transform: "translateX(-100%)"
        }
      }
    }),
  row: style({
    background: color.surfaceMuted,
    borderRadius: radius.sm,
    display: "block",
    height: 42,
    overflow: "hidden",
    position: "relative",
    $nest: {
      "&::after": {
        animationDuration: "1.25s",
        animationIterationCount: "infinite",
        animationName: shkitSkeletonShimmer,
        animationTimingFunction: "ease-in-out",
        background: shimmer,
        content: '""',
        inset: 0,
        position: "absolute",
        transform: "translateX(-100%)"
      }
    }
  }),
  card: style({
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    display: "grid",
    gap: space[10],
    minWidth: 0,
    padding: space[14]
  }),
  table: style({
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    display: "grid",
    minWidth: 0,
    overflow: "hidden"
  }),
  tableHead: style({
    background: color.surfaceSecondary,
    display: "block",
    height: 38
  }),
  tableRow: style({
    background: color.surfaceMuted,
    borderTop: `1px solid ${color.border}`,
    display: "block",
    height: 36,
    overflow: "hidden",
    position: "relative",
    $nest: {
      "&::after": {
        animationDuration: "1.25s",
        animationIterationCount: "infinite",
        animationName: shkitSkeletonShimmer,
        animationTimingFunction: "ease-in-out",
        background: shimmer,
        content: '""',
        inset: 0,
        position: "absolute",
        transform: "translateX(-100%)"
      }
    }
  })
};
