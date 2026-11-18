import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
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
  VALUE_TYPOGRAPHY,
  buildStepDots,
  clamp,
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

export type RangeSliderValue = [number, number];

export type RangeSliderMode = "range" | "single";

type RangeSliderBaseProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  min?: number;
  max?: number;
  step?: number | null;
  marks?: SliderMarks;
  /** Distance from track to mark labels in px. Default 8. */
  marksOffset?: number;
  dots?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  /** Vertical layout puts one bar on top and the other on the bottom. Default true. */
  vertical?: boolean;
  height?: number | string;
  /** Length of the bar across the track in px. Default 30. */
  barLength?: number;
  formatValue?: (value: number) => ReactNode;
  className?: string;
};

export type RangeSliderRangeProps = RangeSliderBaseProps & {
  /** Two bars selecting a range. Default. */
  mode?: "range";
  value?: RangeSliderValue;
  defaultValue?: RangeSliderValue;
  /** Minimal gap between both bars in value units. Default 0. */
  minDistance?: number;
  onChange?: (value: RangeSliderValue) => void;
};

export type RangeSliderSingleProps = RangeSliderBaseProps & {
  /** One bar with the same look as the range bars, filled from the start of the track. */
  mode: "single";
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export type RangeSliderProps = RangeSliderRangeProps | RangeSliderSingleProps;

const BAR_THICKNESS = 6;
const DEFAULT_BAR_LENGTH = 30;

const sortRange = (range: RangeSliderValue): RangeSliderValue =>
  range[0] <= range[1] ? range : [range[1], range[0]];

export const RangeSlider = (props: RangeSliderProps) => {
  const {
    label,
    hint,
    error,
    min = 0,
    max = 100,
    step = 1,
    marks,
    marksOffset = DEFAULT_MARKS_OFFSET,
    dots = false,
    disabled,
    showValue = true,
    vertical = true,
    height = 200,
    barLength = DEFAULT_BAR_LENGTH,
    formatValue = nextValue => nextValue,
    className
  } = props;
  const single = props.mode === "single";
  const minDistance = props.mode === "single" ? 0 : props.minDistance ?? 0;
  const singleValue = props.mode === "single" ? props.value : undefined;
  const singleDefaultValue = props.mode === "single" ? props.defaultValue : undefined;
  const onSingleChange = props.mode === "single" ? props.onChange : undefined;
  const rangeValue = props.mode === "single" ? undefined : props.value;
  const rangeDefaultValue = props.mode === "single" ? undefined : props.defaultValue;
  const onRangeChange = props.mode === "single" ? undefined : props.onChange;
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeThumb = useRef<0 | 1>(single ? 1 : 0);
  const [innerValue, setInnerValue] = useState<RangeSliderValue>(
    single ? [min, singleDefaultValue ?? min] : sortRange(rangeDefaultValue ?? [min, max])
  );
  // A single bar reuses the upper thumb, so the fill always starts at the beginning of the track.
  const [lower, upper] = single
    ? ([min, clamp(singleValue ?? innerValue[1], min, max)] as RangeSliderValue)
    : sortRange(rangeValue ?? innerValue);
  const hasError = Boolean(error);
  const normalizedMarks = useMemo(() => normalizeMarks(marks), [marks]);
  const markValues = useMemo(() => normalizedMarks.map(mark => mark.value), [normalizedMarks]);
  const lowerRatio = ratioFromValue(lower, min, max);
  const upperRatio = ratioFromValue(upper, min, max);
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

  const setThumbValue = (thumb: 0 | 1, nextValue: number) => {
    const resolved = resolveValue(nextValue, min, max, step, markValues);
    const next: RangeSliderValue =
      thumb === 0
        ? [clamp(Math.min(resolved, upper - minDistance), min, max), upper]
        : [lower, clamp(Math.max(resolved, lower + minDistance), min, max)];

    if (next[0] === lower && next[1] === upper) return;

    setInnerValue(next);
    onSingleChange?.(next[1]);
    onRangeChange?.(next);
  };

  const ratioFromPointer = (clientX: number, clientY: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const inset = BAR_THICKNESS / 2;
    return vertical
      ? 1 - (clientY - rect.top - inset) / Math.max(rect.height - BAR_THICKNESS, 1)
      : (clientX - rect.left - inset) / Math.max(rect.width - BAR_THICKNESS, 1);
  };

  const updateFromPointer = (thumb: 0 | 1, clientX: number, clientY: number) => {
    const pointerRatio = ratioFromPointer(clientX, clientY);
    if (pointerRatio === null) return;

    setThumbValue(thumb, valueFromRatio(pointerRatio, min, max, step, markValues));
  };

  const pickClosestThumb = (clientX: number, clientY: number): 0 | 1 => {
    if (single) return 1;

    const pointerRatio = ratioFromPointer(clientX, clientY);
    if (pointerRatio === null) return 0;

    const lowerDistance = Math.abs(pointerRatio - lowerRatio);
    const upperDistance = Math.abs(pointerRatio - upperRatio);

    if (lowerDistance === upperDistance) return pointerRatio > upperRatio ? 1 : 0;
    return lowerDistance < upperDistance ? 0 : 1;
  };

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    const thumb = pickClosestThumb(event.clientX, event.clientY);
    activeThumb.current = thumb;
    thumbRefs.current[thumb]?.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(thumb, event.clientX, event.clientY);
  };

  const handleTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId)) return;

    updateFromPointer(activeThumb.current, event.clientX, event.clientY);
  };

  const handleTrackPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleThumbKeyDown = (thumb: 0 | 1) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;

    const increase = event.key === "ArrowRight" || event.key === "ArrowUp";
    const decrease = event.key === "ArrowLeft" || event.key === "ArrowDown";
    if (!increase && !decrease) return;

    event.preventDefault();
    const currentValue = thumb === 0 ? lower : upper;
    setThumbValue(thumb, getNextKeyboardValue(currentValue, increase ? 1 : -1, min, max, step, markValues));
  };

  const fillStyle: CSSProperties = vertical
    ? { bottom: `${lowerRatio * 100}%`, height: `${(upperRatio - lowerRatio) * 100}%` }
    : { left: `${lowerRatio * 100}%`, width: `${(upperRatio - lowerRatio) * 100}%` };

  const trackStyle: CSSProperties = {
    ...(vertical ? { height: trackHeight, width: barLength } : { height: barLength }),
    ...(hasMarks && vertical ? { paddingRight: marksOffset + MARK_LABEL_AREA } : {}),
    ...(hasMarks && !vertical ? { paddingBottom: marksOffset + MARK_LABEL_HEIGHT } : {})
  };

  const barStyle = (ratio: number): CSSProperties => ({
    ...positionStyle(ratio, vertical),
    ...(vertical ? { height: BAR_THICKNESS, width: barLength } : { height: barLength, width: BAR_THICKNESS })
  });

  const renderThumb = (thumb: 0 | 1) => {
    const thumbValue = thumb === 0 ? lower : upper;

    return (
      <span
        ref={node => {
          thumbRefs.current[thumb] = node;
        }}
        className={classes(rangeSliderStyles.bar, disabled && rangeSliderStyles.barDisabled)}
        style={barStyle(thumb === 0 ? lowerRatio : upperRatio)}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-valuemin={thumb === 0 ? min : lower + minDistance}
        aria-valuemax={thumb === 0 ? upper - minDistance : max}
        aria-valuenow={thumbValue}
        aria-label={single ? undefined : thumb === 0 ? "Minimum" : "Maximum"}
        aria-labelledby={single && label ? `${id}-label` : undefined}
        aria-disabled={disabled || undefined}
        onKeyDown={handleThumbKeyDown(thumb)}
      />
    );
  };

  return (
    <div
      className={classes(
        rangeSliderStyles.root,
        vertical && rangeSliderStyles.rootVertical,
        disabled && rangeSliderStyles.disabled,
        className
      )}
    >
      {(label || showValue) && (
        <span className={classes(rangeSliderStyles.header, vertical && rangeSliderStyles.headerVertical)}>
          {label && (
            <span
              id={`${id}-label`}
              className={classes(rangeSliderStyles.label, hasError && rangeSliderStyles.errorText)}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span className={classes(rangeSliderStyles.valueSlot, vertical && rangeSliderStyles.valueSlotVertical)}>
              <span className={rangeSliderStyles.valueSizer} aria-hidden>
                {single ? formatValue(min) : <>{formatValue(min)} — {formatValue(min)}</>}
              </span>
              <span className={rangeSliderStyles.valueSizer} aria-hidden>
                {single ? formatValue(max) : <>{formatValue(max)} — {formatValue(max)}</>}
              </span>
              <span className={rangeSliderStyles.value}>
                {single ? formatValue(upper) : <>{formatValue(lower)} — {formatValue(upper)}</>}
              </span>
            </span>
          )}
        </span>
      )}
      <div
        ref={trackRef}
        className={classes(
          rangeSliderStyles.track,
          vertical && rangeSliderStyles.trackVertical,
          disabled && rangeSliderStyles.trackDisabled
        )}
        style={trackStyle}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
        onPointerCancel={handleTrackPointerUp}
      >
        <span
          className={classes(
            rangeSliderStyles.rail,
            vertical && rangeSliderStyles.railVertical,
            hasError && rangeSliderStyles.railInvalid
          )}
          aria-hidden
        />
        <span
          className={classes(rangeSliderStyles.fill, vertical && rangeSliderStyles.fillVertical)}
          style={fillStyle}
          aria-hidden
        />
        {dotValues.map(dotValue => {
          const dotRatio = ratioFromValue(dotValue, min, max);
          const isActive = dotValue >= lower && dotValue <= upper;

          return (
            <span
              key={dotValue}
              className={classes(rangeSliderStyles.dot, isActive && rangeSliderStyles.dotActive)}
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
              className={classes(
                rangeSliderStyles.markLabel,
                vertical && rangeSliderStyles.markLabelVertical
              )}
              style={labelStyle(markRatio, vertical, marksOffset, mark.style)}
            >
              {mark.label}
            </span>
          );
        })}
        {!single && renderThumb(0)}
        {renderThumb(1)}
      </div>
      {(error || hint) && (
        <span className={classes(rangeSliderStyles.caption, hasError && rangeSliderStyles.errorText)}>
          {error || hint}
        </span>
      )}
    </div>
  );
};

const rangeSliderStyles = {
  root: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0,
    width: "100%"
  }),
  rootVertical: style({
    alignItems: "center",
    justifyItems: "center",
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
  /** Keeps the header width stable: hidden sizers reserve room for the widest possible range. */
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
    outline: "none",
    overflow: "visible",
    position: "relative",
    touchAction: "none",
    width: "100%"
  }),
  trackVertical: style({
    width: "auto"
  }),
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
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)"
  }),
  fillVertical: style({
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
  bar: style({
    background: color.primary,
    borderRadius: radius.xs,
    boxShadow: "0 2px 8px rgba(25, 25, 25, 0.22)",
    boxSizing: "border-box",
    cursor: "grab",
    outline: "none",
    position: "absolute",
    touchAction: "none",
    zIndex: zIndex.contentOverlay,
    $nest: {
      "&:focus-visible": {
        boxShadow: "0 0 0 3px rgba(16, 62, 54, 0.22)"
      },
      "&:active": {
        cursor: "grabbing"
      }
    }
  }),
  barDisabled: style({
    cursor: "not-allowed"
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
