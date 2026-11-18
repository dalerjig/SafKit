import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const TagIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M4.5 12V6.5A1.5 1.5 0 0 1 6 5h5.5l7.5 7.5-5.5 5.5L4.5 12z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
    <circle cx="9" cy="9" r="1.1" stroke="currentColor" strokeWidth={MAIN_STROKE} />
  </g>
);
