import { useActionState, type CSSProperties, type FormHTMLAttributes, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";
import { Button, type ButtonProps } from "../Button";
import { Flow } from "../LayoutPrimitives";

type FormGap = keyof typeof space | CSSProperties["gap"];

export type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export const Field = ({ label, hint, error, required, htmlFor, children, className }: FieldProps) => {
  const hasError = Boolean(error);

  return (
    <div className={classes(formStyles.field, className)}>
      {label && (
        <label className={formStyles.label(hasError)} htmlFor={htmlFor}>
          <span>{label}</span>
          {required && <span className={formStyles.requiredMark} aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <div className={formStyles.caption(hasError)} role={hasError ? "alert" : undefined}>
          {error || hint}
        </div>
      )}
    </div>
  );
}

export type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  footer?: ReactNode;
  footerSticky?: boolean;
  gap?: FormGap;
};

export const Form = ({ children, footer, footerSticky, gap = 12, className, style: inlineStyle, ...rest }: FormProps) => {
  return (
    <form
      className={classes(formStyles.form, className)}
      style={{
        gap: resolveFormGap(gap),
        ...inlineStyle
      }}
      {...rest}
    >
      {children}
      {footer && (
        <Flow
          mode="horizontal"
          wrap
          justify="space-between"
          className={classes(formStyles.footer, footerSticky && formStyles.footerSticky)}
        >
          {footer}
        </Flow>
      )}
    </form>
  );
}

export type SubmitButtonProps = ButtonProps & {
  pendingText?: ReactNode;
};

export const SubmitButton = ({ children, pendingText, loading, disabled, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={loading || pending} disabled={disabled || pending} {...props}>
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}

export type FormActionState<
  TValues extends Record<string, unknown> = Record<string, unknown>,
  TErrors extends Record<string, ReactNode> = Record<string, ReactNode>
> = {
  values?: Partial<TValues>;
  errors?: Partial<TErrors>;
  formError?: ReactNode;
  message?: ReactNode;
  success?: boolean;
};

export type ShKitFormAction<TState extends FormActionState> = (
  previousState: TState,
  formData: FormData
) => TState | Promise<TState>;

export const useFormAction = <TState extends FormActionState,>(
  action: ShKitFormAction<TState>,
  initialState: TState
) => {
  const [state, formAction, isPending] = useActionState<TState, FormData>(
    action as (previousState: Awaited<TState>, formData: FormData) => TState | Promise<TState>,
    initialState as Awaited<TState>
  );

  return {
    errors: state.errors ?? {},
    formAction,
    formError: state.formError,
    isPending,
    message: state.message,
    state,
    success: state.success,
    values: state.values ?? {}
  };
}

const formStyles = {
  form: style({
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    minWidth: 0
  }),
  field: style({
    color: color.text,
    display: "grid",
    gap: space[6],
    minWidth: 0
  }),
  label: (hasError: boolean) => style({
    alignItems: "center",
    color: hasError ? color.danger : color.textMuted,
    display: "inline-flex",
    fontSize: 13,
    fontWeight: 800,
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& span:first-child": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  }),
  requiredMark: style({
    color: color.danger
  }),
  caption: (hasError: boolean) => style({
    color: hasError ? color.danger : color.textMuted,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.35
  }),
  footer: style({
    borderTop: `1px solid ${color.border}`,
    borderRadius: `0 0 ${radius.sm}px ${radius.sm}px`,
    marginTop: space[4],
    paddingTop: space[12]
  }),
  footerSticky: style({
    background: color.surface,
    bottom: 0,
    position: "sticky",
    zIndex: 1
  })
};

const resolveFormGap = (gap: FormGap) => {
  return typeof gap === "number" && gap in space ? space[gap as keyof typeof space] : gap;
}
