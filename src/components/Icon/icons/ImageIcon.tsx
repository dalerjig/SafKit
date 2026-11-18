import type { ShKitIconProps } from "./types";

export const ImageIcon = (props: ShKitIconProps) => (
  <g {...props}>
    <rect height="16" rx="1.5" width="18" x="3" y="4" />
    <circle cx="8" cy="9" r="1.5" />
    <path d="m5 18 4.5-4.5 3 3 2.5-2.5 4 4" />
  </g>
);
