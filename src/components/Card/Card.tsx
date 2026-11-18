import { type HTMLAttributes, type ReactNode } from "react";
import { classes, style } from "typestyle";
import { color, radius, shadow, space } from "../../tokens";

export type CardVariant = "plain" | "outlined" | "elevated";
export type CardPadding = "none" | "sm" | "md";
export type CardTitleAlign = "start" | "center";
export type CardTitleSize = "default" | "prominent";

export type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  subtitle?: ReactNode;
  titleIcon?: ReactNode;
  titleSize?: CardTitleSize;
  titleAlign?: CardTitleAlign;
  headerDivider?: boolean;
  hoverable?: boolean;
  actions?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  as?: "article" | "section" | "div";
};

const paddingValues: Record<CardPadding, number> = {
  none: 0,
  sm: space[12],
  md: space[16],
};

const variantStyles: Record<CardVariant, string> = {
  plain: style({
    background: "transparent",
    borderColor: "transparent",
  }),
  outlined: style({
    background: color.surface,
    borderColor: color.border,
    boxShadow: shadow.raised,
  }),
  elevated: style({
    background: color.surface,
    borderColor: color.border,
    boxShadow: shadow.raised,
  }),
};

export const Card = ({
  title,
  subtitle,
  titleIcon,
  titleSize = "default",
  titleAlign = "start",
  headerDivider,
  hoverable,
  actions,
  footer,
  variant = "outlined",
  padding = "md",
  as: Element = "section",
  className,
  children,
  ...rest
}: CardProps) => {
  const hasHeader = Boolean(title || subtitle || titleIcon || actions);
  const showHeaderDivider =
    headerDivider ?? (hasHeader && Boolean(children || footer));
  const isHoverable = hoverable ?? variant !== "plain";

  return (
    <Element
      className={classes(
        cardStyles.root(padding),
        variantStyles[variant],
        isHoverable && cardStyles.hoverable,
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <header
          className={classes(
            cardStyles.header,
            !actions && cardStyles.headerWithoutActions,
            showHeaderDivider && cardStyles.headerWithDivider,
          )}
        >
          <div
            className={classes(
              cardStyles.titleRow,
              titleAlign === "center" && cardStyles.titleRowCenter,
              !actions && cardStyles.titleRowWithoutActions,
            )}
          >
            {titleIcon && (
              <span className={cardStyles.titleIcon}>{titleIcon}</span>
            )}
            <div
              className={classes(
                cardStyles.heading,
                titleAlign === "center" && cardStyles.headingCenter,
              )}
            >
              {title && (
                <h3 className={cardStyles.title(titleSize)}>{title}</h3>
              )}
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
          {actions && <div className={cardStyles.actions}>{actions}</div>}
        </header>
      )}
      {children && <div className={cardStyles.body}>{children}</div>}
      {footer && <footer className={cardStyles.footer}>{footer}</footer>}
    </Element>
  );
};

const cardStyles = {
  root: (padding: CardPadding) =>
    style({
      border: "1px solid",
      borderRadius: radius.md,
      boxSizing: "border-box",
      color: color.text,
      display: "grid",
      gap: padding === "none" ? 0 : space[12],
      minWidth: 0,
      padding: paddingValues[padding],
    }),
  hoverable: style({
    cursor: "default",
    transition:
      "border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
    $nest: {
      "&:hover": {
        borderColor: color.borderStrong,
        boxShadow: shadow.panel,
        transform: "translateY(-1px)",
      },
    },
  }),
  header: style({
    alignItems: "flex-start",
    display: "grid",
    gap: space[12],
    gridTemplateColumns: "minmax(0, 1fr) auto",
    minWidth: 0,
  }),
  headerWithoutActions: style({
    gridTemplateColumns: "minmax(0, 1fr)",
  }),
  headerWithDivider: style({
    borderBottom: `1px solid ${color.border}`,
    marginBottom: space[4],
    paddingBottom: space[12],
  }),
  titleRow: style({
    alignItems: "flex-start",
    display: "flex",
    gap: space[10],
    gridColumn: "1",
    minWidth: 0,
  }),
  titleRowWithoutActions: style({
    gridColumn: "1 / -1",
  }),
  titleRowCenter: style({
    justifyContent: "center",
    textAlign: "center",
  }),
  titleIcon: style({
    alignItems: "center",
    color: color.primary,
    display: "inline-flex",
    flexShrink: 0,
    height: 28,
    justifyContent: "center",
    marginTop: 1,
    width: 28,
    $nest: {
      "& svg": {
        display: "block",
      },
    },
  }),
  heading: style({
    display: "grid",
    flex: "1 1 auto",
    gap: space[4],
    minWidth: 0,
    $nest: {
      "& p": {
        color: color.textMuted,
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1.35,
        margin: 0,
      },
    },
  }),
  title: (size: CardTitleSize) =>
    style({
      color: color.text,
      fontSize: size === "prominent" ? 22 : 18,
      fontWeight: 900,
      letterSpacing: size === "prominent" ? "-0.01em" : undefined,
      lineHeight: 1.2,
      margin: 0,
      overflowWrap: "anywhere",
    }),
  headingCenter: style({
    textAlign: "center",
  }),
  actions: style({
    alignItems: "center",
    display: "inline-flex",
    gap: space[8],
    gridColumn: "2",
    gridRow: "1",
    justifyContent: "flex-end",
  }),
  body: style({
    minWidth: 0,
  }),
  footer: style({
    borderTop: `1px solid ${color.border}`,
    paddingTop: space[12],
  }),
};
