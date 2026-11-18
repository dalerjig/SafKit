import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementAreaIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M6 6.5L17.5 4.5L20 13.5L13.5 19.5L4.5 16.5L6 6.5Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M7.5 15.5L15.5 6.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.42" />
      <path d="M11.5 17L18 9.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.42" />
      <circle cx="6" cy="6.5" r="1.25" fill="currentColor" />
      <circle cx="17.5" cy="4.5" r="1.25" fill="currentColor" />
      <circle cx="20" cy="13.5" r="1.25" fill="currentColor" />
      <circle cx="13.5" cy="19.5" r="1.25" fill="currentColor" />
      <circle cx="4.5" cy="16.5" r="1.25" fill="currentColor" />
    </g>
  );
}
