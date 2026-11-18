import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

export type ElementGroupItem = {
  id: string;
  element: ReactNode;
  overflowElement?: ReactNode;
};

export type ElementGroupProps = {
  items: ElementGroupItem[];
  gap?: number;
  overflowIcon?: ReactNode;
  overflowLabel?: ReactNode;
  renderOverflowTrigger?: (hiddenCount: number) => ReactNode;
  className?: string;
};

export const ElementGroup = ({
  items,
  gap = space[8],
  overflowIcon = <Icon name="more" />,
  overflowLabel = "Еще",
  renderOverflowTrigger,
  className
}: ElementGroupProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef(new Map<string, HTMLDivElement>());
  const overflowRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const calculate = () => {
      const availableWidth = root.clientWidth;
      const widths = items.map(item => measureRefs.current.get(item.id)?.offsetWidth ?? 0);
      const overflowWidth = overflowRef.current?.offsetWidth ?? 44;
      let used = 0;
      let nextVisibleCount = items.length;

      for (let index = 0; index < widths.length; index += 1) {
        const nextUsed = used + widths[index] + (index > 0 ? gap : 0);
        const remainingItems = items.length - index - 1;
        const reserveOverflow = remainingItems > 0 ? overflowWidth + gap : 0;

        if (nextUsed + reserveOverflow > availableWidth) {
          nextVisibleCount = index;
          break;
        }

        used = nextUsed;
      }

      setVisibleCount(nextVisibleCount);
    };

    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(root);
    return () => observer.disconnect();
  }, [gap, items]);

  const visibleItems = items.slice(0, visibleCount);
  const hiddenItems = items.slice(visibleCount);
  const defaultOverflowTrigger = (
    <Tooltip content={overflowLabel} placement="bottom">
      <Button size="sm" variant="outline" square icon={overflowIcon} aria-label={String(overflowLabel)} />
    </Tooltip>
  );

  return (
    <div ref={rootRef} className={classes(elementGroupStyles.root, className)} style={{ gap }}>
      <div className={elementGroupStyles.measure} aria-hidden>
        {items.map(item => (
          <div key={item.id} ref={element => setMeasureRef(measureRefs.current, item.id, element)}>
            {item.element}
          </div>
        ))}
        <div ref={overflowRef}>{renderOverflowTrigger ? renderOverflowTrigger(1) : defaultOverflowTrigger}</div>
      </div>

      {visibleItems.map(item => (
        <div key={item.id} className={elementGroupStyles.item}>
          {item.element}
        </div>
      ))}

      {hiddenItems.length > 0 && (
        <Dropdown
          trigger={
            renderOverflowTrigger ? (
              renderOverflowTrigger(hiddenItems.length)
            ) : (
              defaultOverflowTrigger
            )
          }
        >
          <div className={elementGroupStyles.menu}>
            {hiddenItems.map(item => (
              <div key={item.id} className={elementGroupStyles.menuItem}>
                {item.overflowElement ?? item.element}
              </div>
            ))}
          </div>
        </Dropdown>
      )}
    </div>
  );
}

const setMeasureRef = (map: Map<string, HTMLDivElement>, id: string, element: HTMLDivElement | null) => {
  if (element) {
    map.set(id, element);
  } else {
    map.delete(id);
  }
}

const elementGroupStyles = {
  root: style({
    alignItems: "center",
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
    position: "relative",
    width: "100%"
  }),
  item: style({
    flexShrink: 0
  }),
  measure: style({
    alignItems: "center",
    display: "flex",
    gap: space[8],
    height: 0,
    left: 0,
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    visibility: "hidden"
  }),
  menu: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 14px 34px rgba(25, 25, 25, 0.16)",
    display: "grid",
    gap: space[6],
    minWidth: 220,
    padding: space[8]
  }),
  menuItem: style({
    minWidth: 0
  })
};
