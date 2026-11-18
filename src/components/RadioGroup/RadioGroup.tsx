import { type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space } from "../../tokens";

export type RadioOption<T extends string | number> = {
  label: ReactNode;
  value: T;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps<T extends string | number> = {
  options: Array<RadioOption<T>>;
  value: T;
  name?: string;
  direction?: "horizontal" | "vertical";
  onChange?: (value: T, option: RadioOption<T>) => void;
  className?: string;
};

export const RadioGroup = <T extends string | number,>({
  options,
  value,
  name,
  direction = "vertical",
  onChange,
  className
}: RadioGroupProps<T>) => {
  return (
    <div className={classes(radioStyles.root(direction), className)} role="radiogroup">
      {options.map(option => (
        <label key={String(option.value)} className={classes(radioStyles.option, option.disabled && radioStyles.disabled)}>
          <input
            type="radio"
            name={name}
            value={String(option.value)}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => onChange?.(option.value, option)}
          />
          <span className={radioStyles.dot} />
          <span className={radioStyles.text}>
            <strong>{option.label}</strong>
            {option.description && <small>{option.description}</small>}
          </span>
        </label>
      ))}
    </div>
  );
}

const radioStyles = {
  root: (direction: "horizontal" | "vertical") =>
    style({
      display: direction === "horizontal" ? "flex" : "grid",
      flexWrap: "wrap",
      gap: space[10]
    }),
  option: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.border}`,
    borderRadius: radius.sm,
    cursor: "pointer",
    display: "grid",
    gap: space[10],
    gridTemplateColumns: "18px minmax(0, 1fr)",
    minHeight: 40,
    padding: `0 ${space[10]}px`,
    position: "relative",
    $nest: {
      "& input": {
        opacity: 0,
        position: "absolute"
      },
      "& input:focus-visible + span": {
        boxShadow: shadow.focus
      },
      "& input:checked + span": {
        borderColor: color.primary
      },
      "& input:checked + span::after": {
        opacity: 1
      },
      "&:hover": {
        background: color.surfaceMuted
      }
    }
  }),
  disabled: style({
    cursor: "not-allowed",
    opacity: 0.56
  }),
  dot: style({
    border: `2px solid ${color.borderStrong}`,
    borderRadius: "50%",
    boxSizing: "border-box",
    height: 18,
    position: "relative",
    width: 18,
    $nest: {
      "&::after": {
        background: color.primary,
        borderRadius: "50%",
        content: '""',
        height: 8,
        left: 3,
        opacity: 0,
        position: "absolute",
        top: 3,
        width: 8
      }
    }
  }),
  text: style({
    display: "grid",
    gap: 2,
    minWidth: 0,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 14
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 700
      }
    }
  })
};
