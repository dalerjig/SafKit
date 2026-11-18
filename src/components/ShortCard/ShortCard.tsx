import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext
} from "react";
import { classes, style } from "typestyle";
import { Card } from "../Card";
import { Flow } from "../LayoutPrimitives";
import { Icon, type IconName } from "../Icon";
import { color, palette, radius, space } from "../../tokens";

export type ShortCardBodyVariant = "surface" | "muted";

export type ShortCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  icon?: IconName;
  titleIcon?: ReactNode;
};

export type ShortCardBodyProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ShortCardBodyVariant;
};

export type ShortCardRowProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
};

export type ShortCardValueProps = HTMLAttributes<HTMLSpanElement>;

export type ShortCardContentProps = HTMLAttributes<HTMLDivElement>;

const ShortCardCoordsContext = createContext(false);

const ShortCardRoot = ({
  title,
  icon,
  titleIcon,
  className,
  children,
  ...rest
}: ShortCardProps) => {
  const resolvedTitleIcon =
    titleIcon ?? (icon ? <Icon name={icon} size={18} color={palette.darkGreen} /> : null);

  return (
    <Card
      padding="sm"
      variant="elevated"
      className={classes(shortCardStyles.root, className)}
      {...rest}
    >
      {title && (
        <div className={shortCardStyles.header}>
          {resolvedTitleIcon}
          <span className={shortCardStyles.headerTitle}>{title}</span>
        </div>
      )}
      <Flow mode="vertical" gap={12} className={shortCardStyles.content}>
        {children}
      </Flow>
    </Card>
  );
};

const ShortCardBody = ({
  variant = "surface",
  className,
  children,
  ...rest
}: ShortCardBodyProps) => (
  <div
    className={classes(
      shortCardStyles.body(variant),
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

const ShortCardRow = ({
  label,
  className,
  children,
  ...rest
}: ShortCardRowProps) => {
  const inCoords = useContext(ShortCardCoordsContext);

  const row = (
    <div className={classes(shortCardStyles.metricRow, className)} {...rest}>
      {label && <span className={shortCardStyles.metricLabel}>{label}</span>}
      {children}
    </div>
  );

  if (inCoords) {
    return <div className={shortCardStyles.coordCell}>{row}</div>;
  }

  return row;
};

const ShortCardValue = ({
  className,
  children,
  ...rest
}: ShortCardValueProps) => (
  <span className={classes(shortCardStyles.metricValue, className)} {...rest}>
    {children}
  </span>
);

const ShortCardDivider = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={classes(shortCardStyles.rowDivider, className)} role="separator" {...rest} />
);

const ShortCardCoords = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <ShortCardCoordsContext.Provider value={true}>
    <div className={classes(shortCardStyles.coords, className)} {...rest}>
      {children}
    </div>
  </ShortCardCoordsContext.Provider>
);

const ShortCardContent = ({
  className,
  children,
  ...rest
}: ShortCardContentProps) => (
  <Flow mode="vertical" gap={12} className={classes(shortCardStyles.content, className)} {...rest}>
    {children}
  </Flow>
);

export const ShortCard = Object.assign(ShortCardRoot, {
  Body: ShortCardBody,
  Row: ShortCardRow,
  Value: ShortCardValue,
  Divider: ShortCardDivider,
  Coords: ShortCardCoords,
  Content: ShortCardContent
});

const shortCardStyles = {
  root: style({
    minWidth: 0,
    overflow: "hidden",
    width: "100%"
  }),
  header: style({
    alignItems: "center",
    display: "flex",
    gap: space[8],
    marginBottom: space[12]
  }),
  headerTitle: style({
    fontSize: 16,
    fontWeight: 600
  }),
  content: style({
    minWidth: 0,
    width: "100%"
  }),
  body: (variant: ShortCardBodyVariant) =>
    style({
      backgroundColor: variant === "muted" ? color.surfaceMuted : color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: radius.md,
      display: "flex",
      flexDirection: "column",
      gap: space[12],
      maxWidth: "100%",
      minWidth: 0,
      overflow: "hidden",
      padding: `${space[12]}px ${space[14]}px`
    }),
  metricRow: style({
    display: "flex",
    flexDirection: "column",
    gap: space[4],
    minWidth: 0
  }),
  metricLabel: style({
    color: color.text,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "15px",
    overflowWrap: "break-word",
    wordBreak: "break-word"
  }),
  metricValue: style({
    color: color.text,
    fontSize: 18,
    fontWeight: 700,
    lineHeight: "24px",
    overflowWrap: "break-word",
    wordBreak: "break-word"
  }),
  coords: style({
    alignItems: "flex-end",
    display: "flex",
    gap: space[8],
    minWidth: 0
  }),
  coordCell: style({
    flex: 1,
    minWidth: 0
  }),
  rowDivider: style({
    borderTop: `1px solid ${color.border}`,
    margin: 0
  })
};
