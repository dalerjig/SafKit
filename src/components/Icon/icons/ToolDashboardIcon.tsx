import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const ToolDashboardIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M7 8H17" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M8.5 16V13.5M12 16V10.5M15.5 16V12.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
}
