import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const TableIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="5" y="5" width="14" height="14" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <path d="M5 10h14" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <path d="M11 10v9" stroke="currentColor" strokeWidth={MAIN_STROKE} />
  </g>
);
