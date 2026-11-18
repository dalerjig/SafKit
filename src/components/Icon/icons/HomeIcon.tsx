import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const HomeIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M4.5 10.5 12 5l7.5 5.5V19a1 1 0 0 1-1 1h-4v-5h-3v5H5.5a1 1 0 0 1-1-1v-8.5z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
  </g>
);
