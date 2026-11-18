import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementCounterIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M8 8.5C8 7.7 8.6 7 9.4 7C10.2 7 10.8 7.7 10.8 8.5V11.5C10.8 12.3 10.2 13 9.4 13C8.6 13 8 12.3 8 11.5V8.5Z" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M14 13V7L12.8 8.1" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 16.5H16.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.34" />
    </g>
  );
}
