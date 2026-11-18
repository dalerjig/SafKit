import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementCutFillIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 18.5H20" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5.5 15.5H10.5V12.5H15.5V9.5H19" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8H18" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.38" />
      <path d="M8 18.5V15.5M13 18.5V12.5M18 18.5V9.5" stroke="currentColor" strokeWidth={MAIN_STROKE} opacity="0.28" />
    </g>
  );
}
