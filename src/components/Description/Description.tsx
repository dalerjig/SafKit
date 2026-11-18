import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";

export type DescriptionDensity = "regular" | "compact";

export type DescriptionItem = {
  key: string;
  label: ReactNode;
  value?: ReactNode;
  span?: number;
};

export type DescriptionProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  title?: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  items?: DescriptionItem[];
  columns?: number | CSSProperties["gridTemplateColumns"];
  minColumnWidth?: number;
  bordered?: boolean;
  density?: DescriptionDensity;
  emptyText?: ReactNode;
  maxLines?: number;
};

export const Description = ({
  title,
  text,
  children,
  items,
  columns = 2,
  minColumnWidth,
  bordered,
  density = "regular",
  emptyText = "Нет описания",
  maxLines,
  className,
  style: inlineStyle,
  ...rest
}: DescriptionProps) => {
  const hasItems = Boolean(items?.length);
  const body = children ?? text;
  const hasBody = body !== undefined && body !== null && body !== "";

  return (
    <div
      className={classes(descriptionStyles.root(bordered, density), className)}
      style={{
        ...inlineStyle
      }}
      {...rest}
    >
      {title && <h3 className={descriptionStyles.title}>{title}</h3>}

      {hasBody && (
        <div className={classes(descriptionStyles.text(maxLines), bordered && descriptionStyles.textWithBorder)}>{body}</div>
      )}

      {hasItems && (
        <dl
          className={descriptionStyles.grid(bordered, density)}
          style={{ gridTemplateColumns: getGridColumns(columns, minColumnWidth) }}
        >
          {items?.map(item => (
            <div
              key={item.key}
              className={descriptionStyles.item(bordered, density)}
              style={{ gridColumn: item.span ? `span ${item.span}` : undefined }}
            >
              <dt>{item.label}</dt>
              <dd>{isEmptyValue(item.value) ? emptyText : item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {!hasBody && !hasItems && <div className={descriptionStyles.empty}>{emptyText}</div>}
    </div>
  );
}

const isEmptyValue = (value: ReactNode) => {
  return value === undefined || value === null || value === "";
}

const getGridColumns = (columns: DescriptionProps["columns"], minColumnWidth?: number) => {
  if (minColumnWidth) {
    return `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`;
  }

  if (typeof columns === "number") {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }

  return columns;
}

const descriptionStyles = {
  root: (bordered?: boolean, density?: DescriptionDensity) =>
    style({
      background: bordered ? color.surface : "transparent",
      border: bordered ? `1px solid ${color.border}` : "0",
      borderRadius: bordered ? radius.sm : 0,
      boxSizing: "border-box",
      color: color.text,
      display: "grid",
      gap: density === "compact" ? space[8] : space[12],
      minWidth: 0,
      overflow: "hidden",
      padding: bordered ? (density === "compact" ? space[10] : space[14]) : 0
    }),
  title: style({
    color: color.primary,
    fontSize: 15,
    fontWeight: 900,
    lineHeight: 1.25,
    margin: 0,
    overflowWrap: "anywhere"
  }),
  text: (maxLines?: number) =>
    style({
      color: color.textMuted,
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1.45,
      minWidth: 0,
      overflow: maxLines ? "hidden" : undefined,
      overflowWrap: "anywhere",
      ...(maxLines
        ? {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines
          }
        : {})
    }),
  textWithBorder: style({
    paddingBottom: space[4]
  }),
  grid: (bordered?: boolean, density?: DescriptionDensity) =>
    style({
      display: "grid",
      gap: bordered ? 0 : density === "compact" ? space[8] : space[12],
      margin: 0,
      minWidth: 0,
      overflow: "hidden"
    }),
  item: (bordered?: boolean, density?: DescriptionDensity) =>
    style({
      borderTop: bordered ? `1px solid ${color.border}` : undefined,
      display: "grid",
      gap: density === "compact" ? space[2] : space[4],
      minWidth: 0,
      padding: bordered ? (density === "compact" ? `${space[8]}px ${space[6]}px 0` : `${space[10]}px ${space[8]}px 0`) : 0,
      $nest: {
        "& dt": {
          color: color.textSubtle,
          fontSize: 12,
          fontWeight: 900,
          lineHeight: 1.25,
          margin: 0,
          overflowWrap: "anywhere",
          textTransform: "uppercase"
        },
        "& dd": {
          color: color.text,
          fontSize: density === "compact" ? 13 : 14,
          fontWeight: 800,
          lineHeight: 1.35,
          margin: 0,
          minWidth: 0,
          overflowWrap: "anywhere"
        }
      }
    }),
  empty: style({
    color: color.textSubtle,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.4,
    overflowWrap: "anywhere"
  })
};
