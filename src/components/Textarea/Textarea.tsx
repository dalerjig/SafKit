import { type ReactNode, type TextareaHTMLAttributes } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space } from "../../tokens";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
};

export const Textarea = ({ label, error, hint, className, disabled, ...rest }: TextareaProps) => {
  const hasError = Boolean(error);

  return (
    <label className={classes(textareaStyles.root, disabled && textareaStyles.disabled, className)}>
      {label && <span className={classes(textareaStyles.label, hasError && textareaStyles.errorText)}>{label}</span>}
      <textarea className={classes(textareaStyles.control, hasError && textareaStyles.invalid)} disabled={disabled} {...rest} />
      {(error || hint) && (
        <span className={classes(textareaStyles.caption, hasError && textareaStyles.error)}>{error || hint}</span>
      )}
    </label>
  );
}

const textareaStyles = {
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
  control: style({
    background: color.surface,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: radius.sm,
    boxSizing: "border-box",
    color: color.text,
    fontSize: 15,
    fontWeight: 700,
    minHeight: 96,
    minWidth: 0,
    outline: "none",
    padding: `${space[10]}px ${space[12]}px`,
    resize: "vertical",
    transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
    width: "100%",
    $nest: {
      "&:focus": {
        borderColor: color.primary,
        boxShadow: shadow.focus
      },
      "&::placeholder": {
        color: color.textSubtle
      },
      "&:disabled": {
        cursor: "not-allowed"
      }
    }
  }),
  invalid: style({
    background: "#FFF7F5",
    borderColor: color.danger,
    borderWidth: 2,
    $nest: {
      "&:focus": {
        borderColor: color.danger,
        boxShadow: "0 0 0 3px rgba(192, 59, 43, 0.22)"
      }
    },
    color: color.danger
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
