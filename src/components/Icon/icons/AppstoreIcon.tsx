import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const AppstoreIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
  </g>
);
