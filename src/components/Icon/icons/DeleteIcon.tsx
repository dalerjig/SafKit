import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const DeleteIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M4.5 7.5H19.5M9 7.5V5.25C9 4.83579 9.33579 4.5 9.75 4.5H14.25C14.6642 4.5 15 4.83579 15 5.25V7.5M7.5 7.5V18.75C7.5 19.5784 8.17157 20.25 9 20.25H15C15.8284 20.25 16.5 19.5784 16.5 18.75V7.5"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 11.25V16.5M13.5 11.25V16.5"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinecap="round"
      />
    </g>
  );
}
