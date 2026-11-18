import { type WheelEvent } from "react";
import { classes, style } from "typestyle";
import { RESPONSIVE_BREAKPOINTS, color, radius, scrollbar, space, typography } from "../../tokens";

export type SegmentedOption<T extends string | number | boolean> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export type SegmentedControlProps<T extends string | number | boolean> = {
  options: Array<SegmentedOption<T>>;
  value: T;
  onChange?: (value: T) => void;
  fullWidth?: boolean;
  scrollable?: boolean;
  equalItemWidth?: boolean;
  className?: string;
};

export const SegmentedControl = <T extends string | number | boolean,>({
                                                                         options,
                                                                         value,
                                                                         onChange,
                                                                         fullWidth,
                                                                         scrollable = true,
                                                                         equalItemWidth = false,
                                                                         className
                                                                       }: SegmentedControlProps<T>) => {
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!scrollable || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    const element = event.currentTarget;
    if (element.scrollWidth <= element.clientWidth) return;

    event.preventDefault();
    element.scrollLeft += event.deltaY;
  };

  return (
      <div
          className={classes(
              segmentedStyles.root,
              fullWidth && segmentedStyles.fullWidth,
              scrollable && segmentedStyles.scrollable,
              className
          )}
          onWheel={handleWheel}
      >
        {options.map(option => {
          const active = option.value === value;

          return (
              <button
                  key={String(option.value)}
                  type="button"
                  disabled={option.disabled}
                  className={classes(
                      segmentedStyles.item,
                      equalItemWidth && segmentedStyles.equalWidthItem,
                      active && segmentedStyles.active
                  )}
                  onClick={() => onChange?.(option.value)}
              >
                <span className={segmentedStyles.label}>{option.label}</span>
              </button>
          );
        })}
      </div>
  );
}

const segmentedStyles = {
  root: style({
    background: color.surfaceSecondary,
    borderRadius: radius.md,
    display: "inline-flex",
    maxWidth: "100%",
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    padding: 0,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        borderRadius: radius.sm
      }
    }
  }),
  fullWidth: style({
    width: "100%"
  }),
  scrollable: style({
    scrollbarColor: "#d8d8d8 transparent",
    scrollbarWidth: "thin",
    $nest: scrollbar
  }),
  item: style({
    background: "transparent",
    border: 0,
    boxSizing: "border-box",
    color: color.primary,
    cursor: "pointer",
    flex: "1 0 max-content",
    fontSize: 14,
    fontWeight: typography.controlWeight,
    minHeight: 34,
    minWidth: "max-content",
    padding: `0 ${space[12]}px`,
    borderRadius: radius.sm,
    transition: "background 0.18s ease, color 0.18s ease",
    $nest: {
      "&:hover:not(:disabled)": {
        background: "rgba(16, 62, 54, 0.08)"
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5
      },
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.S}px)`]: {
        fontSize: 11,
        minHeight: 30,
        padding: `0 ${space[8]}px`
      }
    }
  }),
  equalWidthItem: style({
    flex: "1 1 0%",
    minWidth: 0
  }),
  label: style({
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  active: style({
    background: color.primary,
    color: color.surface,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.primary
      }
    }
  })
};