import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ClearIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
