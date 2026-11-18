import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, space } from "../../tokens";

export type EmptyVariant = "default" | "compact";

export type EmptyProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  variant?: EmptyVariant;
};

export const Empty = ({
  title = "Нет данных",
  description,
  action,
  icon,
  variant = "default",
  className,
  ...rest
}: EmptyProps) => {
  const compact = variant === "compact";

  return (
    <div className={classes(emptyStyles.root(compact), className)} role="status" {...rest}>
      <div className={emptyStyles.icon(compact)} aria-hidden="true">
        {icon ?? <span />}
      </div>
      <div className={emptyStyles.content}>
        {title && <strong>{title}</strong>}
        {description && <p>{description}</p>}
      </div>
      {action && <div className={emptyStyles.action}>{action}</div>}
    </div>
  );
}

const emptyStyles = {
  root: (compact: boolean) =>
    style({
      alignItems: "center",
      color: color.text,
      display: "grid",
      gap: compact ? space[8] : space[12],
      justifyItems: "center",
      minWidth: 0,
      padding: compact ? space[12] : space[24],
      textAlign: "center"
    }),
  icon: (compact: boolean) =>
    style({
      alignItems: "center",
      background: color.surfaceSecondary,
      border: `1px solid ${color.border}`,
      borderRadius: radius.round,
      color: color.primary,
      display: "inline-flex",
      height: compact ? 36 : 52,
      justifyContent: "center",
      width: compact ? 36 : 52,
      $nest: {
        "& span": {
          background:
            "linear-gradient(90deg, currentColor 0 38%, transparent 38% 62%, currentColor 62%), linear-gradient(currentColor, currentColor)",
          borderRadius: radius.xs,
          display: "block",
          height: compact ? 14 : 18,
          opacity: 0.72,
          width: compact ? 18 : 24
        }
      }
    }),
  content: style({
    display: "grid",
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& strong": {
        color: color.primary,
        fontSize: 16,
        fontWeight: 900,
        lineHeight: 1.25
      },
      "& p": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.4,
        margin: 0,
        maxWidth: 360,
        overflowWrap: "anywhere"
      }
    }
  }),
  action: style({
    alignItems: "center",
    display: "inline-flex",
    justifyContent: "center"
  })
};
