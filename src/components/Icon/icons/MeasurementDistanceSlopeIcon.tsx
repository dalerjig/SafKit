import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementDistanceSlopeIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M5 18L19 7" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5 18H18V8" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" opacity="0.42" />
      <path d="M8.2 15.5L10.2 18" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M16 7.3L18 9.8" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
}
