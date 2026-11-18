import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

/** Карты: сложенная в «гармошку» карта с зигзагом по краям. */
export const MenuViewsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M5 8.5L9 6.5L12 8.5L15 6.5L19 8.5V15.5L15 17.5L12 15.5L9 17.5L5 15.5V8.5Z"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinejoin="round"
      />
      <path d="M9 6.5V17.5M15 6.5V17.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
    </g>
  );
};
