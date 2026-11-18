import type { ShKitIconProps } from "./types";

export const LineSegmentIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="m6.5 17.5 11-11" />
    <circle cx="5.5" cy="18.5" r="2" fill="var(--shkit-color-surface, white)" />
    <circle cx="18.5" cy="5.5" r="2" fill="var(--shkit-color-surface, white)" />
  </g>
);
