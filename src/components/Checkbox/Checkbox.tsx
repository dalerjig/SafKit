import { type InputHTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space } from "../../tokens";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

export const Checkbox = ({ label, className, disabled, ...rest }: CheckboxProps) => {
  return (
    <label className={classes(checkboxStyles.root, disabled && checkboxStyles.disabled, className)}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className={checkboxStyles.box} />
      {label && <span className={checkboxStyles.label}>{label}</span>}
    </label>
  );
}

const checkboxStyles = {
  root: style({
    alignItems: "center",
    color: color.primary,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: 14,
    fontWeight: 700,
    gap: space[8],
    minHeight: 24,
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
        background: color.primary,
        borderColor: color.primary
      },
      "& input:checked + span::after": {
        opacity: 1
      }
    }
  }),
  disabled: style({
    cursor: "not-allowed",
    opacity: 0.56
  }),
  box: style({
    alignItems: "center",
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.xs,
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    height: 18,
    justifyContent: "center",
    transition: "background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease",
    width: 18,
    $nest: {
      "&::after": {
        borderBottom: `2px solid ${color.surface}`,
        borderRight: `2px solid ${color.surface}`,
        content: '""',
        height: 9,
        opacity: 0,
        transform: "rotate(45deg) translate(-1px, -1px)",
        width: 5
      }
    }
  }),
  label: style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  })
};
