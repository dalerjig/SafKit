import type { CSSProperties, ReactNode } from "react";

export type SliderMark = ReactNode | { label: ReactNode; style?: CSSProperties };

export type SliderMarks = Record<number, SliderMark>;

export type NormalizedMark = {
  label: ReactNode;
  style?: CSSProperties;
  value: number;
};

export const THUMB_SIZE = 18;
export const RAIL_SIZE = 4;
export const MARK_DOT_SIZE = 6;
export const DEFAULT_MARKS_OFFSET = 8;
export const MARK_LABEL_HEIGHT = 14;
export const MARK_LABEL_AREA = 40;

/** Shared typography for the header value, also applied to the hidden width sizers. */
export const VALUE_TYPOGRAPHY = {
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  fontWeight: 900,
  whiteSpace: "nowrap"
} as const;

export const toCssSize = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ratioFromValue = (value: number, min: number, max: number) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

const snapToStep = (value: number, min: number, max: number, step: number) => {
  if (step <= 0) return clamp(value, min, max);
  const stepped = min + Math.round((value - min) / step) * step;
  return clamp(stepped, min, max);
};

const snapToNearest = (value: number, points: number[]) => {
  if (points.length === 0) return value;

  return points.reduce((closest, point) =>
    Math.abs(point - value) < Math.abs(closest - value) ? point : closest
  );
};

export const normalizeMarks = (marks?: SliderMarks): NormalizedMark[] => {
  if (!marks) return [];

  return Object.entries(marks)
    .map(([key, mark]) => {
      const value = Number(key);
      if (!Number.isFinite(value)) return null;

      if (typeof mark === "object" && mark !== null && "label" in mark) {
        return { value, label: mark.label, style: mark.style };
      }

      return { value, label: mark as ReactNode };
    })
    .filter((mark): mark is NormalizedMark => mark !== null)
    .sort((left, right) => left.value - right.value);
};

const countDecimals = (value: number) => {
  const text = String(value);
  const index = text.indexOf(".");
  return index === -1 ? 0 : text.length - index - 1;
};

const roundToPrecision = (value: number, precision: number) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export const buildStepDots = (min: number, max: number, step: number) => {
  if (step <= 0 || max < min) return [];

  const values: number[] = [];
  const precision = Math.max(countDecimals(step), countDecimals(min), countDecimals(max));

  for (let current = min; current <= max + step / 2; current += step) {
    const rounded = roundToPrecision(current, precision);
    if (rounded > max) break;
    values.push(rounded);
  }

  return values;
};

export const resolveValue = (
  raw: number,
  min: number,
  max: number,
  step: number | null | undefined,
  markValues: number[]
) => {
  const clamped = clamp(raw, min, max);

  if (markValues.length > 0 && step == null) {
    return snapToNearest(clamped, markValues);
  }

  return snapToStep(clamped, min, max, step ?? 1);
};

export const valueFromRatio = (
  ratio: number,
  min: number,
  max: number,
  step: number | null | undefined,
  markValues: number[]
) => {
  return resolveValue(min + clamp(ratio, 0, 1) * (max - min), min, max, step, markValues);
};

const snapToNearestIndex = (value: number, markValues: number[]) => {
  let closestIndex = 0;

  markValues.forEach((markValue, index) => {
    if (Math.abs(markValue - value) < Math.abs(markValues[closestIndex] - value)) {
      closestIndex = index;
    }
  });

  return closestIndex;
};

export const getNextKeyboardValue = (
  currentValue: number,
  direction: 1 | -1,
  min: number,
  max: number,
  step: number | null | undefined,
  markValues: number[]
) => {
  if (markValues.length > 0 && step == null) {
    const currentIndex = markValues.findIndex(value => value === currentValue);
    const resolvedIndex = currentIndex === -1 ? snapToNearestIndex(currentValue, markValues) : currentIndex;
    const nextIndex = clamp(resolvedIndex + direction, 0, markValues.length - 1);
    return markValues[nextIndex];
  }

  return resolveValue(currentValue + direction * (step ?? 1), min, max, step, markValues);
};

export const positionStyle = (markRatio: number, vertical: boolean): CSSProperties =>
  vertical
    ? { bottom: `${markRatio * 100}%`, left: "50%", transform: "translate(-50%, 50%)" }
    : { left: `${markRatio * 100}%`, top: "50%", transform: "translate(-50%, -50%)" };

export const labelStyle = (
  markRatio: number,
  vertical: boolean,
  marksOffset: number,
  markStyle?: CSSProperties
): CSSProperties => ({
  ...markStyle,
  ...(vertical
    ? { bottom: `${markRatio * 100}%`, left: "100%", transform: `translate(${marksOffset}px, 50%)` }
    : { left: `${markRatio * 100}%`, top: "100%", transform: `translate(-50%, ${marksOffset}px)` })
});
