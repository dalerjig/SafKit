import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ToolDrawIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 18.5H9L18.5 9L15 5.5L5.5 15V20H4V18.5Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M13.8 6.7L17.3 10.2" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7 17.5L10 14.5" stroke="currentColor" strokeWidth={SUB_STROKE} />
    </g>
  );
}
