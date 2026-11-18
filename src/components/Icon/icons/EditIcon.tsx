import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const EditIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
    <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
