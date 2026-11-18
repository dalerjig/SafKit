import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementRemovalsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 18.5H20" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5.5 12H9L11 15H15L18.5 10" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12L10 17H16L19 12" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 8.5H15.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.38" />
      <path d="M10.5 6.5L8.5 8.5L10.5 10.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" opacity="0.38" />
    </g>
  );
}
