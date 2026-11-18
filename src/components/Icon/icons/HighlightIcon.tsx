import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const HighlightIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M4 19h16" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    <path
      d="M7 16l9-9 3 3-9 9H7v-3z"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
  </g>
);
