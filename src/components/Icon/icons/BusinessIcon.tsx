import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const BusinessIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path
      d="M5 20V8.5A2 2 0 0 1 7 6.5h10a2 2 0 0 1 2 2V20"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
    <path d="M4 20h16" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    <path d="M9 20v-3h6v3" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    <path d="M9 9h2M13 9h2M9 13h2M13 13h2" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity={0.55} />
  </g>
);
