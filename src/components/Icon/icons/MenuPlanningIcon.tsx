import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuPlanningIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="4.5" y="5.5" width="15" height="13" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8 3.5V7M16 3.5V7M4.5 9.5H19.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7.5 12.5H11M7.5 15.5H14.5M13 12.5H16.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
}
