import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, space } from "../../tokens";

type SpaceKey = keyof typeof space;
type GapValue = SpaceKey | CSSProperties["gap"];

export type FlowMode = "vertical" | "horizontal" | "grid";
export type DividerOrientation = "horizontal" | "vertical";
export type DividerTextAlign = "start" | "center" | "end";

export type FlowProps = HTMLAttributes<HTMLDivElement> & {
  mode?: FlowMode;
  gap?: GapValue;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
  columns?: number | CSSProperties["gridTemplateColumns"];
  minColumnWidth?: number;
  fullWidth?: boolean;
};

export type DividerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  orientation?: DividerOrientation;
  textAlign?: DividerTextAlign;
  inset?: boolean;
};

export const Flow = ({
  mode = "vertical",
  gap = 12,
  align,
  justify,
  wrap,
  columns = 2,
  minColumnWidth,
  fullWidth = true,
  className,
  style: inlineStyle,
  ...rest
}: FlowProps) => {
  const isGrid = mode === "grid";

  return (
    <div
      className={classes(
        flowStyles.root,
        mode === "vertical" && flowStyles.vertical,
        mode === "horizontal" && flowStyles.horizontal,
        isGrid && flowStyles.grid,
        wrap && flowStyles.wrap,
        fullWidth && flowStyles.fullWidth,
        className
      )}
      style={{
        alignItems: align,
        gap: resolveGap(gap),
        gridTemplateColumns: isGrid ? getGridColumns(columns, minColumnWidth) : undefined,
        justifyContent: justify,
        ...inlineStyle
      }}
      {...rest}
    />
  );
}

export const Divider = ({
  children,
  orientation = "horizontal",
  textAlign = "center",
  inset,
  className,
  style: inlineStyle,
  ...rest
}: DividerProps) => {
  const hasText = orientation === "horizontal" && Boolean(children);

  return (
    <div
      className={classes(
        dividerStyles.root,
        orientation === "vertical" ? dividerStyles.vertical : dividerStyles.horizontal,
        hasText && dividerStyles.withText,
        hasText && dividerStyles.textAlign(textAlign),
        inset && dividerStyles.inset(orientation),
        className
      )}
      role="separator"
      aria-orientation={orientation}
      style={inlineStyle}
      {...rest}
    >
      {hasText && <span className={dividerStyles.text}>{children}</span>}
    </div>
  );
}

const resolveGap = (gap: GapValue) => {
  return typeof gap === "number" && gap in space ? space[gap as SpaceKey] : gap;
}

const getGridColumns = (columns: FlowProps["columns"], minColumnWidth?: number) => {
  if (minColumnWidth) {
    return `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`;
  }

  if (typeof columns === "number") {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }

  return columns;
}

const flowStyles = {
  root: style({
    minWidth: 0
  }),
  vertical: style({
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column"
  }),
  horizontal: style({
    alignItems: "center",
    display: "flex"
  }),
  grid: style({
    display: "grid"
  }),
  wrap: style({
    flexWrap: "wrap"
  }),
  fullWidth: style({
    width: "100%"
  })
};

const dividerStyles = {
  root: style({
    boxSizing: "border-box",
    color: color.textSubtle,
    minWidth: 0
  }),
  horizontal: style({
    alignItems: "center",
    borderTop: `1px solid ${color.border}`,
    display: "flex",
    margin: `${space[12]}px 0`,
    width: "100%"
  }),
  vertical: style({
    alignSelf: "stretch",
    borderLeft: `1px solid ${color.border}`,
    display: "inline-flex",
    minHeight: 24,
    width: 0
  }),
  withText: style({
    borderTop: 0,
    gap: space[8],
    $nest: {
      "&::before, &::after": {
        borderTop: `1px solid ${color.border}`,
        content: '""',
        minWidth: space[16]
      }
    }
  }),
  textAlign: (textAlign: DividerTextAlign) =>
    style({
      $nest: {
        "&::before": {
          flex: textAlign === "start" ? "0 0 24px" : textAlign === "center" ? "1 1 0" : "1 1 0"
        },
        "&::after": {
          flex: textAlign === "end" ? "0 0 24px" : textAlign === "center" ? "1 1 0" : "1 1 0"
        }
      }
    }),
  text: style({
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.3
  }),
  inset: (orientation: DividerOrientation) =>
    style(
      orientation === "horizontal"
        ? {
            marginLeft: space[16],
            marginRight: space[16],
            width: `calc(100% - ${space[32]}px)`
          }
        : {
            marginBottom: space[8],
            marginTop: space[8]
          }
    )
};
