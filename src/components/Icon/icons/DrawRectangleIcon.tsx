import type { ShKitIconProps } from "./types";

export const DrawRectangleIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect height="14" rx="1" width="14" x="5" y="5" />
    <circle cx="12" cy="5" r="1.5" fill="var(--shkit-color-surface, white)" />
    <circle cx="19" cy="12" r="1.5" fill="var(--shkit-color-surface, white)" />
    <circle cx="12" cy="19" r="1.5" fill="var(--shkit-color-surface, white)" />
    <circle cx="5" cy="12" r="1.5" fill="var(--shkit-color-surface, white)" />
  </g>
);
