import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const StopIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" stroke="currentColor" strokeWidth={MAIN_STROKE} />
  </g>
);
