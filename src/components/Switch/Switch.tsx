import { type InputHTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, shadow, space } from "../../tokens";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  hint?: ReactNode;
};

export const Switch = ({ label, hint, className, disabled, ...rest }: SwitchProps) => {
  return (
    <label className={classes(switchStyles.root, disabled && switchStyles.disabled, className)}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className={switchStyles.track}>
        <span className={switchStyles.thumb} />
      </span>
      {(label || hint) && (
        <span className={switchStyles.text}>
          {label && <strong>{label}</strong>}
          {hint && <small>{hint}</small>}
        </span>
      )}
    </label>
  );
}

const switchStyles = {
  root: style({
    alignItems: "center",
    color: color.text,
    cursor: "pointer",
    display: "inline-flex",
    gap: space[10],
    minHeight: 28,
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
        background: color.primary
      },
      "& input:checked + span span": {
        transform: "translateX(18px)"
      }
    }
  }),
  disabled: style({
    cursor: "not-allowed",
    opacity: 0.56
  }),
  track: style({
    alignItems: "center",
    background: color.borderStrong,
    borderRadius: 999,
    display: "inline-flex",
    flexShrink: 0,
    height: 24,
    padding: 2,
    transition: "background 0.16s ease, box-shadow 0.16s ease",
    width: 44
  }),
  thumb: style({
    background: color.surface,
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(25, 25, 25, 0.24)",
    height: 20,
    transition: "transform 0.16s ease",
    width: 20
  }),
  text: style({
    display: "grid",
    gap: 2,
    minWidth: 0,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 14,
        lineHeight: 1.2
      },
      "& small": {
        color: color.textSubtle,
        fontSize: 12,
        fontWeight: 700
      }
    }
  })
};
