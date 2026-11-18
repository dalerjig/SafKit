import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuCompareSurfacesIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="3.5" y="5.5" width="7" height="13" rx="1" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="13.5" y="5.5" width="7" height="13" rx="1" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M11 8L13 6M11 12L13 10M11 16L13 14" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7 5.5V18.5M17 5.5V18.5" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.4" />
    </g>
  );
}
