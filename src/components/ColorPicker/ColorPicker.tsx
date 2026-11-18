import { type ReactNode, useEffect, useMemo, useState } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space, typography } from "../../tokens";
import { Button } from "../Button";
import { Flow } from "../LayoutPrimitives";
import { Popover } from "../Popover";
import { ColorPickerFullPanel } from "./ColorPickerFullPanel";
import {
  type ColorOutputFormat,
  colorsEqual,
  isValidColorString,
  parseColor,
  rgbaToCss,
  rgbaToOutputCss
} from "./colorUtils";

export type ColorPickerLabelPlacement = "top" | "right" | "bottom" | "left";
export type ColorPickerFormat = ColorOutputFormat;

export type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  palette: string[];
  onChange?: (color: string) => void;
  onBlur?: () => void;
  allowCustom?: boolean;
  fullMode?: boolean;
  /** @deprecated Используйте format="rgb" */
  rgb?: boolean;
  /** Формат value/onChange. Если передать массив, в fullMode появится выбор формата. */
  format?: ColorPickerFormat | ColorPickerFormat[];
  label?: ReactNode;
  labelPlacement?: ColorPickerLabelPlacement;
  /** Текущий цвет строкой над кружком (как rgb(...) на макете). */
  showValueLabel?: boolean;
  /** Компактный badge-триггер с children внутри, например счётчик группы. */
  counterMode?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

export const ColorPicker = ({
  value,
  defaultValue = "#103E36",
  palette,
  onChange,
  onBlur,
  allowCustom,
  fullMode,
  rgb = false,
  format,
  label,
  labelPlacement = "top",
  showValueLabel = false,
  counterMode = false,
  disabled,
  className,
  children
}: ColorPickerProps) => {
  const availableFormats = useMemo(() => normalizeFormats(format, rgb), [format, rgb]);
  const [activeFormat, setActiveFormat] = useState<ColorPickerFormat>(availableFormats[0]);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [customValue, setCustomValue] = useState(value ?? defaultValue);
  const currentValue = value ?? innerValue;
  const isCustomValid = isValidColorString(customValue);

  useEffect(() => {
    if (!availableFormats.includes(activeFormat)) {
      setActiveFormat(availableFormats[0]);
    }
  }, [activeFormat, availableFormats]);

  const displayValue = useMemo(() => {
    const parsed = parseColor(currentValue);
    if (!parsed) return currentValue;
    return rgbaToOutputCss(parsed, activeFormat);
  }, [activeFormat, currentValue]);

  const visualColor = useMemo(() => {
    const parsed = parseColor(currentValue);
    return parsed ? rgbaToCss(parsed) : currentValue;
  }, [currentValue]);

  const placeholder = activeFormat === "rgb" ? "rgb(16, 62, 54)" : activeFormat === "hsb" ? "hsb(160, 74%, 36%)" : "#103E36";

  const chooseColor = (nextColor: string, outputFormat: ColorPickerFormat = activeFormat) => {
    const parsed = parseColor(nextColor);
    const normalized = parsed ? rgbaToOutputCss(parsed, outputFormat) : nextColor;
    setInnerValue(normalized);
    setCustomValue(normalized);
    onChange?.(normalized);
  };

  const handleFormatChange = (nextFormat: ColorPickerFormat) => {
    setActiveFormat(nextFormat);
    const parsed = parseColor(currentValue);
    if (!parsed) return;
    chooseColor(rgbaToOutputCss(parsed, nextFormat), nextFormat);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onBlur?.();
    }
  };

  const triggerButton = counterMode ? (
    <button
      type="button"
      className={colorPickerStyles.counterTrigger}
      style={{ background: visualColor }}
      disabled={disabled}
      aria-label={typeof label === "string" ? label : displayValue}
      title={displayValue}
    >
      {children !== undefined && children !== null && children !== false ? (
        <span className={colorPickerStyles.counterValue}>{children}</span>
      ) : null}
    </button>
  ) : (
    <button
      type="button"
      className={colorPickerStyles.trigger}
      disabled={disabled}
      aria-label={typeof label === "string" ? label : displayValue}
      title={displayValue}
    >
      <span style={{ background: visualColor }} />
    </button>
  );

  const trigger = (
    <Popover trigger={triggerButton} onOpenChange={handleOpenChange}>
      <div className={classes(colorPickerStyles.panel, fullMode && colorPickerStyles.panelFull)}>
        {fullMode ? (
          <ColorPickerFullPanel
            value={currentValue}
            onChange={chooseColor}
            format={activeFormat}
            formats={availableFormats}
            onFormatChange={handleFormatChange}
          />
        ) : (
          <div className={colorPickerStyles.preview}>
            <span style={{ background: visualColor }} />
            <code>{displayValue}</code>
          </div>
        )}
        {palette.length > 0 && (
          <div className={colorPickerStyles.palette}>
            {palette.map(item => (
              <button
                key={item}
                type="button"
                className={classes(colorPickerStyles.swatch, colorsEqual(item, currentValue) && colorPickerStyles.swatchActive)}
                style={{ background: item }}
                aria-label={item}
                onClick={() => chooseColor(item)}
              />
            ))}
          </div>
        )}
        {!fullMode && allowCustom && (
          <Flow mode="horizontal" gap={8}>
            <input
              className={colorPickerStyles.input}
              value={customValue}
              placeholder={placeholder}
              onChange={event => setCustomValue(event.currentTarget.value)}
            />
            <Button size="sm" variant="primary" disabled={!isCustomValid} onClick={() => chooseColor(customValue)}>
              OK
            </Button>
          </Flow>
        )}
      </div>
    </Popover>
  );

  const labelNode = label ? <span className={colorPickerStyles.label}>{label}</span> : null;
  const valueLabelNode = !counterMode && showValueLabel ? (
    <span className={colorPickerStyles.valueLabel}>{displayValue}</span>
  ) : null;

  const isHorizontal = !counterMode && (labelPlacement === "left" || labelPlacement === "right");

  return (
    <div
      className={classes(
        colorPickerStyles.root(isHorizontal, counterMode),
        labelPlacement === "left" && colorPickerStyles.rootRow,
        labelPlacement === "right" && colorPickerStyles.rootRow,
        counterMode && colorPickerStyles.rootCounter,
        className
      )}
    >
      {labelPlacement === "top" && labelNode}
      {labelPlacement === "left" && labelNode}

      <div className={colorPickerStyles.controlStack(showValueLabel && !counterMode)}>
        {showValueLabel && valueLabelNode}
        {trigger}
      </div>

      {labelPlacement === "right" && labelNode}
      {labelPlacement === "bottom" && labelNode}
    </div>
  );
};

const pickerFormats: readonly ColorPickerFormat[] = ["hex", "rgb", "hsb"];

const normalizeFormats = (format: ColorPickerProps["format"], rgb: boolean): ColorPickerFormat[] => {
  const source = format === undefined ? (rgb ? ["rgb"] : ["hex"]) : Array.isArray(format) ? format : [format];
  const filtered = source.filter((item): item is ColorPickerFormat => pickerFormats.includes(item as ColorPickerFormat));
  if (filtered.length === 0) return ["hex"];
  return Array.from(new Set(filtered));
};

const colorPickerStyles = {
  root: (horizontal: boolean, counterMode: boolean) =>
    style({
      alignItems: horizontal ? "center" : "start",
      color: color.text,
      display: counterMode ? "inline-flex" : horizontal ? "inline-flex" : "grid",
      gap: space[6],
      minWidth: 0
    }),
  rootCounter: style({
    flexShrink: 0
  }),
  rootRow: style({
    flexDirection: "row"
  }),
  controlStack: (withValueLabel: boolean) =>
    style({
      display: "grid",
      gap: withValueLabel ? space[4] : 0,
      justifyItems: "start",
      minWidth: 0
    }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.2
  }),
  valueLabel: style({
    color: color.text,
    fontFamily: typography.monoFamily,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.2,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  trigger: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    boxSizing: "border-box",
    color: color.text,
    cursor: "pointer",
    display: "grid",
    flexShrink: 0,
    gap: space[8],
    height: 40,
    justifyContent: "center",
    minWidth: 40,
    padding: `0 ${space[10]}px`,
    textAlign: "left",
    width: 40,
    $nest: {
      "&:hover:not(:disabled)": {
        borderColor: color.primary,
        boxShadow: shadow.raised
      },
      "&:focus-visible": {
        borderColor: color.primary,
        boxShadow: shadow.focus,
        outline: "none"
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.56
      },
      "& span": {
        border: `1px solid ${color.borderStrong}`,
        borderRadius: radius.round,
        height: 24,
        width: 24
      }
    }
  }),
  counterTrigger: style({
    alignItems: "center",
    border: `1px solid ${color.borderStrong}`,
    borderRadius: 10,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: 36,
    justifyContent: "center",
    minWidth: 36,
    overflow: "hidden",
    padding: 0,
    position: "relative",
    width: 36,
    $nest: {
      "&:hover:not(:disabled)": {
        boxShadow: shadow.raised
      },
      "&:focus-visible": {
        boxShadow: shadow.focus,
        outline: "none"
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.56
      }
    }
  }),
  counterValue: style({
    color: color.surface,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "20px",
    pointerEvents: "none",
    userSelect: "none"
  }),
  panel: style({
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
    display: "grid",
    gap: space[12],
    padding: space[12],
    width: 252
  }),
  panelFull: style({
    width: 280
  }),
  preview: style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "32px minmax(0, 1fr)",
    $nest: {
      "& span": {
        border: `1px solid ${color.borderStrong}`,
        borderRadius: radius.sm,
        height: 32,
        width: 32
      },
      "& code": {
        color: color.primary,
        fontSize: 13,
        fontWeight: 900,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  }),
  palette: style({
    display: "grid",
    gap: space[6],
    gridTemplateColumns: "repeat(6, 1fr)"
  }),
  swatch: style({
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.round,
    cursor: "pointer",
    height: 28,
    padding: 0,
    transition: "box-shadow 0.16s ease, transform 0.16s ease",
    width: 28,
    $nest: {
      "&:hover": {
        boxShadow: shadow.raised,
        transform: "translateY(-1px)"
      },
      "&:focus-visible": {
        boxShadow: shadow.focus,
        outline: "none"
      }
    }
  }),
  swatchActive: style({
    boxShadow: `0 0 0 3px ${color.accent}`
  }),
  input: style({
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    color: color.text,
    fontFamily: typography.monoFamily,
    fontSize: 13,
    fontWeight: 800,
    height: 32,
    minWidth: 0,
    outline: "none",
    padding: `0 ${space[8]}px`,
    width: "100%",
    $nest: {
      "&:focus": {
        borderColor: color.primary,
        boxShadow: shadow.focus
      }
    }
  })
};
