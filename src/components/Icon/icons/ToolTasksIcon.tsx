import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ToolTasksIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="5" y="4.5" width="14" height="15" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8.2 9L9.6 10.4L12 8" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 8.9H16.3M13.5 12H16.3M8.2 14.2L9.6 15.6L12 13.2M13.5 15.1H16.3" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7 4.5V3.4H17V4.5" stroke="currentColor" strokeWidth={SUB_STROKE} />
    </g>
  );
}
