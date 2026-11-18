import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuScansIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="4" y="4" width="16" height="16" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M7 8H17M7 11H14M7 14H12" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M15 13L18 16L15 19" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M4 6H6M18 6H20M4 18H6M18 18H20" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.5" />
    </g>
  );
}
