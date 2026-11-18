import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuAnalyticsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 20H20" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="6" y="11" width="2.5" height="9" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="10.5" y="7" width="2.5" height="13" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="15" y="9" width="2.5" height="11" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M6 9H8.5M10.5 5H13M15 7H17.5" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.5" />
    </g>
  );
}
