import { type ReactNode } from "react";
import { classes, style } from "typestyle";
import { HEADER_HEIGHT, RESPONSIVE_BREAKPOINTS, color, space } from "../../tokens";

export type HeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export const Header = ({ left, center, right, className }: HeaderProps) => {
  return (
    <header className={classes(headerStyles.root, className)}>
      <div className={headerStyles.left}>{left}</div>
      <div className={headerStyles.center}>{center}</div>
      <div className={headerStyles.right}>{right}</div>
    </header>
  );
}

export const HeaderDate = ({ day, caption }: { day: ReactNode; caption: ReactNode }) => {
  return (
    <div className={headerStyles.dateBlock}>
      <strong>{day}</strong>
      <span>{caption}</span>
    </div>
  );
}

const headerStyles = {
  root: style({
    alignItems: "center",
    display: "grid",
    gap: space[16],
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    minHeight: HEADER_HEIGHT,
    padding: `0 ${space[20]}px`,
    $nest: {
      [`@media (max-width: ${RESPONSIVE_BREAKPOINTS.M}px)`]: {
        gap: space[8],
        gridTemplateColumns: "44px minmax(0, 1fr) auto",
        minHeight: 46,
        padding: `0 ${space[8]}px`
      }
    }
  }),
  left: style({
    alignItems: "center",
    display: "flex",
    gap: space[14],
    minWidth: 0
  }),
  center: style({
    alignItems: "center",
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
  }),
  right: style({
    alignItems: "center",
    display: "flex",
    gap: space[12],
    justifyContent: "flex-end",
    minWidth: 0
  }),
  dateBlock: style({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
    minWidth: 48,
    $nest: {
      "& strong": {
        color: color.text,
        fontSize: 24,
        fontWeight: 900
      },
      "& span": {
        color: color.textSubtle,
        fontSize: 11,
        fontWeight: 800,
        marginTop: 4
      }
    }
  })
};
