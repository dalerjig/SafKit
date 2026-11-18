import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuExhibitsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="4" y="4" width="16" height="10" rx="1.2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8 20H16M12 14V20" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M6.5 11L9.5 8.5L12 10L16.5 7" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <circle cx="9.5" cy="8.5" r="0.9" fill="currentColor" />
      <circle cx="16.5" cy="7" r="0.9" fill="currentColor" />
    </g>
  );
}
