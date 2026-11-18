import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, palette, radius, space } from "../../tokens";

export type ResultStatus = "success" | "error" | "warning" | "info";

export type ResultProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  status?: ResultStatus;
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  icon?: ReactNode;
};

const statusColor: Record<ResultStatus, string> = {
  success: palette.babyGreen,
  error: palette.red,
  warning: palette.orange,
  info: palette.darkGreen
};

const statusSymbol: Record<ResultStatus, string> = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i"
};

export const Result = ({
  status = "info",
  title,
  subtitle,
  actions,
  compact,
  icon,
  className,
  ...rest
}: ResultProps) => {
  return (
    <div className={classes(resultStyles.root(compact), className)} role="status" {...rest}>
      <div className={resultStyles.icon(status, compact)} aria-hidden="true">
        {icon ?? statusSymbol[status]}
      </div>
      <div className={resultStyles.content}>
        {title && <strong>{title}</strong>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className={resultStyles.actions}>{actions}</div>}
    </div>
  );
}

const resultStyles = {
  root: (compact?: boolean) =>
    style({
      alignItems: "center",
      color: color.text,
      display: "grid",
      gap: compact ? space[10] : space[16],
      justifyItems: "center",
      minWidth: 0,
      padding: compact ? space[14] : space[28],
      textAlign: "center"
    }),
  icon: (status: ResultStatus, compact?: boolean) =>
    style({
      alignItems: "center",
      background: status === "success" ? "rgba(189, 220, 15, 0.2)" : color.surfaceMuted,
      border: `1px solid ${statusColor[status]}`,
      borderRadius: radius.round,
      color: statusColor[status],
      display: "inline-flex",
      fontSize: compact ? 18 : 26,
      fontWeight: 900,
      height: compact ? 44 : 64,
      justifyContent: "center",
      lineHeight: 1,
      width: compact ? 44 : 64
    }),
  content: style({
    display: "grid",
    gap: space[6],
    justifyItems: "center",
    minWidth: 0,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 20,
        fontWeight: 900,
        lineHeight: 1.2,
        overflowWrap: "anywhere"
      },
      "& p": {
        color: color.textMuted,
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.45,
        margin: 0,
        maxWidth: 460,
        overflowWrap: "anywhere"
      }
    }
  }),
  actions: style({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space[8],
    justifyContent: "center"
  })
};
