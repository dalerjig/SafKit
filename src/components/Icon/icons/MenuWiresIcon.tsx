import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuWiresIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M12 4L6.5 20H17.5L12 4Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M7.5 9H16.5M5 13H19M9 20L12 13L15 20M9 13L12 9L15 13" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9H20M3 13H21" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.45" strokeLinecap="round" />
    </g>
  );
};
