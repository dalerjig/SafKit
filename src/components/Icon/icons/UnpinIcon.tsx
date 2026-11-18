import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const UnpinIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M9 4.5h6" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    <path
      d="M10.5 4.5 11.5 10l-2.5 2.5V14h7v-1.5L13.5 10l1-5.5"
      stroke="currentColor"
      strokeWidth={MAIN_STROKE}
      strokeLinejoin="round"
    />
    <path d="M12 14v5.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    <path d="M6 20l14-14" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
  </g>
);
