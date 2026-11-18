import { MAIN_STROKE, SUB_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const PointIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M12 3.5C8.7 3.5 6 6.2 6 9.5C6 14 12 20.5 12 20.5C12 20.5 18 14 18 9.5C18 6.2 15.3 3.5 12 3.5Z" fill="currentColor" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.2" fill="var(--shkit-color-surface, #FFFFFF)" stroke="var(--shkit-color-surface, #FFFFFF)" strokeWidth={MAIN_STROKE} />
      <path d="M8.5 20.5H15.5" stroke="currentColor" strokeWidth={SUB_STROKE} opacity="0.45" strokeLinecap="round" />
    </g>
  );
};
