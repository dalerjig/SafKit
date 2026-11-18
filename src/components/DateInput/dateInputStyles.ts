import { style } from "typestyle";
import { color, radius, scrollbar, shadow, space, zIndex } from "../../tokens";
import { type InputSize } from "../Input";

const heights: Record<InputSize, number> = {
  xs: 26,
  sm: 32,
  md: 40,
  lg: 52
};

const fontSizes: Record<InputSize, number> = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 18
};

export const dateInputStyles = {
  root: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0
  }),
  disabled: style({
    opacity: 0.58
  }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800
  }),
  control: (size: InputSize) =>
    style({
      alignItems: "center",
      background: color.surface,
      border: `1px solid ${color.borderStrong}`,
      borderRadius: radius.sm,
      boxSizing: "border-box",
      display: "grid",
      gap: space[8],
      gridTemplateColumns: "minmax(0, 1fr) auto",
      height: heights[size],
      minWidth: 0,
      padding: `0 ${space[10]}px`,
      position: "relative",
      transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
      width: "100%",
      $nest: {
        "&:focus-within": {
          borderColor: color.primary,
          boxShadow: shadow.focus
        },
        "& input": {
          appearance: "none",
          background: "transparent",
          border: 0,
          color: "transparent",
          cursor: "pointer",
          fontSize: fontSizes[size],
          fontWeight: 700,
          gridColumn: "1 / -1",
          gridRow: 1,
          height: "100%",
          minWidth: 0,
          outline: "none",
          padding: 0,
          width: "100%"
        },
        "& input:disabled": {
          cursor: "not-allowed"
        }
      }
    }),
  iconOnly: style({
    $nest: {
      "&&": {
        background: "transparent",
        borderColor: "transparent",
        gridTemplateColumns: "1fr",
        height: 32,
        padding: 6,
        width: 32
      },
      "& > span": { gridColumn: 1, justifySelf: "center" }
    }
  }),
  displayValue: (value: string | undefined) =>
    style({
      color: value ? color.text : color.textSubtle,
      fontSize: 15,
      fontWeight: 700,
      gridColumn: 1,
      gridRow: 1,
      minWidth: 0,
      overflow: "hidden",
      pointerEvents: "none",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }),
  calendarIcon: style({
    border: `2px solid ${color.textMuted}`,
    borderRadius: radius.xs,
    boxSizing: "border-box",
    gridColumn: 2,
    gridRow: 1,
    height: 18,
    pointerEvents: "none",
    position: "relative",
    width: 18,
    $nest: {
      "&::before": {
        background: color.textMuted,
        content: '""',
        height: 2,
        left: 2,
        position: "absolute",
        right: 2,
        top: 4
      }
    }
  }),
  open: style({
    borderColor: color.primary,
    boxShadow: shadow.focus
  }),
  invalid: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    borderWidth: 2,
    $nest: {
      "&:focus-within": {
        borderColor: color.danger,
        boxShadow: "0 0 0 3px rgba(192, 59, 43, 0.22)"
      }
    }
  }),
  caption: style({
    color: color.textMuted,
    fontSize: 12,
    fontWeight: 700
  }),
  error: style({
    color: color.danger
  }),
  errorText: style({
    color: color.danger
  }),
  calendar: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: "0 18px 42px rgba(25, 25, 25, 0.18)",
    boxSizing: "border-box",
    display: "grid",
    gap: space[8],
    overflow: "auto",
    padding: space[10],
    position: "fixed",
    zIndex: zIndex.dropdown,
    $nest: scrollbar
  }),
  calendarWithPresets: style({
    alignItems: "start",
    gridTemplateColumns: "minmax(120px, 0.42fr) minmax(260px, 1fr)"
  }),
  calendarPanel: style({
    display: "grid",
    gap: space[8],
    minWidth: 0
  }),
  presets: style({
    borderRight: `1px solid ${color.border}`,
    display: "grid",
    gap: space[4],
    paddingRight: space[8],
    $nest: {
      "& button": {
        background: "transparent",
        border: 0,
        borderRadius: radius.sm,
        color: color.text,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 800,
        minHeight: 32,
        padding: `0 ${space[8]}px`,
        textAlign: "left"
      },
      "& button:hover": {
        background: color.surfaceMuted
      }
    }
  }),
  calendarHeader: style({
    alignItems: "center",
    display: "grid",
    gap: space[4],
    gridTemplateColumns: "28px minmax(0, 1fr) 28px",
    $nest: {
      "& strong": {
        color: color.text,
        fontSize: 14,
        fontWeight: 900,
        textAlign: "center"
      },
      "& button": {
        alignItems: "center",
        background: color.surfaceMuted,
        border: `1px solid ${color.border}`,
        borderRadius: radius.sm,
        color: color.primary,
        cursor: "pointer",
        display: "inline-flex",
        fontSize: 18,
        fontWeight: 900,
        height: 28,
        justifyContent: "center",
        padding: 0,
        width: 28
      },
      "& button:hover": {
        background: color.surfaceSecondary
      }
    }
  }),
  headerTitle: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[4],
    justifyContent: "center",
    minWidth: 0
  }),
  headerTitleButton: style({
    background: "transparent !important",
    borderColor: "transparent !important",
    color: `${color.text} !important`,
    fontSize: "14px !important",
    height: "28px !important",
    maxWidth: "100%",
    padding: `0 ${space[6]}px !important`,
    width: "auto !important"
  }),
  weekdays: style({
    color: color.textSubtle,
    display: "grid",
    fontSize: 11,
    fontWeight: 900,
    gap: space[4],
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    textAlign: "center",
    textTransform: "uppercase"
  }),
  days: style({
    display: "grid",
    gap: space[4],
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))"
  }),
  day: style({
    alignItems: "center",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: 13,
    fontWeight: 800,
    height: 32,
    justifyContent: "center",
    padding: 0,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.surfaceMuted,
        borderColor: color.border
      },
      "&:disabled": {
        color: color.danger,
        cursor: "not-allowed",
        opacity: 1
      }
    }
  }),
  dayMuted: style({
    color: color.textSubtle,
    opacity: 0.68
  }),
  dayToday: style({
    borderColor: color.accent
  }),
  daySelected: style({
    background: color.primary,
    borderColor: color.primary,
    color: color.surface,
    $nest: {
      "&:hover:not(:disabled)": {
        background: color.primary,
        borderColor: color.primary
      }
    }
  }),
  dayFocused: style({
    boxShadow: shadow.focus
  }),
  dayInRange: style({
    background: color.surfaceMuted,
    borderColor: color.border
  }),
  pickerGrid: style({
    display: "grid",
    gap: space[6],
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
  }),
  pickerButton: style({
    background: "transparent",
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    color: color.text,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
    minHeight: 36,
    padding: `0 ${space[8]}px`,
    $nest: {
      "&:hover": {
        background: color.surfaceMuted,
        borderColor: color.borderStrong
      }
    }
  }),
  pickerSelected: style({
    background: color.primary,
    borderColor: color.primary,
    color: color.surface,
    $nest: {
      "&:hover": {
        background: color.primary,
        borderColor: color.primary
      }
    }
  }),
  rangeGrid: style({
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
  })
};
