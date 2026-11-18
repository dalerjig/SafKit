import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementElevationIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M4.5 19H19.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M12 5V17" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M7 10H17" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <circle cx="12" cy="10" r="4.25" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
    </g>
  );
}
