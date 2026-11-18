import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, scrollbar, space } from "../../tokens";

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string, item: TabItem) => void;
  className?: string;
};

export const Tabs = ({ items, activeId, defaultActiveId, onChange, className }: TabsProps) => {
  const generatedId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabledId = items.find(item => !item.disabled)?.id ?? items[0]?.id ?? "";
  const [innerActiveId, setInnerActiveId] = useState(defaultActiveId ?? firstEnabledId);
  const currentActiveId = activeId ?? innerActiveId;
  const activeItem = items.find(item => item.id === currentActiveId) ?? items.find(item => !item.disabled);

  const selectItem = (item: TabItem) => {
    if (item.disabled) return;
    setInnerActiveId(item.id);
    onChange?.(item.id, item);
  };

  const focusTab = (index: number) => {
    const enabledIndexes = items.map((item, itemIndex) => ({ item, itemIndex })).filter(({ item }) => !item.disabled);
    if (enabledIndexes.length === 0) return;
    const next = enabledIndexes[(index + enabledIndexes.length) % enabledIndexes.length];
    tabRefs.current[next.itemIndex]?.focus();
    selectItem(next.item);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    }
  };

  return (
    <div className={classes(tabsStyles.root, className)}>
      <div className={tabsStyles.tabList} role="tablist">
        {items.map((item, index) => {
          const isActive = item.id === activeItem?.id;
          const tabId = `${generatedId}-tab-${item.id}`;
          const panelId = `${generatedId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={node => {
                tabRefs.current[index] = node;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              disabled={item.disabled}
              tabIndex={isActive ? 0 : -1}
              className={classes(tabsStyles.tab, isActive && tabsStyles.tabActive)}
              onClick={() => selectItem(item)}
              onKeyDown={event => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          id={`${generatedId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${generatedId}-tab-${activeItem.id}`}
          className={tabsStyles.panel}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}

const tabsStyles = {
  root: style({
    display: "grid",
    gap: space[12],
    minWidth: 0
  }),
  tabList: style({
    background: color.surfaceSecondary,
    borderRadius: radius.md,
    display: "flex",
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    $nest: scrollbar
  }),
  tab: style({
    background: "transparent",
    border: 0,
    borderRadius: radius.md,
    color: color.primary,
    cursor: "pointer",
    flex: "1 0 max-content",
    fontSize: 14,
    fontWeight: 900,
    minHeight: 40,
    minWidth: "max-content",
    padding: `0 ${space[14]}px`,
    transition: "background 0.16s ease, color 0.16s ease",
    whiteSpace: "nowrap",
    $nest: {
      "&:hover:not(:disabled)": {
        background: "rgba(16, 62, 54, 0.08)"
      },
      "&:focus-visible": {
        boxShadow: `inset 0 0 0 2px ${color.accent}`,
        outline: "none"
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5
      }
    }
  }),
  tabActive: style({
    background: color.primary,
    color: color.surface,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.primary
      }
    }
  }),
  panel: style({
    minWidth: 0
  })
};
