import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuPrintIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="6.5" y="3.5" width="11" height="5" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="4" y="9.5" width="16" height="7" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="7" y="14.5" width="10" height="6" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <circle cx="17.2" cy="12.8" r="0.9" fill="currentColor" />
    </g>
  );
}
