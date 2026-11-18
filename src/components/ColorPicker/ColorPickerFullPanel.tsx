import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { style } from "typestyle";
import { color, radius, shadow, space, typography } from "../../tokens";
import { Select } from "../Select";
import {
  type ColorOutputFormat,
  formatAlphaPercent,
  formatHexInput,
  hsvToRgb,
  hueToRgb,
  parseColor,
  rgbToHsv,
  rgbaToOutputCss,
  type Rgba
} from "./colorUtils";

export type ColorPickerFullPanelProps = {
  value: string;
  onChange: (color: string) => void;
  format: ColorOutputFormat;
  formats?: ColorOutputFormat[];
  onFormatChange?: (format: ColorOutputFormat) => void;
};

export const ColorPickerFullPanel = ({
  value,
  onChange,
  format,
  formats = [format],
  onFormatChange
}: ColorPickerFullPanelProps) => {
  const parsed = parseColor(value) ?? { r: 16, g: 62, b: 54, a: 1 };
  const [hsv, setHsv] = useState(() => rgbToHsv(parsed.r, parsed.g, parsed.b));
  const [alpha, setAlpha] = useState(parsed.a);
  const [hexDraft, setHexDraft] = useState(formatHexInput(parsed));
  const [rgbDraft, setRgbDraft] = useState({ r: parsed.r, g: parsed.g, b: parsed.b });
  const [hsbDraft, setHsbDraft] = useState(() => ({ h: Math.round(hsv.h), s: Math.round(hsv.s * 100), v: Math.round(hsv.v * 100) }));
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    const next = parseColor(value);
    if (!next) return;
    setHsv(rgbToHsv(next.r, next.g, next.b));
    setAlpha(next.a);
    setHexDraft(formatHexInput(next));
    setRgbDraft({ r: next.r, g: next.g, b: next.b });
    const nextHsv = rgbToHsv(next.r, next.g, next.b);
    setHsbDraft({ h: Math.round(nextHsv.h), s: Math.round(nextHsv.s * 100), v: Math.round(nextHsv.v * 100) });
    lastEmitted.current = value;
  }, [value]);

  const emit = (nextRgba: Rgba) => {
    const css = rgbaToOutputCss(nextRgba, format);
    lastEmitted.current = css;
    setHexDraft(formatHexInput(nextRgba));
    setRgbDraft({ r: nextRgba.r, g: nextRgba.g, b: nextRgba.b });
    const nextHsv = rgbToHsv(nextRgba.r, nextRgba.g, nextRgba.b);
    setHsbDraft({ h: Math.round(nextHsv.h), s: Math.round(nextHsv.s * 100), v: Math.round(nextHsv.v * 100) });
    onChange(css);
  };

  const updateFromHsv = (nextHsv: typeof hsv, nextAlpha = alpha) => {
    setHsv(nextHsv);
    setAlpha(nextAlpha);
    const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
    emit({ ...rgb, a: nextAlpha });
  };

  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentRgba: Rgba = { ...currentRgb, a: alpha };
  const currentCss = rgbaToOutputCss(currentRgba, format);
  const hueColor = rgbToHexString(hueToRgb(hsv.h));
  const showFormatSelect = formats.length > 1;

  const bindDrag = (
    move: (clientX: number, clientY: number, rect: DOMRect) => void,
    event: ReactPointerEvent<HTMLElement>
  ) => {
    event.preventDefault();
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const handleMove = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== event.pointerId) return;
      move(pointerEvent.clientX, pointerEvent.clientY, target.getBoundingClientRect());
    };

    const handleUp = (pointerEvent: PointerEvent) => {
      if (pointerEvent.pointerId !== event.pointerId) return;
      target.releasePointerCapture(event.pointerId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };

    move(event.clientX, event.clientY, target.getBoundingClientRect());
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  };

  return (
    <div className={fullPanelStyles.root}>
      <div
        className={fullPanelStyles.saturation}
        style={{ backgroundColor: hueColor }}
        onPointerDown={event =>
          bindDrag((clientX, clientY, rect) => {
            const s = clamp01((clientX - rect.left) / rect.width);
            const v = clamp01(1 - (clientY - rect.top) / rect.height);
            updateFromHsv({ ...hsv, s, v });
          }, event)
        }
      >
        <span className={fullPanelStyles.saturationWhite} />
        <span className={fullPanelStyles.saturationBlack} />
        <span
          className={fullPanelStyles.saturationHandle}
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            background: currentCss
          }}
        />
      </div>

      <div className={fullPanelStyles.slidersRow}>
        <div className={fullPanelStyles.sliders}>
          <div
            className={fullPanelStyles.hueTrack}
            onPointerDown={event =>
              bindDrag((clientX, _clientY, rect) => {
                const hue = clamp01((clientX - rect.left) / rect.width) * 360;
                updateFromHsv({ ...hsv, h: hue });
              }, event)
            }
          >
            <span className={fullPanelStyles.hueHandle} style={{ left: `${(hsv.h / 360) * 100}%` }} />
          </div>
          <div
            className={fullPanelStyles.alphaTrack}
            onPointerDown={event =>
              bindDrag((clientX, _clientY, rect) => {
                const nextAlpha = clamp01((clientX - rect.left) / rect.width);
                updateFromHsv(hsv, nextAlpha);
              }, event)
            }
          >
            <span className={fullPanelStyles.alphaChecker} />
            <span className={fullPanelStyles.alphaGradient} style={{ background: `linear-gradient(to right, transparent, ${rgbToHexString(currentRgb)})` }} />
            <span className={fullPanelStyles.alphaHandle} style={{ left: `${alpha * 100}%`, background: currentCss }} />
          </div>
        </div>
        <span className={fullPanelStyles.preview} style={{ background: currentCss }} />
      </div>

      {showFormatSelect && (
        <div className={fullPanelStyles.formatRow}>
          <Select
            size="sm"
            value={format}
            options={formats.map(formatItem => ({ value: formatItem, label: formatItem.toUpperCase() }))}
            onValueChange={value => onFormatChange?.(value as ColorOutputFormat)}
            matchTriggerWidth
          />
        </div>
      )}

      <div className={fullPanelStyles.inputs(format)}>
        {format === "hex" ? (
          <>
            <span className={fullPanelStyles.formatLabel}>HEX</span>
            <label className={fullPanelStyles.hexField}>
              <span className={fullPanelStyles.hexPrefix}>#</span>
              <input
                className={fullPanelStyles.hexInput}
                value={hexDraft}
                maxLength={6}
                spellCheck={false}
                onChange={event => {
                  const next = event.currentTarget.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                  setHexDraft(next.toUpperCase());
                  if (next.length !== 6) return;
                  const parsedHex = parseColor(`#${next}`);
                  if (!parsedHex) return;
                  updateFromHsv(rgbToHsv(parsedHex.r, parsedHex.g, parsedHex.b), alpha);
                }}
                onBlur={() => setHexDraft(formatHexInput(currentRgba))}
              />
            </label>
          </>
        ) : format === "rgb" ? (
          <>
            {(["r", "g", "b"] as const).map(channel => (
              <label key={channel} className={fullPanelStyles.valueField}>
                <span className={fullPanelStyles.channelPrefix}>{channel}</span>
                <input
                  className={`${fullPanelStyles.valueInput} ${fullPanelStyles.valueInputWithPrefix}`}
                  inputMode="numeric"
                  aria-label={channel.toUpperCase()}
                  placeholder={channel.toUpperCase()}
                  value={rgbDraft[channel]}
                  onChange={event => {
                    const digits = event.currentTarget.value.replace(/[^\d]/g, "").slice(0, 3);
                    const nextChannel = digits === "" ? 0 : clamp255(Number(digits));
                    const nextRgb = { ...rgbDraft, [channel]: nextChannel };
                    setRgbDraft(nextRgb);
                    updateFromHsv(rgbToHsv(nextRgb.r, nextRgb.g, nextRgb.b), alpha);
                  }}
                />
              </label>
            ))}
          </>
        ) : (
          <>
            {(["h", "s", "v"] as const).map(channel => (
              <label key={channel} className={fullPanelStyles.valueField}>
                <input
                  className={fullPanelStyles.valueInput}
                  inputMode="numeric"
                  aria-label={channel.toUpperCase()}
                  placeholder={channel.toUpperCase()}
                  value={hsbDraft[channel]}
                  onChange={event => {
                    const digits = event.currentTarget.value.replace(/[^\d]/g, "").slice(0, 3);
                    const nextValue = digits === "" ? 0 : channel === "h" ? clamp360(Number(digits)) : clamp100(Number(digits));
                    const nextHsb = { ...hsbDraft, [channel]: nextValue };
                    setHsbDraft(nextHsb);
                    updateFromHsv({ h: nextHsb.h, s: nextHsb.s / 100, v: nextHsb.v / 100 }, alpha);
                  }}
                />
              </label>
            ))}
          </>
        )}
        <input
          className={fullPanelStyles.alphaInput}
          value={formatAlphaPercent(alpha)}
          onChange={event => {
            const digits = event.currentTarget.value.replace(/[^\d]/g, "");
            if (!digits) return;
            const nextAlpha = clamp01(Number(digits) / 100);
            updateFromHsv(hsv, nextAlpha);
          }}
        />
      </div>
    </div>
  );
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const clamp100 = (value: number) => Math.min(100, Math.max(0, Math.round(value)));
const clamp360 = (value: number) => Math.min(360, Math.max(0, Math.round(value)));

const rgbToHexString = (rgb: { r: number; g: number; b: number }) =>
  `#${[rgb.r, rgb.g, rgb.b].map(channel => clamp255(channel).toString(16).padStart(2, "0")).join("")}`;

const clamp255 = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const checkerboardStyles = {
  backgroundColor: color.surface,
  backgroundImage:
    "linear-gradient(45deg, #dfe3e8 25%, transparent 25%), linear-gradient(-45deg, #dfe3e8 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dfe3e8 75%), linear-gradient(-45deg, transparent 75%, #dfe3e8 75%)",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
  backgroundSize: "12px 12px"
};

const fullPanelStyles = {
  root: style({
    display: "grid",
    gap: space[12],
    minWidth: 0
  }),
  saturation: style({
    borderRadius: radius.md,
    cursor: "crosshair",
    height: 160,
    overflow: "hidden",
    position: "relative",
    touchAction: "none",
    userSelect: "none"
  }),
  saturationWhite: style({
    background: "linear-gradient(to right, #fff, rgba(255,255,255,0))",
    inset: 0,
    pointerEvents: "none",
    position: "absolute"
  }),
  saturationBlack: style({
    background: "linear-gradient(to top, #000, rgba(0,0,0,0))",
    inset: 0,
    pointerEvents: "none",
    position: "absolute"
  }),
  saturationHandle: style({
    border: "2px solid #fff",
    borderRadius: radius.round,
    boxShadow: "0 0 0 1px rgba(0,0,0,0.28)",
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    pointerEvents: "none",
    position: "absolute",
    width: 16
  }),
  slidersRow: style({
    alignItems: "center",
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "minmax(0, 1fr) 32px"
  }),
  sliders: style({
    display: "grid",
    gap: space[10]
  }),
  hueTrack: style({
    background:
      "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
    borderRadius: radius.round,
    cursor: "pointer",
    height: 12,
    position: "relative",
    touchAction: "none",
    userSelect: "none"
  }),
  hueHandle: style({
    background: color.surface,
    border: "2px solid #fff",
    borderRadius: radius.round,
    boxShadow: "0 0 0 1px rgba(0,0,0,0.28)",
    height: 16,
    marginLeft: -8,
    marginTop: -2,
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    width: 16
  }),
  alphaTrack: style({
    borderRadius: radius.round,
    cursor: "pointer",
    height: 12,
    position: "relative",
    touchAction: "none",
    userSelect: "none"
  }),
  alphaChecker: style({
    ...checkerboardStyles,
    borderRadius: radius.round,
    inset: 0,
    pointerEvents: "none",
    position: "absolute"
  }),
  alphaGradient: style({
    borderRadius: radius.round,
    inset: 0,
    pointerEvents: "none",
    position: "absolute"
  }),
  alphaHandle: style({
    border: "2px solid #fff",
    borderRadius: radius.round,
    boxShadow: "0 0 0 1px rgba(0,0,0,0.28)",
    height: 16,
    marginLeft: -8,
    marginTop: -2,
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    width: 16,
    zIndex: 1
  }),
  preview: style({
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    height: 32,
    width: 32
  }),
  formatRow: style({
    width: 112
  }),
  inputs: (format: ColorOutputFormat) =>
    style({
      alignItems: "center",
      display: "grid",
      gap: space[6],
      gridTemplateColumns: format === "hex" ? "auto minmax(0, 1fr) 52px" : "repeat(3, minmax(0, 1fr)) 52px"
    }),
  valueField: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    height: 32,
    minWidth: 0,
    padding: `0 ${space[8]}px`,
    $nest: {
      "&:focus-within": {
        borderColor: color.primary,
        boxShadow: shadow.focus
      }
    }
  }),
  valueInput: style({
    background: "transparent",
    border: 0,
    boxSizing: "border-box",
    color: color.text,
    fontFamily: typography.monoFamily,
    fontSize: 13,
    fontWeight: 800,
    minWidth: 0,
    outline: "none",
    padding: `${space[6]}px 0`,
    textAlign: "center",
    width: "100%",
    $nest: {
      "&::placeholder": {
        color: color.textSubtle,
        fontWeight: 700
      }
    }
  }),
  valueInputWithPrefix: style({
    textAlign: "right"
  }),
  channelPrefix: style({
    color: color.textMuted,
    fontFamily: typography.monoFamily,
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1,
    marginRight: space[4],
    textTransform: "lowercase",
    userSelect: "none"
  }),
  formatLabel: style({
    color: color.textMuted,
    fontSize: 12,
    fontWeight: 800
  }),
  hexField: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    minWidth: 0,
    padding: `0 ${space[8]}px`
  }),
  hexPrefix: style({
    color: color.textMuted,
    fontFamily: typography.monoFamily,
    fontSize: 13,
    fontWeight: 800
  }),
  hexInput: style({
    background: "transparent",
    border: 0,
    color: color.text,
    fontFamily: typography.monoFamily,
    fontSize: 13,
    fontWeight: 800,
    minWidth: 0,
    outline: "none",
    padding: `${space[6]}px 0`,
    width: "100%"
  }),
  alphaInput: style({
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    color: color.text,
    fontFamily: typography.monoFamily,
    fontSize: 13,
    fontWeight: 800,
    outline: "none",
    padding: `${space[6]}px ${space[8]}px`,
    textAlign: "center",
    width: "100%"
  })
};
