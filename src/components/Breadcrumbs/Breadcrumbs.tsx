import { type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";

export type BreadcrumbItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: ReactNode;
  onSelect?: (id: string, item: BreadcrumbItem) => void;
  className?: string;
};

export const Breadcrumbs = ({ items, maxItems = 4, separator = "/", onSelect, className }: BreadcrumbsProps) => {
  const visibleItems = collapseItems(items, maxItems);

  return (
    <nav className={classes(breadcrumbStyles.root, className)} aria-label="Breadcrumbs">
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        const isCollapsed = item.id === "__collapsed";

        return (
          <span key={`${item.id}-${index}`} className={breadcrumbStyles.part}>
            {index > 0 && <span className={breadcrumbStyles.separator}>{separator}</span>}
            {isLast || item.disabled || isCollapsed ? (
              <span className={classes(breadcrumbStyles.item, isLast && breadcrumbStyles.current)}>{item.label}</span>
            ) : (
              <button type="button" className={breadcrumbStyles.button} onClick={() => onSelect?.(item.id, item)}>
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const collapseItems = (items: BreadcrumbItem[], maxItems: number): BreadcrumbItem[]  => {
  if (items.length <= maxItems || maxItems < 3) return items;
  return [
    items[0],
    { id: "__collapsed", label: "..." },
    ...items.slice(items.length - (maxItems - 2))
  ];
}

const breadcrumbStyles = {
  root: style({
    alignItems: "center",
    color: color.textSubtle,
    display: "flex",
    flexWrap: "wrap",
    fontSize: 12,
    fontWeight: 800,
    gap: space[6],
    minWidth: 0
  }),
  part: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6],
    minWidth: 0
  }),
  separator: style({
    color: color.borderStrong
  }),
  item: style({
    borderRadius: radius.xs,
    display: "inline-flex",
    maxWidth: 180,
    minWidth: 0,
    overflow: "hidden",
    padding: "2px 4px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  current: style({
    color: color.primary
  }),
  button: style({
    background: "transparent",
    border: 0,
    borderRadius: radius.xs,
    color: color.textSubtle,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
    margin: 0,
    maxWidth: 180,
    minWidth: 0,
    overflow: "hidden",
    padding: "2px 4px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    $nest: {
      "&:hover": {
        background: color.surfaceSecondary,
        color: color.primary
      }
    }
  })
};
