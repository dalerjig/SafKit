import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementCrossSectionIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4.5 18.5V5.5H19.5V18.5H4.5Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M7 15.5L9.6 12.3L12.2 14.3L15 9.2L18 12.6" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8H18" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.32" />
      <circle cx="9.6" cy="12.3" r="0.9" fill="currentColor" />
      <circle cx="15" cy="9.2" r="0.9" fill="currentColor" />
    </g>
  );
}
