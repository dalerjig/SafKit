import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const TbMathXyIcon = (props: ShKitIconProps) => (
  <g fill="none" stroke="currentColor" strokeWidth={MAIN_STROKE} transform="translate(0 0) scale(1)" {...props}>
    <path d="M14 9l3 5.063" /><path d="M4 9l6 6" /><path d="M4 15l6 -6" /><path d="M20 9l-4.8 9" />
  </g>
);
