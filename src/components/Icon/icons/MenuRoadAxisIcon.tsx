import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuRoadAxisIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M10.5 3.5H13.5L19 21H5L10.5 3.5Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M12 5.5V8M12 10.5V13.5M12 16.5V20" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M10.5 4L8.5 21M13.5 4L15.5 21" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.4" />
    </g>
  );
}
