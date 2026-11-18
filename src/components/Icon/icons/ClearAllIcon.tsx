import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

/** Очистить всё: метла / сброс списка. */
export const ClearAllIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <rect x="11" y="4.5" width="2" height="3.5" rx="0.4" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <rect x="7" y="9" width="10" height="2.8" rx="0.4" stroke="currentColor" strokeWidth={MAIN_STROKE} />
      <path d="M7 12.2h10l2.2 7.3H4.8l2.2-7.3Z" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M9.5 19.5v-4M14.5 19.5v-4" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
};
