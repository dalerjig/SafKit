import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuMarkupsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M7 4.5H15.5L19 8V19.5H7V4.5Z"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinejoin="round"
      />
      <path d="M15.5 4.5V8H19" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinejoin="round" />
      <path d="M10 12h5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path d="M10 15.5h3.5" stroke="currentColor" strokeWidth={MAIN_STROKE} strokeLinecap="round" />
      <path
        d="M5 9.5L10.8 4.2C12.1 3 14.1 3.9 14.1 5.7C14.1 6.2 13.9 6.7 13.5 7.1L8 12.2C7.3 12.9 6.1 12.4 6.1 11.4C6.1 11.1 6.2 10.8 6.5 10.6L11.2 6.2"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}
