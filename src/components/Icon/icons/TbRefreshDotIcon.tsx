import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const TbRefreshDotIcon = (props: ShKitIconProps) => (
  <g fill="none" stroke="currentColor" strokeWidth={MAIN_STROKE} transform="translate(0 0) scale(1)" {...props}>
    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </g>
);
