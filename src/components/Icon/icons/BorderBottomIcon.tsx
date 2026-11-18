import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const BorderBottomIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="1" stroke="currentColor" strokeWidth={MAIN_STROKE} opacity={0.45} />
    <path d="M5 19h14" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
