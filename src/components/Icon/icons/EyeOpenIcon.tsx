import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const EyeOpenIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M2.5 12s4-6.5 9.5-6.5S21.5 12 21.5 12s-4 6.5-9.5 6.5S2.5 12 2.5 12z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
    />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth={MAIN_STROKE} />
  </g>
);
