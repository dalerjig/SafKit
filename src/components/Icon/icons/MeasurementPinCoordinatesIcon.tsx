import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementPinCoordinatesIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M5 19H19" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5 19V5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M17.5 19L19.2 17.3M19.2 19L17.5 17.3" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M4.2 5.2L5 4L5.8 5.2" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12.5" cy="11.5" r="3.7" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M12.5 7.8V15.2M8.8 11.5H16.2" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
}
