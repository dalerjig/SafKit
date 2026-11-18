import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuOverlaysIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M12 4L20 8L12 12L4 8L12 4Z" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M6 14L12 17L18 14" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.5" />
    </g>
  );
}
