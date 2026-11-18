import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MeasurementStockpilesIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path d="M3.5 18.5H20.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M5.2 18.3C6.7 14.2 9 10 12 10C15 10 17.3 14.2 18.8 18.3" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M7.4 15.8C8.7 13.8 10.3 12.5 12 12.5C13.7 12.5 15.3 13.8 16.6 15.8" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.42" />
      <path d="M9.2 18.2C10.1 16.8 11 16.1 12 16.1C13 16.1 13.9 16.8 14.8 18.2" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.42" />
      <path d="M5.5 6.5H18.5M7.5 4.5V8.5M12 4.5V8.5M16.5 4.5V8.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" opacity="0.72" />
    </g>
  );
}
