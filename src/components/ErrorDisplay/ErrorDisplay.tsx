import { type ReactNode } from "react";
import { style } from "typestyle";
import { color, radius, space, typography } from "../../tokens";
import { Alert } from "../Alert";
import { Button } from "../Button";

export type ErrorDisplaySeverity = "error" | "warning";

export type ErrorDisplayProps = {
  title?: ReactNode;
  error?: ReactNode;
  details?: ReactNode | ReactNode[];
  action?: ReactNode;
  compact?: boolean;
  severity?: ErrorDisplaySeverity;
  className?: string;
};

export const ErrorDisplay = ({
  title = "Ошибка",
  error,
  details,
  action,
  compact,
  severity = "error",
  className
}: ErrorDisplayProps) => {
  const detailItems = Array.isArray(details) ? details : details ? [details] : [];

  return (
    <Alert
      className={className}
      compact={compact}
      variant={severity === "error" ? "error" : "warning"}
      title={title}
      action={action}
    >
      <div className={errorDisplayStyles.root}>
        {error && <div className={errorDisplayStyles.message}>{error}</div>}
        {detailItems.length > 0 && (
          <details className={errorDisplayStyles.details}>
            <summary>Технические детали</summary>
            <div>
              {detailItems.map((item, index) => (
                <pre key={index}>{item}</pre>
              ))}
            </div>
          </details>
        )}
      </div>
    </Alert>
  );
}

export const ErrorRetryButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button size="sm" variant="outline" onClick={onClick}>
      Повторить
    </Button>
  );
};

const errorDisplayStyles = {
  root: style({
    display: "grid",
    gap: space[8],
    minWidth: 0
  }),
  message: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.4,
    overflowWrap: "anywhere"
  }),
  details: style({
    borderTop: `1px solid ${color.border}`,
    color: color.textMuted,
    display: "grid",
    gap: space[8],
    paddingTop: space[8],
    $nest: {
      "& summary": {
        color: color.primary,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 900
      },
      "& div": {
        display: "grid",
        gap: space[6],
        marginTop: space[8]
      },
      "& pre": {
        background: color.surface,
        border: `1px solid ${color.border}`,
        borderRadius: radius.xs,
        color: color.text,
        fontFamily: typography.monoFamily,
        fontSize: 11,
        lineHeight: 1.45,
        margin: 0,
        overflow: "auto",
        padding: space[8],
        whiteSpace: "pre-wrap"
      }
    }
  })
};
