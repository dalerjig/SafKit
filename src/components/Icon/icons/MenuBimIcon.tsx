import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuBimIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M12 3L4.5 7V17L12 21L19.5 17V7L12 3Z" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M12 3V12M12 12L19.5 7M12 12L4.5 7M12 12V21" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8.5 9.5L12 7.5L15.5 9.5V14.5L12 16.5L8.5 14.5Z" stroke="currentColor" strokeWidth={SUB_STROKE} />
    </g>
  );
}
