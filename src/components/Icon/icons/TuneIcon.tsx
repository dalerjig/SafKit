import type { ShKitIconProps } from "./types";

export const TuneIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <path d="M4 7h4M12 7h8M4 12h9M17 12h3M4 17h2M10 17h10" />
    <circle cx="10" cy="7" r="2" fill="var(--shkit-color-surface, white)" />
    <circle cx="15" cy="12" r="2" fill="var(--shkit-color-surface, white)" />
    <circle cx="8" cy="17" r="2" fill="var(--shkit-color-surface, white)" />
  </g>
);
