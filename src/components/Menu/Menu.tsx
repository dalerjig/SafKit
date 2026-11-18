import { type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";

export type MenuItem = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  danger?: boolean;
};

export type MenuProps = {
  items: MenuItem[];
  onSelect?: (key: string, item: MenuItem) => void;
  className?: string;
};

export const Menu = ({ items, onSelect, className }: MenuProps) => {
  return (
    <div className={classes(menuStyles.root, className)} role="menu">
      {items.map(item => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          className={classes(menuStyles.item, item.selected && menuStyles.selected, item.danger && menuStyles.danger)}
          onClick={() => onSelect?.(item.key, item)}
        >
          {item.icon && <span className={menuStyles.icon}>{item.icon}</span>}
          <span className={menuStyles.label}>{item.label}</span>
          {item.selected && <span className={menuStyles.check}>✓</span>}
        </button>
      ))}
    </div>
  );
}

const menuStyles = {
  root: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 14px 34px rgba(25, 25, 25, 0.16)",
    display: "grid",
    gap: space[4],
    minWidth: 180,
    padding: space[6]
  }),
  item: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    display: "grid",
    fontSize: 14,
    fontWeight: 700,
    gap: space[8],
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    minHeight: 34,
    padding: `0 ${space[10]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.surfaceMuted
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5
      }
    }
  }),
  selected: style({
    background: color.surfaceSecondary,
    color: color.primary
  }),
  danger: style({
    color: color.danger
  }),
  icon: style({
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center"
  }),
  label: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  check: style({
    color: color.primary,
    fontWeight: 900
  })
};
