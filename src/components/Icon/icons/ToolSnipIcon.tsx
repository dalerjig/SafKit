import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ToolSnipIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8 8L10.5 10.5M16 8L13.5 10.5M8 16L10.5 13.5M16 16L13.5 13.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M12 6.8V9.2M12 14.8V17.2M6.8 12H9.2M14.8 12H17.2" stroke="currentColor" strokeWidth={SUB_STROKE} />
    </g>
  );
}
