import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const LuTablePropertiesIcon = (props: ShKitIconProps) => (
  <g fill="none" stroke="currentColor" strokeWidth={MAIN_STROKE} transform="translate(0 0) scale(1)" {...props}>
    <path d="M15 3v18" /><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M21 9H3" /><path d="M21 15H3" />
  </g>
);
