import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const EyeClosedIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M2.5 12s4-6.5 9.5-6.5S21.5 12 21.5 12s-4 6.5-9.5 6.5S2.5 12 2.5 12z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      opacity={0.45}
    />
    <path d="M5.5 18.5L18.5 5.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
