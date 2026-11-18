import { MAIN_STROKE } from "./iconStrokes";
import type { ShKitIconProps } from "./types";

/** Настройки: шестерёнка outline (как IoSettingsOutline). */
export const SettingsIcon = (props: ShKitIconProps) => {
  return (
    <g {...props}>
      <path
        d="M10.33 4.32c.43-1.76 2.92-1.76 3.35 0a1.72 1.72 0 0 0 2.57 1.07c1.54-.94 3.31.83 2.37 2.37a1.72 1.72 0 0 0 1.07 2.57c1.76.43 1.76 2.92 0 3.35a1.72 1.72 0 0 0-1.07 2.57c.94 1.54-.83 3.31-2.37 2.37a1.72 1.72 0 0 0-2.57 1.07c-.43 1.76-2.92 1.76-3.35 0a1.72 1.72 0 0 0-2.57-1.07c-1.54.94-3.31-.83-2.37-2.37a1.72 1.72 0 0 0-1.07-2.57c-1.76-.43-1.76-2.92 0-3.35a1.72 1.72 0 0 0 1.07-2.57c-.94-1.54.83-3.31 2.37-2.37.99.61 2.3.07 2.57-1.07Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={MAIN_STROKE}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.9" fill="none" stroke="currentColor" strokeWidth={MAIN_STROKE} />
    </g>
  );
};
