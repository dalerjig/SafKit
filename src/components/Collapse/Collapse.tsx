import { type KeyboardEvent, type ReactNode, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, shkitCollapseIn, space } from "../../tokens";
import { Icon } from "../Icon";

export type CollapseItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  actions?: ReactNode;
};

export type CollapseProps = {
  items: CollapseItem[];
  activeIds?: string[];
  defaultActiveIds?: string[];
  accordion?: boolean;
  onChange?: (activeIds: string[]) => void;
  className?: string;
};

export const Collapse = ({
  items,
  activeIds,
  defaultActiveIds = [],
  accordion,
  onChange,
  className
}: CollapseProps) => {
  const [innerActiveIds, setInnerActiveIds] = useState(defaultActiveIds);
  const currentActiveIds = activeIds ?? innerActiveIds;

  const setActiveIds = (nextIds: string[]) => {
    setInnerActiveIds(nextIds);
    onChange?.(nextIds);
  };

  const toggle = (item: CollapseItem) => {
    if (item.disabled) return;
    const isOpen = currentActiveIds.includes(item.id);
    const nextIds = isOpen
      ? currentActiveIds.filter(id => id !== item.id)
      : accordion
        ? [item.id]
        : [...currentActiveIds, item.id];

    setActiveIds(nextIds);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, item: CollapseItem) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle(item);
  };

  return (
    <div className={classes(collapseStyles.root, className)}>
      {items.map(item => {
        const isOpen = currentActiveIds.includes(item.id);
        const panelId = `shkit-collapse-panel-${item.id}`;

        return (
          <section key={item.id} className={classes(collapseStyles.item, item.disabled && collapseStyles.disabled)}>
            <div className={collapseStyles.header}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={collapseStyles.trigger}
                disabled={item.disabled}
                onClick={() => toggle(item)}
                onKeyDown={event => handleKeyDown(event, item)}
              >
                <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={18} />
                <span>{item.title}</span>
              </button>
              {item.actions && <div className={collapseStyles.actions}>{item.actions}</div>}
            </div>
            <div
              id={panelId}
              className={classes(collapseStyles.panel, isOpen && collapseStyles.panelOpen)}
              hidden={!isOpen}
            >
              <div className={collapseStyles.content}>{item.content}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

const collapseStyles = {
  root: style({
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    display: "grid",
    minWidth: 0,
    overflow: "hidden"
  }),
  item: style({
    background: color.surface,
    minWidth: 0,
    $nest: {
      "& + &": {
        borderTop: `1px solid ${color.border}`
      }
    }
  }),
  disabled: style({
    opacity: 0.56
  }),
  header: style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minWidth: 0
  }),
  trigger: style({
    alignItems: "center",
    background: "transparent",
    border: 0,
    color: color.primary,
    cursor: "pointer",
    display: "grid",
    fontSize: 14,
    fontWeight: 900,
    gap: space[8],
    gridTemplateColumns: "18px minmax(0, 1fr)",
    minHeight: 42,
    minWidth: 0,
    padding: `0 ${space[12]}px`,
    textAlign: "left",
    width: "100%",
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.surfaceMuted
      },
      "&:focus-visible": {
        outline: `2px solid ${color.accent}`,
        outlineOffset: -2
      },
      "& span": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      "& svg": {
        transition: "transform 0.16s ease"
      },
      "&:disabled": {
        cursor: "not-allowed"
      }
    }
  }),
  actions: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[6],
    paddingRight: space[8]
  }),
  panel: style({
    minWidth: 0
  }),
  panelOpen: style({
    animationDuration: "160ms",
    animationName: shkitCollapseIn,
    animationTimingFunction: "cubic-bezier(0.2, 0, 0, 1)"
  }),
  content: style({
    borderTop: `1px solid ${color.border}`,
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.45,
    minWidth: 0,
    padding: space[12]
  })
};
