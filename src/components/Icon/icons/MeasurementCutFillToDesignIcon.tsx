import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementCutFillToDesignIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4 18.5H20" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5 13.5L10.5 9.5L14 12L19 8" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8.5H10.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M13.5 15H18.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7 18.5V14.6M17 18.5V9.6" stroke="currentColor" strokeWidth={MAIN_STROKE} opacity="0.32" />
    </g>
  );
}
