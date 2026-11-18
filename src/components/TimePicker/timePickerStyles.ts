import { style } from "typestyle";
import { color, space } from "../../tokens";

export const timePickerStyles = {
  root: style({
    alignItems: "center",
    display: "grid",
    gap: space[8],
    gridTemplateColumns: "minmax(0, 1fr) auto"
  }),
  withDivider: style({
    borderTop: `1px solid ${color.border}`,
    paddingTop: space[8]
  }),
  label: style({
    color: color.textMuted,
    fontSize: 13,
    fontWeight: 800
  }),
  selects: style({
    alignItems: "center",
    display: "grid",
    gap: space[4],
    gridTemplateColumns: "76px auto 76px"
  }),
  select: style({
    gap: 0,
    $nest: {
      "& button": {
        background: color.surface,
        fontWeight: 900,
        padding: `0 ${space[8]}px`
      }
    }
  }),
  separator: style({
    color: color.textMuted,
    fontSize: 16,
    fontWeight: 900
  })
};
