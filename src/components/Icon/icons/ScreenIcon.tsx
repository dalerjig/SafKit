import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ScreenIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="5" y="5" width="14" height="10" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <path d="M12 15v4" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    <path d="M9 19h6" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
