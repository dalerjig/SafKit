import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode
} from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space, typography } from "../../tokens";

export type InputSize = "xs" | "sm" | "md" | "lg";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "height"> & {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  size?: InputSize;
  /** Высота control; число — px. Имеет приоритет над size. */
  height?: CSSProperties["height"];
  /** font-weight текста в поле; по умолчанию body (400). Для старого вида: 700. */
  weight?: CSSProperties["fontWeight"];
  prefix?: ReactNode;
  suffix?: ReactNode;
};

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

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, hint, size = "md", height, weight = typography.bodyWeight, prefix, suffix, className, disabled, ...rest },
  ref
) => {
  const hasError = Boolean(error);

  return (
    <label className={classes(inputStyles.root, disabled && inputStyles.disabled, className)}>
      {label && <span className={classes(inputStyles.label, hasError && inputStyles.errorText)}>{label}</span>}
      <span className={classes(inputStyles.control(size, weight, height), hasError && inputStyles.invalid)}>
        {prefix && <span className={inputStyles.affix}>{prefix}</span>}
        <input ref={ref} disabled={disabled} {...rest} />
        {suffix && <span className={inputStyles.affix}>{suffix}</span>}
      </span>
      {(error || hint) && <span className={classes(inputStyles.caption, hasError && inputStyles.error)}>{error || hint}</span>}
    </label>
  );
});

export type NumberInputProps = Omit<InputProps, "type" | "value" | "onChange"> & {
  /** Controlled: число из store; \"\" не обязателен. */
  value?: number | "";
  /** Только валидное number (промежуточный \"\" / \"-\" / \"0.\" во время ввода в store не уходит). */
  onChange?: (value: number | "") => void;
};

/** Незавершённый ввод — не парсим и не дергаем onChange. */
const isIntermediateNumericText = (text: string) => {
  const trimmed = text.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+" || trimmed === "." || trimmed === "-." || trimmed === "+.") {
    return true;
  }
  return /^[-+]?\d*\.$/.test(trimmed);
};

/** Оставляет только числовой ввод; запятую приводит к точке. */
const sanitizeNumericInputText = (text: string) => {
  let value = text.replace(/,/g, ".").replace(/[^\d.+-]/g, "");

  const sign = value.startsWith("-") ? "-" : value.startsWith("+") ? "+" : "";
  value = value.replace(/^[+-]/, "").replace(/[+-]/g, "");

  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1) {
    value = `${value.slice(0, dotIndex + 1)}${value.slice(dotIndex + 1).replace(/\./g, "")}`;
  }

  return sign + value;
};

const parseNumericText = (text: string): number | undefined => {
  const trimmed = text.trim();
  if (isIntermediateNumericText(trimmed)) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((
  { value, onChange, onBlur, onFocus, ...rest },
  ref
) => {
  const [draft, setDraft] = useState<string | null>(null);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) {
      setDraft(null);
    }
  }, [value]);

  const committedText =
    value === "" || value === undefined ? "" : String(value);

  const displayValue = draft !== null ? draft : committedText;

  return (
    <Input
      ref={ref}
      inputMode="decimal"
      type="text"
      value={displayValue}
      onFocus={event => {
        focusedRef.current = true;
        onFocus?.(event);
      }}
      onChange={event => {
        const text = sanitizeNumericInputText(event.currentTarget.value);
        setDraft(text);
        const parsed = parseNumericText(text);
        if (parsed !== undefined) {
          onChange?.(parsed);
        }
      }}
      onBlur={event => {
        focusedRef.current = false;
        const text = sanitizeNumericInputText(draft ?? committedText);
        setDraft(null);
        onBlur?.(event);
        const parsed = parseNumericText(text);
        if (parsed !== undefined) {
          onChange?.(parsed);
        }
      }}
      {...rest}
    />
  );
});

const inputStyles = {
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
  control: (size: InputSize, weight: CSSProperties["fontWeight"], height: CSSProperties["height"]) =>
    style({
      alignItems: "center",
      background: color.surface,
      border: `1px solid ${color.borderStrong}`,
      borderRadius: radius.sm,
      boxSizing: "border-box",
      display: "inline-flex",
      gap: space[8],
      height: height ?? heights[size],
      minWidth: 0,
      padding: `0 ${size === "xs" ? space[8] : space[10]}px`,
      transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
      width: "100%",
      $nest: {
        "&:focus-within": {
          borderColor: color.primary,
          boxShadow: shadow.focus
        },
        "& input": {
          boxSizing: "border-box",
          background: "transparent",
          border: 0,
          color: color.text,
          fontSize: fontSizes[size],
          fontWeight: weight,
          height: "100%",
          minHeight: 0,
          minWidth: 0,
          outline: "none",
          padding: 0,
          width: "100%"
        },
        "& input::placeholder": {
          color: color.textSubtle
        },
        "& input:disabled": {
          cursor: "not-allowed"
        }
      }
    }),
  invalid: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    borderWidth: 2,
    $nest: {
      "&:focus-within": {
        borderColor: color.danger,
        boxShadow: "0 0 0 3px rgba(192, 59, 43, 0.22)"
      },
      "& input": {
        color: color.danger
      }
    }
  }),
  affix: style({
    color: color.textMuted,
    flexShrink: 0,
    fontSize: 13,
    fontWeight: 800
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
  })
};
