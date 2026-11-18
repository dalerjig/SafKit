import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

export const MenuFilesIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M14 3.5H6.5C5.4 3.5 4.5 4.4 4.5 5.5V18.5C4.5 19.6 5.4 20.5 6.5 20.5H17.5C18.6 20.5 19.5 19.6 19.5 18.5V9L14 3.5Z"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
      />
      <path d="M14 3.5V9H19.5" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    </g>
  );
}
