import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { classes, style } from "typestyle";
import { color, radius, space, zIndex } from "../../tokens";
import {
  DEFAULT_MARKS_OFFSET,
  MARK_DOT_SIZE,
  MARK_LABEL_AREA,
  MARK_LABEL_HEIGHT,
  RAIL_SIZE,
  THUMB_SIZE,
  VALUE_TYPOGRAPHY,
  buildStepDots,
  getNextKeyboardValue,
  labelStyle,
  normalizeMarks,
  positionStyle,
  ratioFromValue,
  resolveValue,
  toCssSize,
  valueFromRatio
} from "./sliderCore";
import type { SliderMarks } from "./sliderCore";

export type { SliderMark, SliderMarks } from "./sliderCore";

export type SliderProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number | null;
  marks?: SliderMarks;
  /** Distance from track to mark labels in px. Default 8. */
  marksOffset?: number;
  dots?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  vertical?: boolean;
  height?: number | string;
  formatValue?: (value: number) => ReactNode;
  onChange?: (value: number) => void;
  className?: string;
};

export const Slider = ({
  label,
  hint,
  error,
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  marks,
  marksOffset = DEFAULT_MARKS_OFFSET,
  dots = false,
  disabled,
  showValue = true,
  vertical = false,
  height = 200,
  formatValue = nextValue => nextValue,
  onChange,
  className
}: SliderProps) => {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value ?? innerValue;
  const hasError = Boolean(error);
  const normalizedMarks = useMemo(() => normalizeMarks(marks), [marks]);
  const markValues = useMemo(() => normalizedMarks.map(mark => mark.value), [normalizedMarks]);
  const ratio = ratioFromValue(currentValue, min, max);
  const trackHeight = useMemo(() => toCssSize(height), [height]);
  const hasMarks = normalizedMarks.length > 0;

  const dotValues = useMemo(() => {
    const values = new Set<number>();

    if (dots) {
      buildStepDots(min, max, step ?? 1).forEach(dotValue => values.add(dotValue));
    }

    if (hasMarks) {
      markValues.forEach(markValue => values.add(markValue));
    }

    return [...values].sort((left, right) => left - right);
  }, [dots, hasMarks, markValues, max, min, step]);

  const setValue = useCallback(
    (nextValue: number) => {
      const resolved = resolveValue(nextValue, min, max, step, markValues);
      setInnerValue(resolved);
      onChange?.(resolved);
    },
    [markValues, max, min, onChange, step]
  );

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;

      const inset = THUMB_SIZE / 2;
      const nextRatio = vertical
        ? 1 - (clientY - rect.top - inset) / Math.max(rect.height - THUMB_SIZE, 1)
        : (clientX - rect.left - inset) / Math.max(rect.width - THUMB_SIZE, 1);

      setValue(valueFromRatio(nextRatio, min, max, step, markValues));
    },
    [markValues, max, min, setValue, step, vertical]
  );

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX, event.clientY);
  };

  const handleTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return;

    updateFromPointer(event.clientX, event.clientY);
  };

  const handleTrackPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const increase = vertical
      ? event.key === "ArrowUp" || event.key === "ArrowRight"
      : event.key === "ArrowRight" || event.key === "ArrowUp";
    const decrease = vertical
      ? event.key === "ArrowDown" || event.key === "ArrowLeft"
      : event.key === "ArrowLeft" || event.key === "ArrowDown";

    if (increase) {
      event.preventDefault();
      setValue(getNextKeyboardValue(currentValue, 1, min, max, step, markValues));
    }

    if (decrease) {
      event.preventDefault();
      setValue(getNextKeyboardValue(currentValue, -1, min, max, step, markValues));
    }
  };

  const fillStyle: CSSProperties = vertical
    ? { height: `${ratio * 100}%` }
    : { width: `${ratio * 100}%` };

  const thumbStyle: CSSProperties = positionStyle(ratio, vertical);
  const trackStyle: CSSProperties = {
    ...(vertical ? { height: trackHeight } : {}),
    ...(hasMarks && vertical ? { paddingRight: marksOffset + MARK_LABEL_AREA } : {}),
    ...(hasMarks && !vertical ? { paddingBottom: marksOffset + MARK_LABEL_HEIGHT } : {})
  };

  return (
    <div
      className={classes(
        sliderStyles.root,
        vertical && sliderStyles.rootVertical,
        disabled && sliderStyles.disabled,
        className
      )}
    >
      {(label || showValue) && (
        <span className={classes(sliderStyles.header, vertical && sliderStyles.headerVertical)}>
          {label && (
            <span id={`${id}-label`} className={classes(sliderStyles.label, hasError && sliderStyles.errorText)}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={classes(sliderStyles.valueSlot, vertical && sliderStyles.valueSlotVertical)}>
              <span className={sliderStyles.valueSizer} aria-hidden>{formatValue(min)}</span>
              <span className={sliderStyles.valueSizer} aria-hidden>{formatValue(max)}</span>
              <span className={sliderStyles.value}>{formatValue(currentValue)}</span>
            </span>
          )}
        </span>
      )}
      <div
        ref={trackRef}
        className={classes(
          sliderStyles.track,
          hasMarks && sliderStyles.trackWithMarks,
          vertical && sliderStyles.trackVertical,
          hasMarks && vertical && sliderStyles.trackWithVerticalMarks,
          disabled && sliderStyles.trackDisabled
        )}
        style={trackStyle}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
        onPointerCancel={handleTrackPointerUp}
      >
        <span
          className={classes(sliderStyles.rail, vertical && sliderStyles.railVertical, hasError && sliderStyles.railInvalid)}
          aria-hidden
        />
        <span
          className={classes(sliderStyles.fill, vertical && sliderStyles.fillVertical)}
          style={fillStyle}
          aria-hidden
        />
        {dotValues.map(dotValue => {
          const dotRatio = ratioFromValue(dotValue, min, max);
          const isActive = dotValue <= currentValue;

          return (
            <span
              key={dotValue}
              className={classes(sliderStyles.dot, isActive && sliderStyles.dotActive)}
              style={positionStyle(dotRatio, vertical)}
              aria-hidden
            />
          );
        })}
        {normalizedMarks.map(mark => {
          const markRatio = ratioFromValue(mark.value, min, max);

          return (
            <span
              key={mark.value}
              className={classes(sliderStyles.markLabel, vertical && sliderStyles.markLabelVertical)}
              style={labelStyle(markRatio, vertical, marksOffset, mark.style)}
            >
              {mark.label}
            </span>
          );
        })}
        <span className={sliderStyles.thumb} style={thumbStyle} aria-hidden />
      </div>
      {(error || hint) && (
        <span className={classes(sliderStyles.caption, hasError && sliderStyles.errorText)}>{error || hint}</span>
      )}
    </div>
  );
};

const sliderStyles = {
  root: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0,
    width: "100%"
  }),
  rootVertical: style({
    alignItems: "center",
    width: "auto"
  }),
  disabled: style({
    opacity: 0.58
  }),
  header: style({
    alignItems: "center",
    display: "flex",
    gap: space[8],
    justifyContent: "space-between",
    minWidth: 0,
    width: "100%"
  }),
  headerVertical: style({
    alignItems: "center",
    flexDirection: "column",
    gap: space[4],
    justifyContent: "flex-start"
  }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  /** Keeps the header width stable: hidden sizers reserve room for the widest possible value. */
  valueSlot: style({
    display: "inline-grid",
    flexShrink: 0,
    justifyItems: "end"
  }),
  valueSlotVertical: style({
    justifyItems: "center"
  }),
  valueSizer: style({
    ...VALUE_TYPOGRAPHY,
    gridArea: "1 / 1",
    height: 0,
    overflow: "hidden",
    visibility: "hidden"
  }),
  value: style({
    ...VALUE_TYPOGRAPHY,
    color: color.primary,
    gridArea: "1 / 1"
  }),
  track: style({
    boxSizing: "border-box",
    cursor: "pointer",
    height: THUMB_SIZE,
    outline: "none",
    padding: `${(THUMB_SIZE - RAIL_SIZE) / 2}px 0`,
    position: "relative",
    touchAction: "none",
    width: "100%",
    $nest: {
      "&:focus-visible": {
        borderRadius: radius.xs,
        boxShadow: "0 0 0 3px rgba(16, 62, 54, 0.22)"
      }
    }
  }),
  trackWithMarks: style({
    overflow: "visible"
  }),
  trackVertical: style({
    overflow: "visible",
    padding: `0 ${(THUMB_SIZE - RAIL_SIZE) / 2}px`,
    width: THUMB_SIZE
  }),
  trackWithVerticalMarks: style({}),
  trackDisabled: style({
    cursor: "not-allowed"
  }),
  rail: style({
    background: color.border,
    borderRadius: radius.xs,
    height: RAIL_SIZE,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)"
  }),
  railVertical: style({
    bottom: 0,
    height: "auto",
    left: "50%",
    right: "auto",
    top: 0,
    transform: "translateX(-50%)",
    width: RAIL_SIZE
  }),
  railInvalid: style({
    background: "#F1C2BA"
  }),
  fill: style({
    background: color.primary,
    borderRadius: radius.xs,
    height: RAIL_SIZE,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)"
  }),
  fillVertical: style({
    bottom: 0,
    height: "auto",
    left: "50%",
    top: "auto",
    transform: "translateX(-50%)",
    width: RAIL_SIZE
  }),
  dot: style({
    background: color.surface,
    border: `2px solid ${color.borderStrong}`,
    borderRadius: "50%",
    boxSizing: "border-box",
    height: MARK_DOT_SIZE,
    pointerEvents: "none",
    position: "absolute",
    width: MARK_DOT_SIZE,
    zIndex: 1
  }),
  dotActive: style({
    borderColor: color.primary
  }),
  thumb: style({
    background: color.primary,
    border: `2px solid ${color.surface}`,
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(25, 25, 25, 0.22)",
    height: THUMB_SIZE,
    pointerEvents: "none",
    position: "absolute",
    width: THUMB_SIZE,
    zIndex: zIndex.contentOverlay
  }),
  markLabel: style({
    color: color.textMuted,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1.2,
    pointerEvents: "none",
    position: "absolute",
    whiteSpace: "nowrap"
  }),
  markLabelVertical: style({
    textAlign: "left"
  }),
  caption: style({
    color: color.textMuted,
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    width: "100%"
  }),
  errorText: style({
    color: color.danger
  })
};
